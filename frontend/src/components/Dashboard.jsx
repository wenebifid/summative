"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import TransactionChart from "./TransactionChart"
import TransactionDistribution from "./TransactionDistribution"
import TransactionSummary from "./TransactionSummary"
import RecentTransactions from "./RecentTransactions"
import DateRangePicker from "./DateRangePicker"
import { Button } from "./ui/button"
import { Download } from "lucide-react"
import { fetchSummaryData } from "../services/api"

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date(),
  })

  const [summaryData, setSummaryData] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    avgAmount: 0,
    totalFees: 0,
    typeDistribution: [],
    dailyVolume: [],
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSummaryData = async () => {
      try {
        setLoading(true)
        const startDate = dateRange.from ? dateRange.from.toISOString().split("T")[0] : undefined
        const endDate = dateRange.to ? dateRange.to.toISOString().split("T")[0] : undefined

        const data = await fetchSummaryData(startDate, endDate)
        setSummaryData({
          totalTransactions: data.total_transactions,
          totalAmount: data.total_amount,
          avgAmount: data.avg_amount,
          totalFees: data.total_fees || 0,
          typeDistribution: data.type_distribution,
          dailyVolume: data.daily_volume,
        })
        setError(null)
      } catch (err) {
        console.error("Error fetching summary data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadSummaryData()
  }, [dateRange])

  const handleExport = () => {
    // Implementation for exporting data
    alert("Export functionality will be implemented here")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TransactionSummary
          title="Total Transactions"
          value={summaryData.totalTransactions}
          description="All transactions"
          trend="+12.5%"
          loading={loading}
        />
        <TransactionSummary
          title="Total Volume"
          value={summaryData.totalAmount}
          isCurrency={true}
          description="Transaction amount"
          trend="+8.2%"
          loading={loading}
        />
        <TransactionSummary
          title="Average Amount"
          value={summaryData.avgAmount}
          isCurrency={true}
          description="Per transaction"
          trend="-3.1%"
          trendDirection="down"
          loading={loading}
        />
        <TransactionSummary
          title="Total Fees"
          value={summaryData.totalFees}
          isCurrency={true}
          description="Service charges"
          trend="+5.4%"
          loading={loading}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <p className="text-sm text-muted-foreground">Daily transaction volume over time</p>
              </CardHeader>
              <CardContent className="pl-2">
                <TransactionChart data={summaryData.dailyVolume} loading={loading} />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution by transaction category</p>
              </CardHeader>
              <CardContent>
                <TransactionDistribution data={summaryData.typeDistribution} loading={loading} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">Latest processed transactions</p>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed analysis of transaction patterns</p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Advanced analytics content will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <p className="text-sm text-muted-foreground">Download and view saved reports</p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Reports will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
