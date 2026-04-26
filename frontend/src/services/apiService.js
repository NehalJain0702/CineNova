import axios from 'axios'

// ==================== AXIOS CONFIGURATION ====================
/**
 * VITE_API_URL configuration:
 * - Development: http://localhost:8080/api (Vite proxy or direct URL)
 * - Production: https://cinenova.onrender.com/api
 * Set in .env.local or .env file
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const DEBUG_API = import.meta.env.VITE_DEBUG_API === 'true'

if (DEBUG_API) {
  console.log('🔧 API Configuration:')
  console.log('  Base URL:', API_BASE_URL)
  console.log('  Environment:', import.meta.env.VITE_APP_ENV || 'development')
  console.log('  Debug Mode:', DEBUG_API)
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * - Adds JWT token from localStorage
 * - Logs outgoing requests in debug mode
 */
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (DEBUG_API) {
      console.log('📤 API Request:', {
        method: config.method.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  error => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * - Handles 401 errors (invalid/expired token)
 * - Logs responses in debug mode
 * - Provides detailed error messages
 */
axiosInstance.interceptors.response.use(
  response => {
    if (DEBUG_API) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    return response
  },
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message,
    })

    // Handle 401 Unauthorized - redirect to login
     const isAuthEndpoint = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthEndpoint) {
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
/**
 * Movie Service - handles all movie-related API calls
 * 
 * Common 400 Bad Request fixes:
 * ✓ Always validate movieId before API call
 * ✓ Convert string IDs to numbers
 * ✓ Check for undefined/null values
 * ✓ Ensure URL matches backend mapping: /api/movies/{id}
 * ✓ Verify CORS is enabled on backend
 * ✓ Check Content-Type header
 */
export const movieService = {
  /**
   * Get all movies
   * @returns {Promise<Array>} List of movies
   * @throws {Error} Network or server error
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/movies')
      if (DEBUG_API) console.log('✅ Fetched all movies:', response.data)
      return response.data
    } catch (error) {
     const status = error.response?.status           // these were missing
    const message = error.response?.data?.message || error.message
    throw new Error(status ? `HTTP ${status}: ${message}` : message)
    }
  },

  /**
   * Get a single movie by ID
   * 
   * ⚠️ CRITICAL: movieId from useParams() is a STRING
   * Must convert to number before sending to backend
   * 
   * @param {string|number} movieId - Movie ID from URL params
   * @returns {Promise<Object>} Movie details
   * @throws {Error} Invalid ID or not found
   */
  getById: async (movieId) => {
    // ✅ 1. Validate that movieId exists
    if (!movieId) {
      const error = 'Movie ID is required'
      console.error(`❌ ${error}`)
      throw new Error(error)
    }

    // ✅ 2. Check for invalid string representations
    if (movieId === 'undefined' || movieId === 'null' || movieId === '') {
      const error = `Movie ID is invalid: "${movieId}"`
      console.error(`❌ ${error}`)
      throw new Error(error)
    }

    // ✅ 3. Convert to number (URL params come as strings)
    const numericId = Number(movieId)
    if (isNaN(numericId) || numericId <= 0) {
      const error = `Movie ID must be a positive number, received: "${movieId}"`
      console.error(`❌ ${error}`)
      throw new Error(error)
    }

    if (DEBUG_API) {
      console.log(`🎬 Fetching movie:`, {
        originalId: movieId,
        numericId: numericId,
        type: typeof numericId,
        endpoint: `/api/movies/${numericId}`,
      })
    }

    try {
      // ✅ 4. Use numeric ID in the endpoint
      const response = await axiosInstance.get(`/movies/${numericId}`)
      
      if (DEBUG_API) {
        console.log(`✅ Movie fetched successfully:`, {
          id: response.data.id,
          title: response.data.title,
        })
      }

      return response.data
    } catch (error) {
      // ✅ 5. Provide detailed error information
      const errorMessage = error.response?.data?.message || error.message
      const statusCode = error.response?.status
      
      const detailedError = `Failed to fetch movie (ID: ${numericId}): ${statusCode ? `HTTP ${statusCode} - ` : ''}${errorMessage}`
      console.error(`❌ ${detailedError}`)
      
      throw error // Re-throw for component to handle
    }
  },

  /**
   * Search movies by query
   * @param {string} query - Search keyword
   * @returns {Promise<Array>} Matching movies
   */
  searchMovies: async (query) => {
    if (!query || query.trim() === '') {
      throw new Error('Search query is required')
    }

    try {
      const response = await axiosInstance.get('/movies/search', {
        params: { q: query.trim() },
      })
      if (DEBUG_API) console.log(`✅ Search results for "${query}":`, response.data)
      return response.data
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`)
    }
  },

  /**
   * Get upcoming movies
   * @returns {Promise<Array>} List of upcoming movies
   */
  getUpcomingMovies: async () => {
    try {
      const response = await axiosInstance.get('/movies/upcoming')
      if (DEBUG_API) console.log('✅ Fetched upcoming movies:', response.data)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch upcoming movies: ${error.message}`)
    }
  },
}

// ==================== THEATRES ====================
export const theatreService = {
  /**
   * Get all theatres
   * @returns {Promise<Array>} List of theatres
   */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/theatres')
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch theatres: ${error.message}`)
    }
  },

  /**
   * Get theatres by movie ID
   * @param {string|number} movieId - Movie ID
   * @returns {Promise<Array>} Theatres showing this movie
   */
  getByMovieId: async (movieId) => {
    if (!movieId) {
      throw new Error('Movie ID is required')
    }

    const numericId = Number(movieId)
    if (isNaN(numericId)) {
      throw new Error(`Invalid Movie ID: ${movieId}`)
    }

    try {
      const response = await axiosInstance.get('/theatres', {
        params: { movieId: numericId },
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch theatres for movie ${numericId}: ${error.message}`)
    }
  },
}

// ==================== SHOWS ====================
export const showService = {
  getByMovieAndTheatre: async (movieId, theatreId) => {
    if (!movieId || !theatreId) {
      throw new Error('Movie ID and Theatre ID are required')
    }
    const response = await axiosInstance.get(`/shows`, {
      params: { movieId, theatreId },
    })
    return response.data
  },

  getById: async (showId) => {
    if (!showId) {
      throw new Error('Show ID is required')
    }
    const response = await axiosInstance.get(`/shows/${showId}`)
    return response.data
  },
}

// ==================== SEATS ====================
export const seatService = {
  getByShow: async (showId) => {
    if (!showId) {
      throw new Error('Show ID is required')
    }
    const response = await axiosInstance.get(`/shows/${showId}/seats`)
    return response.data
  },
}

// ==================== BOOKINGS ====================
export const bookingService = {
  createBooking: async (bookingData) => {
    if (!bookingData) {
      throw new Error('Booking data is required')
    }
    const response = await axiosInstance.post('/bookings', bookingData)
    return response.data
  },

  getBookingDetails: async (bookingId) => {
    if (!bookingId) {
      throw new Error('Booking ID is required')
    }
    const response = await axiosInstance.get(`/bookings/${bookingId}`)
    return response.data
  },

  getUserBookings: async () => {
    const response = await axiosInstance.get('/bookings/user/history')
    return response.data
  },

  confirmBooking: async (bookingId) => {
    if (!bookingId) {
      throw new Error('Booking ID is required')
    }
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

