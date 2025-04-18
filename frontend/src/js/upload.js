// Upload Module for MoMo SMS Analytics

// Import API module (assuming it's in a separate file)
import * as API from "./api" // Adjust the path if necessary

class UploadManager {
  constructor() {
    // DOM Elements
    this.uploadForm = document.getElementById("upload-form")
    this.fileInput = document.getElementById("file-upload")
    this.uploadProgress = document.getElementById("upload-progress")
    this.progressFill = document.querySelector(".progress-fill")
    this.progressStatus = document.getElementById("progress-status")
    this.uploadResult = document.getElementById("upload-result")
    this.resultContent = document.getElementById("result-content")
    this.uploadHistoryTable = document.getElementById("upload-history-table")

    // Upload history
    this.uploadHistory = JSON.parse(localStorage.getItem("uploadHistory") || "[]")

    this.init()
  }

  init() {
    // Add event listeners
    this.uploadForm.addEventListener("submit", (e) => this.handleUpload(e))

    // Render upload history
    this.renderUploadHistory()
  }

  async handleUpload(e) {
    e.preventDefault()

    const file = this.fileInput.files[0]

    if (!file) {
      alert("Please select a file to upload")
      return
    }

    if (!file.name.endsWith(".xml")) {
      alert("Only XML files are allowed")
      return
    }

    try {
      // Show progress
      this.uploadProgress.style.display = "block"
      this.uploadResult.style.display = "none"
      this.progressFill.style.width = "0%"
      this.progressStatus.textContent = "Uploading..."

      // Simulate progress (in a real app, you'd use XMLHttpRequest or fetch with progress events)
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += 10
        this.progressFill.style.width = `${Math.min(progress, 90)}%`

        if (progress >= 90) {
          clearInterval(progressInterval)
        }
      }, 300)

      // Upload file
      const result = await API.upload.uploadFile(file)

      // Complete progress
      clearInterval(progressInterval)
      this.progressFill.style.width = "100%"
      this.progressStatus.textContent = "Processing complete!"

      // Show result
      this.showUploadResult(result, file.name)

      // Add to upload history
      this.addToUploadHistory(file.name, result)

      // Reset form
      this.uploadForm.reset()
    } catch (error) {
      console.error("Upload error:", error)

      // Show error
      this.progressStatus.textContent = `Error: ${error.message}`
      this.progressFill.style.width = "100%"
      this.progressFill.style.backgroundColor = "var(--danger-color)"
    }
  }

  showUploadResult(result, fileName) {
    this.uploadResult.style.display = "block"

    if (result.success) {
      const summary = result.summary

      this.resultContent.innerHTML = `
        <div class="result-summary">
          <p><strong>File:</strong> ${fileName}</p>
          <p><strong>Status:</strong> <span class="success">Success</span></p>
          <p><strong>Total Transactions:</strong> ${summary.total_transactions}</p>
          <p><strong>Saved Transactions:</strong> ${summary.saved_transactions}</p>
          <p><strong>Total Amount:</strong> ${summary.total_amount.toLocaleString()} RWF</p>
        </div>
        
        <h5>Transaction Types:</h5>
        <ul class="result-types">
          ${summary.transaction_types
            .map(
              (type) => `
            <li>
              <strong>${type.type.replace(/_/g, " ")}:</strong> 
              ${type.count} transactions, 
              ${type.amount.toLocaleString()} RWF
            </li>
          `,
            )
            .join("")}
        </ul>
      `
    } else {
      this.resultContent.innerHTML = `
        <div class="result-summary">
          <p><strong>File:</strong> ${fileName}</p>
          <p><strong>Status:</strong> <span class="error">Failed</span></p>
          <p><strong>Error:</strong> ${result.error || "Unknown error"}</p>
        </div>
      `
    }
  }

  addToUploadHistory(fileName, result) {
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      fileName,
      transactions: result.success ? result.summary.total_transactions : 0,
      status: result.success ? "success" : "failed",
      result,
    }

    this.uploadHistory.unshift(historyItem)

    // Keep only the last 10 items
    if (this.uploadHistory.length > 10) {
      this.uploadHistory = this.uploadHistory.slice(0, 10)
    }

    // Save to localStorage
    localStorage.setItem("uploadHistory", JSON.stringify(this.uploadHistory))

    // Update the UI
    this.renderUploadHistory()
  }

  renderUploadHistory() {
    const tableBody = this.uploadHistoryTable.querySelector("tbody")
    tableBody.innerHTML = ""

    if (this.uploadHistory.length === 0) {
      const row = document.createElement("tr")
      row.innerHTML = `<td colspan="5" class="text-center">No upload history</td>`
      tableBody.appendChild(row)
      return
    }

    this.uploadHistory.forEach((item) => {
      const row = document.createElement("tr")

      // Format date
      const date = new Date(item.date)
      const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()

      row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${item.fileName}</td>
        <td>${item.transactions}</td>
        <td><span class="${item.status}">${item.status === "success" ? "Success" : "Failed"}</span></td>
        <td>
          <button class="btn btn-sm view-upload" data-id="${item.id}">View</button>
          <button class="btn btn-sm remove-upload" data-id="${item.id}">Remove</button>
        </td>
      `

      tableBody.appendChild(row)
    })

    // Add event listeners
    document.querySelectorAll(".view-upload").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number.parseInt(e.target.dataset.id)
        const item = this.uploadHistory.find((h) => h.id === id)

        if (item) {
          this.showUploadResult(item.result, item.fileName)
          this.uploadResult.style.display = "block"
          this.uploadProgress.style.display = "none"

          // Scroll to result
          this.uploadResult.scrollIntoView({ behavior: "smooth" })
        }
      })
    })

    document.querySelectorAll(".remove-upload").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number.parseInt(e.target.dataset.id)
        this.uploadHistory = this.uploadHistory.filter((h) => h.id !== id)

        // Save to localStorage
        localStorage.setItem("uploadHistory", JSON.stringify(this.uploadHistory))

        // Update the UI
        this.renderUploadHistory()
      })
    })
  }
}

// Initialize the upload manager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const uploadManager = new UploadManager()
})
