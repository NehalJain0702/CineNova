import axios from 'axios'

// In dev, Vite proxies `/api` → `http://localhost:8080` (see `vite.config.js`)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth data if token is invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTHENTICATION ====================
export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password })
    return response.data
  },

  signup: async (name, email, password) => {
    const response = await axiosInstance.post('/auth/signup', { name, email, password })
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// ==================== MOVIES ====================
export const movieService = {
  getAll: async () => {
    const response = await axiosInstance.get('/movies')
    return response.data
  },

  getById: async (movieId) => {
    const response = await axiosInstance.get(`/movies/${movieId}`)
    return response.data
  },

  searchMovies: async (query) => {
    const response = await axiosInstance.get('/movies/search', {
      params: { q: query },
    })
    return response.data
  },

  getUpcomingMovies: async () => {
    const response = await axiosInstance.get('/movies/upcoming')
    return response.data
  },
}

// ==================== THEATRES ====================
export const theatreService = {
  getAll: async () => {
    const response = await axiosInstance.get('/theatres')
    return response.data
  },

  getByMovieId: async (movieId) => {
    const response = await axiosInstance.get(`/theatres?movieId=${movieId}`)
    return response.data
  },
}

// ==================== SHOWS ====================
export const showService = {
  getByMovieAndTheatre: async (movieId, theatreId) => {
    const response = await axiosInstance.get(`/shows`, {
      params: { movieId, theatreId },
    })
    return response.data
  },

  getById: async (showId) => {
    const response = await axiosInstance.get(`/shows/${showId}`)
    return response.data
  },
}

// ==================== SEATS ====================
export const seatService = {
  getByShow: async (showId) => {
    const response = await axiosInstance.get(`/shows/${showId}/seats`)
    return response.data
  },
}

// ==================== BOOKINGS ====================
export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData)
    return response.data
  },

  getBookingDetails: async (bookingId) => {
    const response = await axiosInstance.get(`/bookings/${bookingId}`)
    return response.data
  },

  getUserBookings: async () => {
    const response = await axiosInstance.get('/bookings/user/history')
    return response.data
  },

  confirmBooking: async (bookingId) => {
    const response = await axiosInstance.put(`/bookings/${bookingId}/confirm`, {})
    return response.data
  },
}

// ==================== PAYMENTS ====================
export const paymentService = {
  initiatePayment: async (bookingId, amount, paymentMethod) => {
    const response = await axiosInstance.post('/payments', {
      bookingId,
      amount,
      paymentMethod,
    })
    return response.data
  },

  verifyPayment: async (bookingId, paymentId, signature) => {
    const response = await axiosInstance.post('/payments/verify', {
      bookingId,
      paymentId,
      signature,
    })
    return response.data
  },

  getPaymentStatus: async (bookingId) => {
    const response = await axiosInstance.get(`/payments/status/${bookingId}`)
    return response.data
  },
}

export default axiosInstance
