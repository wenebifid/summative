// Main Application Module for MoMo SMS Analytics

// Import the authManager module (assuming it's in a separate file)
import { authManager } from "./authManager" // Adjust the path as needed

class AppManager {
  constructor() {
    // DOM Elements
    this.dashboardLink = document.getElementById("dashboard-link")
    this.transactionsLink = document.getElementById("transactions-link")
    this.uploadLink = document.getElementById("upload-link")
    this.settingsLink = document.getElementById("settings-link")

    this.dashboardView = document.getElementById("dashboard-view")
    this.transactionsView = document.getElementById("transactions-view")
    this.uploadView = document.getElementById("upload-view")
    this.settingsView = document.getElementById("settings-view")

    // Current view
    this.currentView = "dashboard"

    this.init()
  }

  init() {
    // Add event listeners for navigation
    this.dashboardLink.addEventListener("click", (e) => {
      e.preventDefault()
      this.switchView("dashboard")
    })

    this.transactionsLink.addEventListener("click", (e) => {
      e.preventDefault()
      this.switchView("transactions")
    })

    this.uploadLink.addEventListener("click", (e) => {
      e.preventDefault()
      this.switchView("upload")
    })

    this.settingsLink.addEventListener("click", (e) => {
      e.preventDefault()
      this.switchView("settings")
    })

    // Check if user is authenticated
    this.checkAuth()

    // Load settings
    this.loadSettings()
  }

  switchView(viewName) {
    // Update navigation links
    document.querySelectorAll(".nav a").forEach((link) => {
      link.classList.remove("active")
    })

    document.getElementById(`${viewName}-link`).classList.add("active")

    // Hide all views
    this.dashboardView.style.display = "none"
    this.transactionsView.style.display = "none"
    this.uploadView.style.display = "none"
    this.settingsView.style.display = "none"

    // Show selected view
    document.getElementById(`${viewName}-view`).style.display = "block"

    // Update current view
    this.currentView = viewName
  }

  checkAuth() {
    // Check if user is authenticated
    if (!authManager.isUserAuthenticated()) {
      // For demo purposes, we'll allow access to all views
      // In a real application, you might redirect to a login page
      console.log("User is not authenticated. Some features may be limited.")
    }
  }

  loadSettings() {
    // Load application settings from localStorage
    const settings = JSON.parse(localStorage.getItem("appSettings") || "{}")

    // Apply settings
    if (settings.currency) {
      document.getElementById("currency-select").value = settings.currency
    }

    if (settings.dateFormat) {
      document.getElementById("date-format-select").value = settings.dateFormat
    }

    if (settings.theme) {
      document.getElementById("theme-select").value = settings.theme
      this.applyTheme(settings.theme)
    }

    // Add event listener for settings form
    document.getElementById("app-settings-form").addEventListener("submit", (e) => {
      e.preventDefault()

      const newSettings = {
        currency: document.getElementById("currency-select").value,
        dateFormat: document.getElementById("date-format-select").value,
        theme: document.getElementById("theme-select").value,
      }

      // Save settings
      localStorage.setItem("appSettings", JSON.stringify(newSettings))

      // Apply theme
      this.applyTheme(newSettings.theme)

      alert("Settings saved successfully!")
    })

    // Add event listener for user settings form
    document.getElementById("user-settings-form").addEventListener("submit", (e) => {
      e.preventDefault()

      const user = authManager.getUser() || {}

      const updatedUser = {
        ...user,
        full_name: document.getElementById("user-name-input").value,
        email: document.getElementById("user-email-input").value,
      }

      // Update user info
      authManager.setUser(updatedUser)
      authManager.updateAuthUI()

      alert("User settings saved successfully!")
    })

    // Populate user settings form
    const user = authManager.getUser()
    if (user) {
      document.getElementById("user-name-input").value = user.full_name || ""
      document.getElementById("user-email-input").value = user.email || ""
    }
  }

  applyTheme(theme) {
    // In a real application, you would apply different CSS variables based on the theme
    if (theme === "dark") {
      document.body.classList.add("dark-theme")
    } else {
      document.body.classList.remove("dark-theme")
    }
  }
}

// Initialize the app manager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const appManager = new AppManager()
})
