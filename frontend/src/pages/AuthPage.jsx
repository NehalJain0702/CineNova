import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/apiService'
import { handleApiError, ERROR_MESSAGES } from '../utils/errorHandler'
import { isValidEmail, isValidPassword } from '../utils/helpers'
import { Eye, EyeOff } from 'lucide-react'
import logo from "../components/img.png"
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
    <div className="h-auto  bg-gradient-to-br from-black via-gray-900 to-blue-900 flex justify-center py-12 px-4">
      <div className='ml-10 opacity-0 animate-[float_4s_ease-in-out_infinite] w-fit flex flex-col items-center gap-5'>
            <img src="https://tse1.mm.bing.net/th/id/OIP.axr85VETKpqcMVHBu2tblgHaK-?pid=Api&P=0&h=180" alt="picture" />
            <img src="https://tse4.mm.bing.net/th/id/OIP.tztSa_W2yWRsdGOycWr07AHaLH?pid=Api&P=0&h=180" />
            <img src="https://tse3.mm.bing.net/th/id/OIP.yXg9NB5bs1ELdFSZd2P8hAHaLH?pid=Api&P=0&h=180" alt="picture" />

      </div>
      <div className='opacity-0 animate-[float_4s_ease-in-out_infinite] w-fit p-5 flex flex-col items-center gap-5'>
            <img src="https://tse2.mm.bing.net/th/id/OIP.OXhfO-ecLhBG3hfUkoPG2AHaLH?pid=Api&P=0&h=180" alt="picture" />
            <img src="https://tse4.mm.bing.net/th/id/OIP.4jan6dJmsliV_27nlC99ZAHaLH?pid=Api&P=0&h=180" alt="picture" />
            <img src="https://tse4.mm.bing.net/th/id/OIP.4V1uKf-rT8My5lNu0b2HbwHaLG?pid=Api&P=0&h=180" alt="picture" />

      </div>
      <div className='opacity-0 animate-[float_4s_ease-in-out_infinite] w-fit flex flex-col items-center gap-5'>
            <img src="https://tse1.mm.bing.net/th/id/OIP.KtLnZJrRsGjc3QKAi1kMpwHaK-?pid=Api&P=0&h=180" alt="picture" />
            <img src="https://tse4.mm.bing.net/th/id/OIP.sX3uyefJuMZ0GQR-yP8EzwAAAA?pid=Api&P=0&h=180" alt="picture" />
            <img src="https://tse2.mm.bing.net/th/id/OIP.tKyQlW6KgA8XOfBtf2wOugHaLH?pid=Api&P=0&h=180" alt="picture" />

      </div>
      <div className="backdrop-blur-lg w-full max-w-md p-5">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
          {/* Logo */}
          <div className="text-center mb-8">
           <img
                             src={logo}
                             alt="Logo"
                             className="w-15 h-15  object-cover"
                           />
            <h1 className="text-2xl font-bold text-white">CineNova</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => toggleMode()}
              className={`flex-1 py-3 font-semibold text-center transition ${
                mode === 'login'
                  ? 'text-white border-b-2 border-black'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleMode()}
              className={`flex-1 py-3 font-semibold text-center transition ${
                mode === 'signup'
                  ? 'text-white border-b-2 border-black'  
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pr-6">
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
                  className="w-full px-4 py-2 bg-gray-500 border border-gray-300 placeholder-white rounded-lg focus:outline-none focus:border-rose-600"
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
                className=" w-full px-4  py-2 border bg-gray-500 border-gray-300  placeholder-white rounded-lg focus:outline-none focus:border-rose-600"
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
                  className="w-full px-4 py-2 border  bg-gray-500 border-gray-300  placeholder-white rounded-lg focus:outline-none focus:border-rose-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-200 hover:text-gray-500"
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
              className=" flex justify-center items-center w-40 mx-auto bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
