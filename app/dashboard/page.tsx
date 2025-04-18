"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, PieChart, LineChart, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-range-picker"
import TransactionVolumeChart from "@/components/transaction-volume-chart"
import CategoryDistributionChart from "@/components/category-distribution-chart"
import TransactionTrendsChart from "@/components/transaction-trends-chart"
import TransactionTable from "@/components/transaction-table"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 3, 1),
    to: new Date(2023, 3, 30),
  })

  const [categoryFilter, setCategoryFilter] = useState("all")

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
        <h1 className="text-3xl font-bold tracking-tight mb-2">MTN MoMo Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Interactive visualizations and insights from MTN Mobile Money transaction data
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CardDescription>All processed transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,587</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transaction Value</CardTitle>
            <CardDescription>Sum of all transaction amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF 35,464,000</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <CardDescription>Average transaction amount</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF 22,346</div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transaction Categories</CardTitle>
            <CardDescription>Distinct transaction types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
        <div className="flex-1">
          <div className="text-sm font-medium mb-2">Date Range</div>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        <div className="w-full md:w-[200px]">
          <div className="text-sm font-medium mb-2">Category</div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="INCOMING_MONEY">Incoming Money</SelectItem>
              <SelectItem value="PAYMENT_TO_CODE">Payments to Code Holders</SelectItem>
              <SelectItem value="TRANSFER_TO_MOBILE">Transfers to Mobile</SelectItem>
              <SelectItem value="BANK_DEPOSIT">Bank Deposits</SelectItem>
              <SelectItem value="AIRTIME_PAYMENT">Airtime Payments</SelectItem>
              <SelectItem value="CASH_POWER">Cash Power</SelectItem>
              <SelectItem value="AGENT_WITHDRAWAL">Agent Withdrawals</SelectItem>
              <SelectItem value="BUNDLE_PURCHASE">Bundle Purchases</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>

        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Transaction Volume by Category
                </CardTitle>
                <CardDescription>Number and value of transactions by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <TransactionVolumeChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-500" />
                  Category Distribution
                </CardTitle>
                <CardDescription>Percentage breakdown of transaction categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <CategoryDistributionChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-purple-500" />
                Transaction Trends
              </CardTitle>
              <CardDescription>Daily transaction volume and amounts over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <TransactionTrendsChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Detailed view of individual transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
