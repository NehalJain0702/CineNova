import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/apiService'
import { handleApiError, ERROR_MESSAGES } from '../utils/errorHandler'
import { isValidEmail, isValidPassword } from '../utils/helpers'
import { Eye, EyeOff } from 'lucide-react'

export function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!isValidEmail(formData.email)) {
      setError(ERROR_MESSAGES.INVALID_EMAIL)
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (!isValidPassword(formData.password)) {
      setError(ERROR_MESSAGES.INVALID_PASSWORD)
      return false
    }
    if (mode === 'signup' && !formData.name.trim()) {
      setError('Name is required')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      setError('')

      let response

      if (mode === 'login') {
        response = await authService.login(formData.email, formData.password)
      } else {
        response = await authService.signup(formData.name, formData.email, formData.password)
      }

      if (response?.token && response?.user) {
        login(response.user, response.token)
        navigate('/')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Authentication failed'
      setError(errorMsg)
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setFormData({ name: '', email: '', password: '' })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CineNova</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => toggleMode()}
              className={`flex-1 py-3 font-semibold text-center transition ${
                mode === 'login'
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleMode()}
              className={`flex-1 py-3 font-semibold text-center transition ${
                mode === 'signup'
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Sign Up Only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-2">
              Demo credentials (for testing):
            </p>
            <p className="text-xs text-gray-600 text-center">
              Email: user@example.com<br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
