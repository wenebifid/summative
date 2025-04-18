"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react"

// Sample transaction data
const transactions = [
  {
    id: 1,
    date: "2023-04-15 08:23:45",
    category: "INCOMING_MONEY",
    amount: 25000,
    transactionId: "MT123456789",
    sender: "+250789123456",
  },
  {
    id: 2,
    date: "2023-04-15 09:45:12",
    category: "PAYMENT_TO_CODE",
    amount: 5000,
    transactionId: "MT123456790",
    sender: "+250789123456",
  },
  {
    id: 3,
    date: "2023-04-15 10:12:33",
    category: "TRANSFER_TO_MOBILE",
    amount: 10000,
    transactionId: "MT123456791",
    sender: "+250789123456",
  },
  {
    id: 4,
    date: "2023-04-15 14:05:22",
    category: "AIRTIME_PAYMENT",
    amount: 1000,
    transactionId: "MT123456792",
    sender: "+250789123456",
  },
  {
    id: 5,
    date: "2023-04-15 16:30:45",
    category: "CASH_POWER",
    amount: 15000,
    transactionId: "MT123456793",
    sender: "+250789123456",
  },
  {
    id: 6,
    date: "2023-04-16 09:15:33",
    category: "BANK_DEPOSIT",
    amount: 50000,
    transactionId: "MT123456794",
    sender: "+250789123456",
  },
  {
    id: 7,
    date: "2023-04-16 11:22:18",
    category: "AGENT_WITHDRAWAL",
    amount: 20000,
    transactionId: "MT123456795",
    sender: "+250789123456",
  },
  {
    id: 8,
    date: "2023-04-16 15:45:02",
    category: "BUNDLE_PURCHASE",
    amount: 2000,
    transactionId: "MT123456796",
    sender: "+250789123456",
  },
  {
    id: 9,
    date: "2023-04-17 08:30:15",
    category: "INCOMING_MONEY",
    amount: 35000,
    transactionId: "MT123456797",
    sender: "+250789123457",
  },
  {
    id: 10,
    date: "2023-04-17 13:45:22",
    category: "TRANSFER_TO_MOBILE",
    amount: 15000,
    transactionId: "MT123456798",
    sender: "+250789123456",
  },
]

// Format category for display
const formatCategory = (category: string) => {
  return category
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

export default function TransactionTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount (RWF)</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Sender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{formatCategory(transaction.category)}</TableCell>
                  <TableCell>{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs">{transaction.transactionId}</TableCell>
                  <TableCell>{transaction.sender}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of{" "}
          {filteredTransactions.length} transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
