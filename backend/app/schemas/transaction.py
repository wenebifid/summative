from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class TransactionBase(BaseModel):
    transaction_id: str
    transaction_type: str
    category: str
    amount: float
    fee: float
    sender: Optional[str] = None
    recipient: Optional[str] = None
    agent: Optional[str] = None
    details: Optional[str] = None
    timestamp: datetime
    raw_message: str

class Transaction(TransactionBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class TransactionCreate(TransactionBase):
    pass

class TypeDistribution(BaseModel):
    type: str
    count: int
    amount: float

class DailyVolume(BaseModel):
    date: str
    count: int
    amount: float

class TransactionSummary(BaseModel):
    total_transactions: int
    total_amount: float
    avg_amount: float
    type_distribution: List[TypeDistribution]
    daily_volume: List[DailyVolume]

class ProcessingResult(BaseModel):
    success: bool
    file_name: str
    summary: Dict[str, Any]
