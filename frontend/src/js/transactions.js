// Transactions Module for MoMo SMS Analytics

// Import API module (assuming it's in a separate file)
import * as API from "./api" // Adjust path as needed

class TransactionsManager {
  constructor() {
    // DOM Elements
    this.transactionsTable = document.getElementById("transactions-table")
    this.searchInput = document.getElementById("transaction-search")
    this.searchBtn = document.getElementById("search-btn")
    this.typeFilter = document.getElementById("transaction-type-filter")
    this.dateFilter = document.getElementById("transaction-date-filter")
    this.filterBtn = document.getElementById("filter-btn")
    this.prevPageBtn = document.getElementById("prev-page")
    this.nextPageBtn = document.getElementById("next-page")
    this.pageInfo = document.getElementById("page-info")

    // Pagination state
    this.currentPage = 1
    this.pageSize = 20
    this.totalPages = 1

    // Filter state
    this.filters = {
      search: "",
      transaction_type: "",
      start_date: "",
      end_date: "",
    }

    this.init()
  }

  init() {
    // Add event listeners
    this.searchBtn.addEventListener("click", () => {
      this.filters.search = this.searchInput.value
      this.currentPage = 1
      this.loadTransactions()
    })

    this.filterBtn.addEventListener("click", () => {
      this.filters.transaction_type = this.typeFilter.value
      this.filters.start_date = this.dateFilter.value
      this.currentPage = 1
      this.loadTransactions()
    })

    this.prevPageBtn.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadTransactions()
      }
    })

    this.nextPageBtn.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.loadTransactions()
      }
    })

    // Load initial transactions
    this.loadTransactions()
  }

  async loadTransactions() {
    try {
      const skip = (this.currentPage - 1) * this.pageSize

      const params = {
        skip,
        limit: this.pageSize,
        transaction_type: this.filters.transaction_type,
        start_date: this.filters.start_date,
        search: this.filters.search,
      }

      const transactions = await API.transactions.getTransactions(params)

      this.renderTransactions(transactions)
      this.updatePagination()
    } catch (error) {
      console.error("Error loading transactions:", error)
      alert("Failed to load transactions. Please try again later.")
    }
  }

  renderTransactions(transactions) {
    const tableBody = this.transactionsTable.querySelector("tbody")
    tableBody.innerHTML = ""

    if (transactions.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="9" class="text-center">No transactions found</td>`
      tableBody.appendChild(row)
      return
    }

    transactions.forEach((tx) => {
      const row = document.createElement("tr")

      // Format date
      const date = new Date(tx.timestamp)
      const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()

      // Format transaction type
      const txType = tx.transaction_type.replace(/_/g, " ")
      const formattedType = txType.charAt(0).toUpperCase() + txType.slice(1)

      row.innerHTML = `
        <td>${tx.transaction_id}</td>
        <td>${formattedType}</td>
        <td>${tx.category}</td>
        <td>${tx.amount.toLocaleString()} RWF</td>
        <td>${tx.fee.toLocaleString()} RWF</td>
        <td>${tx.sender || "-"}</td>
        <td>${tx.recipient || "-"}</td>
        <td>${formattedDate}</td>
        <td>
          <button class="btn btn-sm view-transaction" data-id="${tx.transaction_id}">View</button>
        </td>
      `

      tableBody.appendChild(row)
    })

    // Add event listeners to view buttons
    document.querySelectorAll(".view-transaction").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const txId = e.target.dataset.id
        this.showTransactionDetails(txId)
      })
    })
  }

  updatePagination() {
    // In a real application, you would get the total count from the API
    // For now, we'll just disable/enable buttons based on current page
    this.prevPageBtn.disabled = this.currentPage === 1

    // Assume there are more pages if we got a full page of results
    const hasMorePages = document.querySelectorAll("#transactions-table tbody tr").length >= this.pageSize
    this.nextPageBtn.disabled = !hasMorePages

    this.pageInfo.textContent = `Page ${this.currentPage}`
  }

  async showTransactionDetails(transactionId) {
    try {
      const transaction = await API.transactions.getTransaction(transactionId)

      const modal = document.getElementById("transaction-modal")
      const detailsContainer = document.getElementById("transaction-details")

      // Format date
      const date = new Date(transaction.timestamp)
      const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()

      // Format transaction type
      const txType = transaction.transaction_type.replace(/_/g, " ")
      const formattedType = txType.charAt(0).toUpperCase() + txType.slice(1)

      detailsContainer.innerHTML = `
        <div class="transaction-detail">
          <strong>Transaction ID:</strong> ${transaction.transaction_id}
        </div>
        <div class="transaction-detail">
          <strong>Type:</strong> ${formattedType}
        </div>
        <div class="transaction-detail">
          <strong>Category:</strong> ${transaction.category}
        </div>
        <div class="transaction-detail">
          <strong>Amount:</strong> ${transaction.amount.toLocaleString()} RWF
        </div>
        <div class="transaction-detail">
          <strong>Fee:</strong> ${transaction.fee.toLocaleString()} RWF
        </div>
        <div class="transaction-detail">
          <strong>Date:</strong> ${formattedDate}
        </div>
        ${transaction.sender ? `<div class="transaction-detail"><strong>Sender:</strong> ${transaction.sender}</div>` : ""}
        ${transaction.recipient ? `<div class="transaction-detail"><strong>Recipient:</strong> ${transaction.recipient}</div>` : ""}
        ${transaction.agent ? `<div class="transaction-detail"><strong>Agent:</strong> ${transaction.agent}</div>` : ""}
        ${transaction.details ? `<div class="transaction-detail"><strong>Details:</strong> ${transaction.details}</div>` : ""}
        <div class="transaction-detail">
          <strong>Raw Message:</strong>
          <pre>${transaction.raw_message}</pre>
        </div>
      `

      modal.classList.add("active")

      // Add event listener to close button
      const closeBtn = modal.querySelector(".modal-close")
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active")
      })

      // Close modal when clicking outside
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
        }
      })
    } catch (error) {
      console.error("Error fetching transaction details:", error)
      alert("Failed to load transaction details. Please try again later.")
    }
  }
}

// Initialize the transactions manager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const transactionsManager = new TransactionsManager()
})
