import xml.etree.ElementTree as ET
import re
import pandas as pd
import json
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from typing import Dict, List, Any, Optional
import os

from app.db import models

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='sms_processing.log'
)
logger = logging.getLogger('sms_processor')

# Define patterns for different transaction types
TRANSACTION_PATTERNS = {
    'incoming_money': r'You have received (\d+(?:\.\d+)?) RWF from (.+?)\. Transaction ID: (.+?)\. Date: (.+?)\.?',
    'outgoing_payment': r'TxId: (.+?)\. Your payment of (\d+(?:\.\d+)?) RWF to (.+?) has been completed\. Date: (.+?)\.?',
    'airtime_payment': r'\*162\*TxId:(.+?)\*S\*Your payment of (\d+(?:\.\d+)?) RWF to Airtime has been completed\. Fee: (\d+(?:\.\d+)?) RWF\. Date: (.+?)\.?',
    'cash_power': r'Payment of (\d+(?:\.\d+)?) RWF to Cash Power (.+?) completed\. TxID: (.+?), Date: (.+?)\.?',
    'withdrawal': r'You (.+?) have via agent: (.+?), withdrawn (\d+(?:\.\d+)?) RWF on (.+?)\.?',
    'bank_transfer': r'Your bank transfer of (\d+(?:\.\d+)?) RWF to (.+?) has been completed\. TxID: (.+?), Date: (.+?)\.?',
    'internet_bundle': r'Yello! You have purchased an internet bundle of (.+?) for (\d+(?:\.\d+)?) RWF valid for (.+?)\.?',
    'third_party': r'(.+?) has initiated a transaction of (\d+(?:\.\d+)?) RWF\. TxID: (.+?), Date: (.+?)\.?',
    'bank_deposit': r'Your deposit of (\d+(?:\.\d+)?) RWF to (.+?) has been completed\. TxID: (.+?), Date: (.+?)\.?'
}

def identify_transaction_type(message: str) -> str:
    """Identify the transaction type based on message content"""
    for tx_type, pattern in TRANSACTION_PATTERNS.items():
        if re.search(pattern, message):
            return tx_type
    return 'unknown'

def parse_date(date_str: str) -> datetime:
    """Parse date from various formats"""
    date_formats = [
        '%Y-%m-%d %H:%M:%S',
        '%d/%m/%Y %H:%M:%S',
        '%d-%m-%Y %H:%M:%S',
        '%Y/%m/%d %H:%M:%S'
    ]
    
    date_str = date_str.strip()
    
    for fmt in date_formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    
    logger.warning(f"Could not parse date: {date_str}")
    return datetime.now()

