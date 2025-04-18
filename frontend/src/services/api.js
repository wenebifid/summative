import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Authentication
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password })
  return response.data
}

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

// Transactions
export const fetchTransactions = async (params = {}) => {
  const response = await api.get("/transactions", { params })
  return response.data
}

export const fetchTransaction = async (id) => {
  const response = await api.get(`/transactions/${id}`)
  return response.data
}

// Summary data
export const fetchSummaryData = async (startDate, endDate) => {
  const params = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate

  const response = await api.get("/summary", { params })
  return response.data
}

// File upload
export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export default api
