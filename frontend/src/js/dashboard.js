import { Chart } from "@/components/ui/chart"
// Dashboard Module for MoMo SMS Analytics

// Import API module (assuming it's in a separate file)
import * as API from "./api" // Adjust the path as needed

class DashboardManager {
  constructor() {
    // DOM Elements
    this.totalTransactionsElement = document.getElementById("total-transactions")
    this.totalVolumeElement = document.getElementById("total-volume")
    this.avgAmountElement = document.getElementById("avg-amount")
    this.totalFeesElement = document.getElementById("total-fees")

    this.dateFromInput = document.getElementById("date-from")
    this.dateToInput = document.getElementById("date-to")
    this.applyDateFilterBtn = document.getElementById("apply-date-filter")
    this.exportBtn = document.getElementById("export-btn")

    this.tabButtons = document.querySelectorAll(".tab-btn")
    this.tabContents = document.querySelectorAll(".tab-content")

    // Charts
    this.transactionChart = null
    this.distributionChart = null

    // Data
    this.summaryData = null
    this.transactions = []

    this.init()
  }

  init() {
    // Set default date range (current month)
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    this.dateFromInput.valueAsDate = firstDayOfMonth
    this.dateToInput.valueAsDate = today

    // Add event listeners
    this.applyDateFilterBtn.addEventListener("click", () => this.loadDashboardData())
    this.exportBtn.addEventListener("click", () => this.exportData())

    // Tab switching
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabId = button.dataset.tab
        this.switchTab(tabId)
      })
    })

    // Load initial data
    this.loadDashboardData()
    this.loadRecentTransactions()
  }

  async loadDashboardData() {
    try {
      const startDate = this.dateFromInput.value
      const endDate = this.dateToInput.value

      this.summaryData = await API.transactions.getSummary(startDate, endDate)

      this.updateSummaryCards()
      this.renderCharts()
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      alert("Failed to load dashboard data. Please try again later.")
    }
  }

  async loadRecentTransactions() {
    try {
      const transactions = await API.transactions.getTransactions({
        limit: 10,
        skip: 0,
      })

      this.transactions = transactions
      this.renderRecentTransactions()
    } catch (error) {
      console.error("Error loading recent transactions:", error)
    }
  }

  updateSummaryCards() {
    if (!this.summaryData) return

    this.totalTransactionsElement.textContent = this.summaryData.total_transactions.toLocaleString()
    this.totalVolumeElement.textContent = `${this.summaryData.total_amount.toLocaleString()} RWF`
    this.avgAmountElement.textContent = `${this.summaryData.avg_amount.toLocaleString()} RWF`

    // Calculate total fees (not provided directly by the API)
    const totalFees = this.summaryData.type_distribution.reduce((sum, item) => {
      // Assuming fee data is available in the future
      return sum + (item.fee || 0)
    }, 0)

    this.totalFeesElement.textContent = `${totalFees.toLocaleString()} RWF`
  }

  renderCharts() {
    this.renderTransactionChart()
    this.renderDistributionChart()
  }

  renderTransactionChart() {
    const ctx = document.getElementById("transaction-chart").getContext("2d")

    // Destroy existing chart if it exists
    if (this.transactionChart) {
      this.transactionChart.destroy()
    }

    if (!this.summaryData || !this.summaryData.daily_volume || this.summaryData.daily_volume.length === 0) {
      // No data available
      return
    }

    const dailyData = this.summaryData.daily_volume

    // Sort by date
    dailyData.sort((a, b) => new Date(a.date) - new Date(b.date))

    const labels = dailyData.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    })

    const amounts = dailyData.map((item) => item.amount)
    const counts = dailyData.map((item) => item.count)

    this.transactionChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Amount (RWF)",
            data: amounts,
            borderColor: "#ffcc00",
            backgroundColor: "rgba(255, 204, 0, 0.1)",
            tension: 0.3,
            fill: true,
            yAxisID: "y",
          },
          {
            label: "Count",
            data: counts,
            borderColor: "#0066cc",
            backgroundColor: "rgba(0, 102, 204, 0.1)",
            tension: 0.3,
            fill: true,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            beginAtZero: true,
            title: {
              display: true,
              text: "Amount (RWF)",
            },
            ticks: {
              callback: (value) => value.toLocaleString() + " RWF",
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            beginAtZero: true,
            title: {
              display: true,
              text: "Count",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    })
  }

  renderDistributionChart() {
    const ctx = document.getElementById("distribution-chart").getContext("2d")

    // Destroy existing chart if it exists
    if (this.distributionChart) {
      this.distributionChart.destroy()
    }

    if (!this.summaryData || !this.summaryData.type_distribution || this.summaryData.type_distribution.length === 0) {
      // No data available
      return
    }

    const typeData = this.summaryData.type_distribution

    const labels = typeData.map((item) => {
      // Convert transaction_type to readable format
      const type = item.type.replace(/_/g, " ")
      return type.charAt(0).toUpperCase() + type.slice(1)
    })

    const counts = typeData.map((item) => item.count)

    // Color palette
    const backgroundColors = [
      "rgba(255, 204, 0, 0.8)",
      "rgba(0, 102, 204, 0.8)",
      "rgba(220, 53, 69, 0.8)",
      "rgba(40, 167, 69, 0.8)",
      "rgba(255, 193, 7, 0.8)",
      "rgba(23, 162, 184, 0.8)",
      "rgba(108, 117, 125, 0.8)",
      "rgba(111, 66, 193, 0.8)",
      "rgba(253, 126, 20, 0.8)",
    ]

    this.distributionChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: backgroundColors.slice(0, typeData.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 15,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || ""
                const value = context.raw
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                const amount = typeData[context.dataIndex].amount.toLocaleString() + " RWF"
                return `${label}: ${percentage}% (${value} txns, ${amount})`
              },
            },
          },
        },
        cutout: "60%",
      },
    })
  }

  renderRecentTransactions() {
    const tableBody = document.querySelector("#recent-transactions-table tbody")
    tableBody.innerHTML = ""

    if (this.transactions.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="6" class="text-center">No transactions found</td>`
      tableBody.appendChild(row)
      return
    }

    this.transactions.forEach((tx) => {
      const row = document.createElement("tr")

      // Format date
      const date = new Date(tx.timestamp)
      const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()

      // Format transaction type
      const txType = tx.transaction_type.replace(/_/g, " ")
      const formattedType = txType.charAt(0).toUpperCase() + txType.slice(1)

      // Determine sender/recipient to display
      const senderRecipient = tx.sender || tx.recipient || "N/A"

      row.innerHTML = `
        <td>${tx.transaction_id}</td>
        <td>${formattedType}</td>
        <td>${tx.amount.toLocaleString()} RWF</td>
        <td>${senderRecipient}</td>
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

  switchTab(tabId) {
    // Update active tab button
    this.tabButtons.forEach((button) => {
      if (button.dataset.tab === tabId) {
        button.classList.add("active")
      } else {
        button.classList.remove("active")
      }
    })

    // Show active tab content
    this.tabContents.forEach((content) => {
      if (content.id === `${tabId}-tab`) {
        content.classList.add("active")
      } else {
        content.classList.remove("active")
      }
    })
  }

  exportData() {
    // In a real application, this would call an API endpoint to export data
    alert("Export functionality will be implemented in a future update.")
  }
}

// Initialize the dashboard manager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const dashboardManager = new DashboardManager()
})