def extract_transaction_data(message: str, tx_type: str) -> Optional[Dict[str, Any]]:
    """Extract structured data from SMS based on transaction type"""
    try:
        pattern = TRANSACTION_PATTERNS[tx_type]
        match = re.search(pattern, message)
        
        if not match:
            return None
        
        # Base transaction object
        transaction = {
            'transaction_type': tx_type,
            'raw_message': message,
            'processed_date': datetime.now()
        }
        
        # Extract data based on transaction type
        if tx_type == 'incoming_money':
            amount, sender, tx_id, date_str = match.groups()
            transaction.update({
                'transaction_id': tx_id.strip(),
                'amount': float(amount),
                'sender': sender.strip(),
                'recipient': None,
                'timestamp': parse_date(date_str),
                'fee': 0.0
            })
            
        elif tx_type == 'outgoing_payment':
            tx_id, amount, recipient, date_str = match.groups()
            transaction.update({
                'transaction_id': tx_id.strip(),
                'amount': float(amount),
                'sender': None,
                'recipient': recipient.strip(),
                'timestamp': parse_date(date_str),
                'fee': 0.0
            })
            
        elif tx_type == 'airtime_payment':
            tx_id, amount, fee, date_str = match.groups()
            transaction.update({
                'transaction_id': tx_id.strip(),
                'amount': float(amount),
                'sender': None,
                'recipient': 'Airtime',
                'timestamp': parse_date(date_str),
                'fee': float(fee),
                'details': 'Airtime Purchase'
            })
            
        elif tx_type == 'cash_power':
            amount, meter_number, tx_id, date_str = match.groups()
            transaction.update({
                'transaction_id': tx_id.strip(),
                'amount': float(amount),
                'sender': None,
                'recipient': f'Cash Power {meter_number.strip()}',
                'timestamp': parse_date(date_str),
                'fee': 0.0,
                'details': f'Cash Power Payment for meter {meter_number.strip()}'
            })
            
        elif tx_type == 'withdrawal':
            user, agent, amount, date_str = match.groups()
            transaction.update({
                'transaction_id': f"W{datetime.now().strftime('%Y%m%d%H%M%S')}",
                'amount': float(amount),
                'sender': None,
                'recipient': None,
                'agent': agent.strip(),
                'timestamp': parse_date(date_str),
                'fee': 0.0,
                'details': f'Withdrawal via agent {agent.strip()}'
            })
            
        elif tx_type == 'bank_transfer':
            amount, bank_account, tx_id, date_str = match.groups()
            transaction.update({
                'transaction_id': tx_id.strip(),
                'amount': float(amount),
                'sender': None,
                'recipient': bank_account.strip(),
                'timestamp': parse_date(date_str),
                'fee': 0.0,
                'details': f'Bank Transfer to {bank_account.strip()}'
            })
            
        elif tx_type == 'internet_bundle':
            bundle_size, amount, validity = match.groups()
            transaction.update({
                'transaction_id': f"B{datetime.now().strftime('%Y%m%d%H%M%S')}",
                'amount': float(amount),
                'sender': None,
                'recipient': 'Internet Bundle',
                'timestamp': datetime.now(),
                'fee': 0.0,
                'details': f'{bundle_size.strip()} valid for {validity.strip()}'
            })
            
        elif tx_type == 'third_party':
            initiator, amount, tx_id, date_str = match.groups()
            transaction.update({
                'transaction_id': tx_id.strip(),
                'amount': float(amount),
                'sender': initiator.strip(),
                'recipient': None,
                'timestamp': parse_date(date_str),
                'fee': 0.0,
                'details': f'Initiated by {initiator.strip()}'
            })
            
        elif tx_type == 'bank_deposit':
            amount, bank_account, tx_id, date_str = match.groups()
            transaction.update({
                'transaction_id': tx_id.strip(),
                'amount': float(amount),
                'sender': None,
                'recipient': bank_account.strip(),
                'timestamp': parse_date(date_str),
                'fee': 0.0,
                'details': f'Bank Deposit to {bank_account.strip()}'
            })
            
        return transaction
        
    except Exception as e:
        logger.error(f"Error extracting transaction data: {str(e)}")
        return None

def extract_sms_data(xml_root) -> List[Dict[str, Any]]:
    """Extract SMS data from XML and categorize by transaction type"""
    transactions = []
    unprocessed = []
    
    # Find all SMS elements
    sms_elements = xml_root.findall('.//sms')
    logger.info(f"Found {len(sms_elements)} SMS messages in XML file")
    
    for sms in sms_elements:
        try:
            # Extract the SMS body text
            body = sms.find('body').text
            
            # Identify transaction type
            tx_type = identify_transaction_type(body)
            
            if tx_type != 'unknown':
                # Extract data based on transaction type
                transaction_data = extract_transaction_data(body, tx_type)
                if transaction_data:
                    transactions.append(transaction_data)
                else:
                    unprocessed.append(body)
            else:
                unprocessed.append(body)
                
        except Exception as e:
            logger.error(f"Error processing SMS: {str(e)}")
            unprocessed.append(body if 'body' in locals() else "Unknown SMS")
    
    logger.info(f"Processed {len(transactions)} transactions")
    logger.info(f"Unprocessed {len(unprocessed)} messages")
    
    # Save unprocessed messages for review
    with open('unprocessed_sms.txt', 'w') as f:
        for msg in unprocessed:
            f.write(f"{msg}\n")
    
    return transactions

