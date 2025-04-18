from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    
    transactions = relationship("Transaction", back_populates="user")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    transaction_type = Column(String, index=True)
    category = Column(String, index=True)
    amount = Column(Float)
    fee = Column(Float, default=0.0)
    sender = Column(String, nullable=True)
    recipient = Column(String, nullable=True)
    agent = Column(String, nullable=True)
    details = Column(String, nullable=True)
    timestamp = Column(DateTime, index=True)
    raw_message = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="transactions")
