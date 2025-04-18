import Link from "next/link"
import { ArrowRight, BarChart3, Database, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">MTN MoMo SMS Analytics Dashboard</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Process, analyze, and visualize MTN Mobile Money transaction data from SMS messages
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 mb-2 text-yellow-500" />
            <CardTitle>Data Processing</CardTitle>
            <CardDescription>Parse XML SMS data, clean and categorize transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our system processes raw XML SMS data, extracts transaction details, and categorizes them into different
              transaction types like payments, transfers, and deposits.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/processing" className="w-full">
              <Button variant="outline" className="w-full">
                View Processing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Database className="h-8 w-8 mb-2 text-blue-500" />
            <CardTitle>Database Management</CardTitle>
            <CardDescription>Structured storage of transaction data</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              All processed transactions are stored in a relational database with a well-designed schema that captures
              transaction types, amounts, dates, and other relevant details.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/database" className="w-full">
              <Button variant="outline" className="w-full">
                View Database <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="h-8 w-8 mb-2 text-green-500" />
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>Interactive visualizations and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Explore transaction data through interactive charts, filters, and detailed views to gain insights into
              transaction patterns and user behavior.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <div className="space-y-4">
          <p>
            This fullstack application demonstrates end-to-end processing of MTN MoMo SMS data, from raw XML to
            interactive visualizations.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Backend:</strong> Python scripts for XML parsing, data cleaning, and database operations
            </li>
            <li>
              <strong>Database:</strong> Relational database with optimized schema for transaction data
            </li>
            <li>
              <strong>API:</strong> RESTful endpoints to serve processed data to the frontend
            </li>
            <li>
              <strong>Frontend:</strong> Interactive dashboard with search, filters, and data visualizations
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link href="/dashboard">
          <Button size="lg">
            Explore the Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
