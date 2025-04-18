from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os
import json
from typing import List, Optional
from datetime import datetime, timedelta

from app.db.database import get_db, engine
from app.db import models
from app.schemas import transaction as transaction_schema
from app.schemas import user as user_schema
from app.services import sms_processor
from app.core import security

# Initialize models
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MoMo SMS Analytics API",
    description="API for processing and analyzing MoMo SMS data",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Authentication endpoints
@app.post("/api/auth/register", response_model=user_schema.User)
def register_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=user_schema.Token)
def login(user_credentials: user_schema.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not security.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# SMS Processing endpoints
@app.post("/api/upload", response_model=transaction_schema.ProcessingResult)
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db), 
                     current_user: user_schema.User = Depends(security.get_current_user)):
    if not file.filename.endswith('.xml'):
        raise HTTPException(status_code=400, detail="Only XML files are allowed")
    
    # Save the uploaded file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    # Process the XML file
    try:
        result = sms_processor.process_sms_data(file_path, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.get("/api/transactions", response_model=List[transaction_schema.Transaction])
def get_transactions(
    skip: int = 0, 
    limit: int = 100,
    transaction_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(security.get_current_user)
):
    query = db.query(models.Transaction)
    
    # Apply filters
    if transaction_type:
        query = query.filter(models.Transaction.transaction_type == transaction_type)
    
    if start_date:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        query = query.filter(models.Transaction.timestamp >= start_date_obj)
    
    if end_date:
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
        end_date_obj = end_date_obj + timedelta(days=1)  # Include the end date
        query = query.filter(models.Transaction.timestamp < end_date_obj)
    
    if min_amount is not None:
        query = query.filter(models.Transaction.amount >= min_amount)
    
    if max_amount is not None:
        query = query.filter(models.Transaction.amount <= max_amount)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Transaction.transaction_id.like(search_term)) |
            (models.Transaction.sender.like(search_term)) |
            (models.Transaction.recipient.like(search_term)) |
            (models.Transaction.raw_message.like(search_term))
        )
    
    # Order by timestamp descending
    query = query.order_by(models.Transaction.timestamp.desc())
    
    # Apply pagination
    transactions = query.offset(skip).limit(limit).all()
    return transactions

@app.get("/api/transactions/{transaction_id}", response_model=transaction_schema.Transaction)
def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(security.get_current_user)
):
    transaction = db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@app.get("/api/summary", response_model=transaction_schema.TransactionSummary)
def get_summary(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: user_schema.User = Depends(security.get_current_user)
):
    query = db.query(models.Transaction)
    
    # Apply date filters
    if start_date:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        query = query.filter(models.Transaction.timestamp >= start_date_obj)
    
    if end_date:
        end_date_obj = datetime.strptime(end_date, "%Y-%m-%d")
        end_date_obj = end_date_obj + timedelta(days=1)  # Include the end date
        query = query.filter(models.Transaction.timestamp < end_date_obj)
    
    transactions = query.all()
    
    # Calculate summary statistics
    total_transactions = len(transactions)
    total_amount = sum(tx.amount for tx in transactions)
    avg_amount = total_amount / total_transactions if total_transactions > 0 else 0
    
    # Count by transaction type
    type_counts = {}
    type_amounts = {}
    for tx in transactions:
        tx_type = tx.transaction_type
        if tx_type in type_counts:
            type_counts[tx_type] += 1
            type_amounts[tx_type] += tx.amount
        else:
            type_counts[tx_type] = 1
            type_amounts[tx_type] = tx.amount
    
    # Daily transaction volume
    daily_volume = {}
    for tx in transactions:
        date_str = tx.timestamp.strftime("%Y-%m-%d")
        if date_str in daily_volume:
            daily_volume[date_str]["count"] += 1
            daily_volume[date_str]["amount"] += tx.amount
        else:
            daily_volume[date_str] = {"count": 1, "amount": tx.amount}
    
    # Convert to list for response
    daily_volume_list = [
        {"date": date, "count": data["count"], "amount": data["amount"]}
        for date, data in daily_volume.items()
    ]
    
    return {
        "total_transactions": total_transactions,
        "total_amount": total_amount,
        "avg_amount": avg_amount,
        "type_distribution": [
            {"type": tx_type, "count": count, "amount": type_amounts[tx_type]}
            for tx_type, count in type_counts.items()
        ],
        "daily_volume": sorted(daily_volume_list, key=lambda x: x["date"])
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
