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
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 sm:p-10 relative overflow-hidden">
          {/* Logo & Branding */}
          <div className="text-center mb-8 flex flex-col items-center">
            {logo && (
              <img
                src={logo}
                alt="CineNova"
                className="w-12 h-12 object-contain mb-3 filter brightness-110"
              />
            )}
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">CineNova</h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Your personal ticket to premium entertainment</p>
          </div>

          {/* Form Tabs */}
          <div className="flex gap-6 mb-8 border-b border-white/10">
            <button
              onClick={() => toggleMode()}
              className={`flex-1 pb-3 text-sm font-black uppercase tracking-wider text-center border-b-2 transition-all duration-300 ${
                mode === 'login'
                  ? 'text-white border-pink-500'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => toggleMode()}
              className={`flex-1 pb-3 text-sm font-black uppercase tracking-wider text-center border-b-2 transition-all duration-300 ${
                mode === 'signup'
                  ? 'text-white border-pink-500'  
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="animate-in fade-in duration-200">
                <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl animate-in shake duration-300">
                <p className="text-red-400 text-xs font-bold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 justify-center text-sm shadow-lg shadow-pink-500/20 mt-2"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest mb-3">
              Demo Credentials (Testing)
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-slate-400 font-semibold space-y-1 text-center">
              <div><span className="font-bold text-white">Email:</span> user@example.com</div>
              <div><span className="font-bold text-white">Password:</span> password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
