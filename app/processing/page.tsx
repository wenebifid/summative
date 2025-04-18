import { ArrowLeft, FileText, CheckCircle, AlertCircle, Database } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProcessingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Data Processing Pipeline</h1>
        <p className="text-muted-foreground">
          Extract, transform, and load MTN MoMo SMS data into structured database records
        </p>
      </header>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="code">Code Samples</TabsTrigger>
          <TabsTrigger value="logs">Processing Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                  XML Parsing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Extract raw SMS data from XML file</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  Data Cleaning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Normalize and categorize transaction data</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-500" />
                  Database Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Insert processed data into database</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completed</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Processing Statistics</CardTitle>
              <CardDescription>Summary of data processing results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total SMS Messages</span>
                    <span className="text-sm font-medium">1,600</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Successfully Processed</span>
                    <span className="text-sm font-medium">1,587 (99.2%)</span>
                  </div>
                  <Progress value={99.2} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Failed to Process</span>
                    <span className="text-sm font-medium">13 (0.8%)</span>
                  </div>
                  <Progress value={0.8} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Categories</CardTitle>
              <CardDescription>Distribution of processed transactions by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Incoming Money</span>
                    <span className="text-sm font-medium">412 (26%)</span>
                  </div>
                  <Progress value={26} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Payments to Code Holders</span>
                    <span className="text-sm font-medium">287 (18%)</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Transfers to Mobile Numbers</span>
                    <span className="text-sm font-medium">356 (22%)</span>
                  </div>
                  <Progress value={22} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Bank Deposits</span>
                    <span className="text-sm font-medium">124 (8%)</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Airtime & Bill Payments</span>
                    <span className="text-sm font-medium">198 (12%)</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Other Transactions</span>
                    <span className="text-sm font-medium">210 (14%)</span>
                  </div>
                  <Progress value={14} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>XML Parser</CardTitle>
                <CardDescription>Python script to parse SMS XML data</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                  {`import xml.etree.ElementTree as ET
import re
import json
from datetime import datetime

def parse_sms_xml(xml_file_path):
    """
    Parse the SMS XML file and extract message data
    """
    tree = ET.parse(xml_file_path)
    root = tree.getroot()
    
    sms_data = []
    
    for sms in root.findall('.//sms'):
        sms_item = {
            'protocol': sms.get('protocol'),
            'address': sms.get('address'),
            'date': int(sms.get('date', 0)),
            'type': int(sms.get('type', 0)),
            'subject': sms.get('subject', ''),
            'body': sms.get('body', ''),
            'toa': sms.get('toa', ''),
            'sc_toa': sms.get('sc_toa', ''),
            'service_center': sms.get('service_center', ''),
            'read': int(sms.get('read', 0)),
            'status': int(sms.get('status', 0)),
            'readable_date': convert_timestamp(int(sms.get('date', 0)))
        }
        
        # Only include MTN MoMo messages
        if 'MTN MoMo' in sms_item['body']:
            sms_data.append(sms_item)
    
    print(f"Extracted {len(sms_data)} MTN MoMo SMS messages")
    return sms_data

def convert_timestamp(timestamp):
    """Convert millisecond timestamp to readable date"""
    if timestamp == 0:
        return None
    return datetime.fromtimestamp(timestamp/1000).strftime('%Y-%m-%d %H:%M:%S')

if __name__ == "__main__":
    sms_data = parse_sms_xml('data/raw/sms_data.xml')
    
    # Save extracted data to JSON for further processing
    with open('data/processed/raw_sms_data.json', 'w') as f:
        json.dump(sms_data, f, indent=2)
    
    print("XML parsing complete. Data saved to raw_sms_data.json")`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Cleaner</CardTitle>
                <CardDescription>Python script to clean and categorize SMS data</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                  {`import json
import re
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    filename='data/logs/processing_log.txt',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def categorize_transaction(sms_body):
    """
    Categorize the transaction based on SMS body content
    """
    categories = {
        'INCOMING_MONEY': [
            r'You have received (?:Rwf|RWF) ([\d,]+) from (\w+)',
            r'received money'
        ],
        'PAYMENT_TO_CODE': [
            r'paid (?:Rwf|RWF) ([\d,]+) to ([A-Z0-9]+)',
            r'payment to merchant'
        ],
        'TRANSFER_TO_MOBILE': [
            r'transferred (?:Rwf|RWF) ([\d,]+) to (\d+)',
            r'sent money to'
        ],
        'BANK_DEPOSIT': [
            r'deposited (?:Rwf|RWF) ([\d,]+) to your bank account',
            r'bank deposit'
        ],
        'AIRTIME_PAYMENT': [
            r'bought airtime worth (?:Rwf|RWF) ([\d,]+)',
            r'airtime purchase'
        ],
        'CASH_POWER': [
            r'paid (?:Rwf|RWF) ([\d,]+) for electricity',
            r'cash power'
        ],
        'THIRD_PARTY': [
            r'transaction initiated by (\w+)',
            r'third party'
        ],
        'AGENT_WITHDRAWAL': [
            r'withdrawn (?:Rwf|RWF) ([\d,]+) from agent',
            r'cash withdrawal'
        ],
        'BANK_TRANSFER': [
            r'transferred (?:Rwf|RWF) ([\d,]+) to bank account',
            r'bank transfer'
        ],
        'BUNDLE_PURCHASE': [
            r'purchased (\w+) bundle worth (?:Rwf|RWF) ([\d,]+)',
            r'data bundle'
        ]
    }
    
    for category, patterns in categories.items():
        for pattern in patterns:
            if re.search(pattern, sms_body, re.IGNORECASE):
                return category
    
    return 'OTHER'

def extract_amount(sms_body):
    """
    Extract transaction amount from SMS body
    """
    amount_pattern = r'(?:Rwf|RWF) ([\d,]+)'
    match = re.search(amount_pattern, sms_body)
    
    if match:
        # Remove commas and convert to integer
        return int(match.group(1).replace(',', ''))
    
    return None

def extract_transaction_id(sms_body):
    """
    Extract transaction ID from SMS body
    """
    id_pattern = r'ID: ([A-Z0-9]+)'
    match = re.search(id_pattern, sms_body)
    
    if match:
        return match.group(1)
    
    return None

def clean_sms_data(raw_data_path):
    """
    Clean and process raw SMS data
    """
    with open(raw_data_path, 'r') as f:
        raw_sms_data = json.load(f)
    
    processed_data = []
    skipped_data = []
    
    for sms in raw_sms_data:
        try:
            category = categorize_transaction(sms['body'])
            amount = extract_amount(sms['body'])
            transaction_id = extract_transaction_id(sms['body'])
            
            processed_item = {
                'transaction_date': sms['readable_date'],
                'category': category,
                'amount': amount,
                'transaction_id': transaction_id,
                'raw_message': sms['body'],
                'sender': sms['address']
            }
            
            processed_data.append(processed_item)
            
        except Exception as e:
            logging.error(f"Error processing SMS: {sms['body']}")
            logging.error(str(e))
            skipped_data.append(sms)
    
    logging.info(f"Processed {len(processed_data)} SMS messages")
    logging.info(f"Skipped {len(skipped_data)} SMS messages")
    
    return processed_data, skipped_data

if __name__ == "__main__":
    processed_data, skipped_data = clean_sms_data('data/processed/raw_sms_data.json')
    
    # Save processed data
    with open('data/processed/cleaned_transactions.json', 'w') as f:
        json.dump(processed_data, f, indent=2)
    
    # Save skipped data for review
    with open('data/processed/skipped_transactions.json', 'w') as f:
        json.dump(skipped_data, f, indent=2)
    
    print("Data cleaning complete.")`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Loader</CardTitle>
                <CardDescription>Python script to load data into SQLite database</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                  {`import json
import sqlite3
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    filename='data/logs/db_loading_log.txt',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def create_database():
    """
    Create SQLite database with required schema
    """
    conn = sqlite3.connect('data/database/mtn_momo.db')
    cursor = conn.cursor()
    
    # Create transactions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id TEXT,
        transaction_date DATETIME,
        category TEXT,
        amount INTEGER,
        sender TEXT,
        raw_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create categories table for reporting
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        description TEXT
    )
    ''')
    
    # Insert category definitions
    categories = [
        ('INCOMING_MONEY', 'Money received from other users'),
        ('PAYMENT_TO_CODE', 'Payments made to merchant codes'),
        ('TRANSFER_TO_MOBILE', 'Money sent to other mobile numbers'),
        ('BANK_DEPOSIT', 'Deposits to bank accounts'),
        ('AIRTIME_PAYMENT', 'Airtime purchases'),
        ('CASH_POWER', 'Electricity bill payments'),
        ('THIRD_PARTY', 'Transactions initiated by third parties'),
        ('AGENT_WITHDRAWAL', 'Cash withdrawals from agents'),
        ('BANK_TRANSFER', 'Transfers to bank accounts'),
        ('BUNDLE_PURCHASE', 'Internet and voice bundle purchases'),
        ('OTHER', 'Other uncategorized transactions')
    ]
    
    cursor.executemany(
        'INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)',
        categories
    )
    
    conn.commit()
    conn.close()
    
    logging.info("Database schema created successfully")

def load_data_to_db(data_file_path):
    """
    Load processed data into SQLite database
    """
    with open(data_file_path, 'r') as f:
        transactions = json.load(f)
    
    conn = sqlite3.connect('data/database/mtn_momo.db')
    cursor = conn.cursor()
    
    inserted_count = 0
    error_count = 0
    
    for transaction in transactions:
        try:
            cursor.execute('''
            INSERT INTO transactions 
            (transaction_id, transaction_date, category, amount, sender, raw_message)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                transaction.get('transaction_id'),
                transaction.get('transaction_date'),
                transaction.get('category'),
                transaction.get('amount'),
                transaction.get('sender'),
                transaction.get('raw_message')
            ))
            
            inserted_count += 1
            
        except Exception as e:
            logging.error(f"Error inserting transaction: {transaction}")
            logging.error(str(e))
            error_count += 1
    
    conn.commit()
    conn.close()
    
    logging.info(f"Inserted {inserted_count} transactions into database")
    logging.info(f"Failed to insert {error_count} transactions")
    
    return inserted_count, error_count

if __name__ == "__main__":
    create_database()
    inserted, errors = load_data_to_db('data/processed/cleaned_transactions.json')
    
    print(f"Database loading complete. Inserted {inserted} transactions with {errors} errors.")`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>SQL schema for the MTN MoMo database</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                  {`-- Main transactions table
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT,
    transaction_date DATETIME,
    category TEXT,
    amount INTEGER,
    sender TEXT,
    raw_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories reference table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    description TEXT
);

-- Monthly summary view for reporting
CREATE VIEW monthly_summary AS
SELECT 
    strftime('%Y-%m', transaction_date) as month,
    category,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transactions
GROUP BY month, category
ORDER BY month DESC, total_amount DESC;

-- Transaction type distribution view
CREATE VIEW category_distribution AS
SELECT
    category,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions), 2) as percentage
FROM transactions
GROUP BY category
ORDER BY transaction_count DESC;

-- Indexes for performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_amount ON transactions(amount);`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Processing Logs</CardTitle>
              <CardDescription>Recent log entries from data processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">2023-04-18 09:15:23 - INFO - XML parsing started</p>
                      <p className="text-xs text-muted-foreground">Starting to parse XML file: data/raw/sms_data.xml</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        2023-04-18 09:15:27 - INFO - Extracted 1600 MTN MoMo SMS messages
                      </p>
                      <p className="text-xs text-muted-foreground">Successfully extracted all messages from XML file</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">2023-04-18 09:15:30 - INFO - Data cleaning started</p>
                      <p className="text-xs text-muted-foreground">Beginning to clean and categorize SMS data</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        2023-04-18 09:15:35 - WARNING - Could not extract amount from SMS
                      </p>
                      <p className="text-xs text-muted-foreground">
                        SMS body: "MTN MoMo: Your account balance is now Rwf 25,000. Transaction fee: Rwf 0."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">2023-04-18 09:15:42 - INFO - Processed 1587 SMS messages</p>
                      <p className="text-xs text-muted-foreground">Successfully cleaned and categorized SMS data</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">2023-04-18 09:15:45 - WARNING - Skipped 13 SMS messages</p>
                      <p className="text-xs text-muted-foreground">
                        Messages could not be categorized or contained invalid data
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        2023-04-18 09:15:50 - INFO - Database schema created successfully
                      </p>
                      <p className="text-xs text-muted-foreground">Created tables: transactions, categories</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">
                        2023-04-18 09:15:55 - INFO - Inserted 1587 transactions into database
                      </p>
                      <p className="text-xs text-muted-foreground">Database loading completed successfully</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Link href="/dashboard">
          <Button size="lg">View Analytics Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