def clean_and_normalize_data(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Clean and normalize the extracted transaction data"""
    cleaned_transactions = []
    
    for tx in transactions:
        # Ensure all transactions have the same fields
        cleaned_tx = {
            'transaction_id': tx.get('transaction_id', ''),
            'transaction_type': tx.get('transaction_type', 'unknown'),
            'amount': float(tx.get('amount', 0)),
            'fee': float(tx.get('fee', 0)),
            'sender': tx.get('sender', None),
            'recipient': tx.get('recipient', None),
            'agent': tx.get('agent', None),
            'details': tx.get('details', None),
            'timestamp': tx.get('timestamp', datetime.now()),
            'raw_message': tx.get('raw_message', '')
        }
        
        # Additional cleaning steps
        # 1. Normalize transaction types to consistent categories
        if cleaned_tx['transaction_type'] == 'incoming_money':
            cleaned_tx['category'] = 'INCOMING'
        elif cleaned_tx['transaction_type'] in ['outgoing_payment', 'airtime_payment', 'cash_power']:
            cleaned_tx['category'] = 'PAYMENT'
        elif cleaned_tx['transaction_type'] == 'withdrawal':
            cleaned_tx['category'] = 'WITHDRAWAL'
        elif cleaned_tx['transaction_type'] in ['bank_transfer', 'bank_deposit']:
            cleaned_tx['category'] = 'BANK_TRANSACTION'
        elif cleaned_tx['transaction_type'] == 'internet_bundle':
            cleaned_tx['category'] = 'BUNDLE'
        elif cleaned_tx['transaction_type'] == 'third_party':
            cleaned_tx['category'] = 'THIRD_PARTY'
        else:
            cleaned_tx['category'] = 'OTHER'
        
        # 2. Ensure amount is positive
        cleaned_tx['amount'] = abs(cleaned_tx['amount'])
        
        # 3. Normalize names (capitalize first letter of each word)
        if cleaned_tx['sender']:
            cleaned_tx['sender'] = ' '.join(word.capitalize() for word in cleaned_tx['sender'].split())
        if cleaned_tx['recipient']:
            cleaned_tx['recipient'] = ' '.join(word.capitalize() for word in cleaned_tx['recipient'].split())
        
        cleaned_transactions.append(cleaned_tx)
    
    logger.info(f"Cleaned and normalized {len(cleaned_transactions)} transactions")
    return cleaned_transactions

def save_to_database(transactions: List[Dict[str, Any]], db: Session) -> int:
    """Save transactions to database"""
    count = 0
    
    for tx in transactions:
        # Check if transaction already exists
        existing = db.query(models.Transaction).filter(
            models.Transaction.transaction_id == tx['transaction_id']
        ).first()
        
        if not existing:
            # Create new transaction
            db_transaction = models.Transaction(
                transaction_id=tx['transaction_id'],
                transaction_type=tx['transaction_type'],
                category=tx['category'],
                amount=tx['amount'],
                fee=tx['fee'],
                sender=tx['sender'],
                recipient=tx['recipient'],
                agent=tx.get('agent'),
                details=tx.get('details'),
                timestamp=tx['timestamp'],
                raw_message=tx['raw_message']
            )
            
            db.add(db_transaction)
            count += 1
    
    db.commit()
    logger.info(f"Saved {count} new transactions to database")
    return count

def process_sms_data(xml_file_path: str, db: Session) -> Dict[str, Any]:
    """Process SMS data from XML file and save to database"""
    try:
        logger.info(f"Starting to process SMS data from {xml_file_path}")
        
        # Load and parse XML file
        tree = ET.parse(xml_file_path)
        root = tree.getroot()
        
        # Extract SMS data
        transactions = extract_sms_data(root)
        
        # Clean and normalize data
        cleaned_transactions = clean_and_normalize_data(transactions)
        
        # Save to database
        saved_count = save_to_database(cleaned_transactions, db)
        
        # Generate summary statistics
        type_counts = {}
        type_amounts = {}
        for tx in cleaned_transactions:
            tx_type = tx['transaction_type']
            if tx_type in type_counts:
                type_counts[tx_type] += 1
                type_amounts[tx_type] += tx['amount']
            else:
                type_counts[tx_type] = 1
                type_amounts[tx_type] = tx['amount']
        
        summary = {
            "total_transactions": len(cleaned_transactions),
            "saved_transactions": saved_count,
            "total_amount": sum(tx['amount'] for tx in cleaned_transactions),
            "transaction_types": [
                {"type": tx_type, "count": count, "amount": type_amounts[tx_type]}
                for tx_type, count in type_counts.items()
            ]
        }
        
        logger.info("SMS data processing completed successfully")
        
        return {
            "success": True,
            "file_name": os.path.basename(xml_file_path),
            "summary": summary
        }
        
    except Exception as e:
        logger.error(f"Error processing SMS data: {str(e)}")
        raise
