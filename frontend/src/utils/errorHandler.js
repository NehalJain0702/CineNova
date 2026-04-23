// Custom error class
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const message = error.response.data?.message || 'An error occurred'
    
    return {
      message,
      status,
      data: error.response.data,
      isNetworkError: false,
    }
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
      isNetworkError: true,
    }
  } else {
    // Error in request setup
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      isNetworkError: false,
    }
  }
}

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_ALREADY_EXISTS: 'Email already registered. Please login instead.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 6 characters.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  SEATS_NOT_AVAILABLE: 'Selected seats are no longer available.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
}
