import Link from "next/link"
import { ArrowLeft, Table, Key, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DatabasePage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-2">Database Management</h1>
        <p className="text-muted-foreground">Explore the relational database structure and transaction data</p>
      </header>

      <Tabs defaultValue="schema" className="mb-8">
        <TabsList>
          <TabsTrigger value="schema">Database Schema</TabsTrigger>
          <TabsTrigger value="data">Sample Data</TabsTrigger>
          <TabsTrigger value="query">Query Explorer</TabsTrigger>
        </TabsList>

        <TabsContent value="schema">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Table className="h-5 w-5 mr-2 text-blue-500" />
                  Transactions Table
                </CardTitle>
                <CardDescription>Main table storing all transaction data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Column</th>
                        <th className="text-left py-2 px-3 font-medium">Type</th>
                        <th className="text-left py-2 px-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">id</td>
                        <td className="py-2 px-3">INTEGER</td>
                        <td className="py-2 px-3">Primary key</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">transaction_id</td>
                        <td className="py-2 px-3">TEXT</td>
                        <td className="py-2 px-3">Unique ID from SMS</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">transaction_date</td>
                        <td className="py-2 px-3">DATETIME</td>
                        <td className="py-2 px-3">Date and time of transaction</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">category</td>
                        <td className="py-2 px-3">TEXT</td>
                        <td className="py-2 px-3">Transaction category</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">amount</td>
                        <td className="py-2 px-3">INTEGER</td>
                        <td className="py-2 px-3">Transaction amount in RWF</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">sender</td>
                        <td className="py-2 px-3">TEXT</td>
                        <td className="py-2 px-3">Sender information</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">raw_message</td>
                        <td className="py-2 px-3">TEXT</td>
                        <td className="py-2 px-3">Original SMS content</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">created_at</td>
                        <td className="py-2 px-3">DATETIME</td>
                        <td className="py-2 px-3">Record creation timestamp</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Table className="h-5 w-5 mr-2 text-green-500" />
                  Categories Table
                </CardTitle>
                <CardDescription>Reference table for transaction categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Column</th>
                        <th className="text-left py-2 px-3 font-medium">Type</th>
                        <th className="text-left py-2 px-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">id</td>
                        <td className="py-2 px-3">INTEGER</td>
                        <td className="py-2 px-3">Primary key</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 font-mono">name</td>
                        <td className="py-2 px-3">TEXT</td>
                        <td className="py-2 px-3">Category name (unique)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono">description</td>
                        <td className="py-2 px-3">TEXT</td>
                        <td className="py-2 px-3">Category description</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2 text-yellow-500" />
                  Database Views and Indexes
                </CardTitle>
                <CardDescription>Optimized views and indexes for reporting and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">monthly_summary View</h3>
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                      {`CREATE VIEW monthly_summary AS
SELECT 
    strftime('%Y-%m', transaction_date) as month,
    category,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM transactions
GROUP BY month, category
ORDER BY month DESC, total_amount DESC;`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">category_distribution View</h3>
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                      {`CREATE VIEW category_distribution AS
SELECT
    category,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions), 2) as percentage
FROM transactions
GROUP BY category
ORDER BY transaction_count DESC;`}
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Performance Indexes</h3>
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                      {`-- Indexes for faster querying
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_amount ON transactions(amount);`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Sample Transaction Data</CardTitle>
              <CardDescription>Preview of records from the transactions table</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount (RWF)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Transaction ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">1</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-15 08:23:45</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">INCOMING_MONEY</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">25,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456789</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-15 09:45:12</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">PAYMENT_TO_CODE</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">5,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456790</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">3</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-15 10:12:33</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">TRANSFER_TO_MOBILE</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">10,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456791</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">4</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-15 14:05:22</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">AIRTIME_PAYMENT</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">1,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456792</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">5</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-15 16:30:45</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">CASH_POWER</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">15,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456793</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">6</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-16 09:15:33</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">BANK_DEPOSIT</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">50,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456794</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">7</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-16 11:22:18</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">AGENT_WITHDRAWAL</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">20,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456795</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">8</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2023-04-16 15:45:02</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">BUNDLE_PURCHASE</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">2,000</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">MT123456796</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                SQL Query Explorer
              </CardTitle>
              <CardDescription>Run SQL queries against the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="query" className="text-sm font-medium">
                    Enter SQL Query
                  </label>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-auto min-h-[120px]">
                      {`SELECT 
  category, 
  COUNT(*) as count, 
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount
FROM transactions
GROUP BY category
ORDER BY total_amount DESC;`}
                    </pre>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Run Query</Button>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Query Results</h3>
                  <div className="rounded-md border overflow-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Count
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Total Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Avg Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">INCOMING_MONEY</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">412</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">12,560,000</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">30,485</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">TRANSFER_TO_MOBILE</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">356</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">8,750,000</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">24,579</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">BANK_DEPOSIT</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">124</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">7,450,000</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">60,081</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">PAYMENT_TO_CODE</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">287</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">4,320,000</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">15,052</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">CASH_POWER</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">98</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">1,960,000</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">20,000</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">AIRTIME_PAYMENT</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">100</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">250,000</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">2,500</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">BUNDLE_PURCHASE</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">87</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">174,000</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">2,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Sample Queries</h3>
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded-md text-xs">
                      <p className="font-medium mb-1">Monthly Transaction Volume</p>
                      <pre className="text-xs overflow-auto">
                        {`SELECT 
  strftime('%Y-%m', transaction_date) as month,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount
FROM transactions
GROUP BY month
ORDER BY month;`}
                      </pre>
                    </div>

                    <div className="bg-muted p-3 rounded-md text-xs">
                      <p className="font-medium mb-1">Top 10 Highest Value Transactions</p>
                      <pre className="text-xs overflow-auto">
                        {`SELECT 
  transaction_id,
  transaction_date,
  category,
  amount,
  raw_message
FROM transactions
ORDER BY amount DESC
LIMIT 10;`}
                      </pre>
                    </div>

                    <div className="bg-muted p-3 rounded-md text-xs">
                      <p className="font-medium mb-1">Transaction Count by Day of Week</p>
                      <pre className="text-xs overflow-auto">
                        {`SELECT 
  CASE cast(strftime('%w', transaction_date) as integer)
    WHEN 0 THEN 'Sunday'
    WHEN 1 THEN 'Monday'
    WHEN 2 THEN 'Tuesday'
    WHEN 3 THEN 'Wednesday'
    WHEN 4 THEN 'Thursday'
    WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday'
  END as day_of_week,
  COUNT(*) as transaction_count
FROM transactions
GROUP BY day_of_week
ORDER BY cast(strftime('%w', transaction_date) as integer);`}
                      </pre>
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
