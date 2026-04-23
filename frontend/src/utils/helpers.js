// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

// Format date and time
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const formatTime = (timeString) => {
  if (!timeString) return ''
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Seat row generator (A-Z)
export const generateSeatRows = (count) => {
  const rows = []
  for (let i = 0; i < count; i++) {
    rows.push(String.fromCharCode(65 + i))
  }
  return rows
}

// Generate seat label
export const getSeatLabel = (row, col) => {
  return `${row}${col}`
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password
export const isValidPassword = (password) => {
  return password.length >= 6
}

// Local storage helpers
export const storage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage error:', error)
    }
  },

  getItem: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage error:', error)
      return null
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Storage error:', error)
    }
  },

  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Storage error:', error)
    }
  },
}

// Delay utility for testing
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
