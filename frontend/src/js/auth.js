// Authentication Module for MoMo SMS Analytics

// Import API module (assuming it's in a separate file)
import * as API from "./api" // Adjust the path as needed

class AuthManager {
  constructor() {
    this.token = localStorage.getItem("token")
    this.user = JSON.parse(localStorage.getItem("user") || "null")
    this.isAuthenticated = !!this.token

    // DOM Elements
    this.loginBtn = document.getElementById("login-btn")
    this.logoutBtn = document.getElementById("logout-btn")
    this.userNameElement = document.getElementById("user-name")
    this.loginModal = document.getElementById("login-modal")
    this.registerModal = document.getElementById("register-modal")
    this.loginForm = document.getElementById("login-form")
    this.registerForm = document.getElementById("register-form")
    this.registerLink = document.getElementById("register-link")
    this.loginLink = document.getElementById("login-link")

    this.init()
  }

  init() {
    // Update UI based on authentication state
    this.updateAuthUI()

    // Add event listeners
    this.loginBtn.addEventListener("click", () => this.showLoginModal())
    this.logoutBtn.addEventListener("click", () => this.logout())

    this.loginForm.addEventListener("submit", (e) => this.handleLogin(e))
    this.registerForm.addEventListener("submit", (e) => this.handleRegister(e))

    this.registerLink.addEventListener("click", (e) => {
      e.preventDefault()
      this.hideLoginModal()
      this.showRegisterModal()
    })

    this.loginLink.addEventListener("click", (e) => {
      e.preventDefault()
      this.hideRegisterModal()
      this.showLoginModal()
    })

    // Close modals when clicking on close button or outside
    document.querySelectorAll(".modal-close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        this.hideLoginModal()
        this.hideRegisterModal()
      })
    })

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.hideLoginModal()
          this.hideRegisterModal()
        }
      })
    })
  }

  updateAuthUI() {
    if (this.isAuthenticated && this.user) {
      this.loginBtn.style.display = "none"
      this.logoutBtn.style.display = "inline-flex"
      this.userNameElement.textContent = this.user.full_name || this.user.email
    } else {
      this.loginBtn.style.display = "inline-flex"
      this.logoutBtn.style.display = "none"
      this.userNameElement.textContent = "Guest"
    }
  }

  showLoginModal() {
    this.loginModal.classList.add("active")
  }

  hideLoginModal() {
    this.loginModal.classList.remove("active")
    this.loginForm.reset()
  }

  showRegisterModal() {
    this.registerModal.classList.add("active")
  }

  hideRegisterModal() {
    this.registerModal.classList.remove("active")
    this.registerForm.reset()
  }

  async handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-password").value

    try {
      const response = await API.auth.login(email, password)

      if (response && response.access_token) {
        this.setSession(response.access_token)

        // Fetch user info
        const userInfo = { email } // In a real app, you'd fetch user details
        this.setUser(userInfo)

        this.hideLoginModal()
        this.updateAuthUI()

        // Show success message
        alert("Login successful!")

        // Reload the page to refresh data
        window.location.reload()
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`)
    }
  }

  async handleRegister(e) {
    e.preventDefault()

    const fullName = document.getElementById("register-name").value
    const email = document.getElementById("register-email").value
    const password = document.getElementById("register-password").value
    const confirmPassword = document.getElementById("register-confirm-password").value

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const userData = {
        full_name: fullName,
        email,
        password,
      }

      const response = await API.auth.register(userData)

      if (response) {
        this.hideRegisterModal()
        this.showLoginModal()

        // Show success message
        alert("Registration successful! Please login.")
      }
    } catch (error) {
      alert(`Registration failed: ${error.message}`)
    }
  }

  setSession(token) {
    localStorage.setItem("token", token)
    this.token = token
    this.isAuthenticated = true
  }

  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user))
    this.user = user
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.token = null
    this.user = null
    this.isAuthenticated = false
    this.updateAuthUI()

    // Reload the page to refresh data
    window.location.reload()
  }

  isUserAuthenticated() {
    return this.isAuthenticated
  }

  getToken() {
    return this.token
  }

  getUser() {
    return this.user
  }
}

// Initialize the auth manager
const authManager = new AuthManager()
