// API Service for MoMo SMS Analytics

const API_URL = "http://localhost:8000/api"

// Helper function for making API requests
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `API request failed with status ${response.status}`)
    }

    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Authentication
const AuthAPI = {
  login: async (email, password) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },
}

// Transactions
const TransactionsAPI = {
  getTransactions: async (params = {}) => {
    const queryParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value)
      }
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return apiRequest(`/transactions${queryString}`)
  },

  getTransaction: async (id) => {
    return apiRequest(`/transactions/${id}`)
  },

  getSummary: async (startDate, endDate) => {
    const queryParams = new URLSearchParams()

    if (startDate) {
      queryParams.append("start_date", startDate)
    }

    if (endDate) {
      queryParams.append("end_date", endDate)
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return apiRequest(`/summary${queryString}`)
  },
}

// File Upload
const UploadAPI = {
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem("token")
    const headers = {}

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `Upload failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    }
  },
}

// Export the API services
const API = {
  auth: AuthAPI,
  transactions: TransactionsAPI,
  upload: UploadAPI,
}
