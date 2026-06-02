import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Search, Moon, Sun, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../hooks/useTheme'
import logo from "./img.png"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const [searchFocus, setSearchFocus] = React.useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
    setIsProfileOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`)
      setIsMenuOpen(false)
    }
  }

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }

  return (
    <nav 
      className="sticky top-0 z-50 border-b transition-all duration-300"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 243, 255, 0.95) 100%)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* LEFT SECTION: Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group hover:opacity-80 transition-opacity duration-300 no-underline"
              aria-label="CineNova Home"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={logo}
                  alt="CineNova"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span 
                className={`hidden sm:inline font-black text-lg sm:text-xl uppercase tracking-wider transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                CineNova
              </span>
            </Link>

            {/* CENTER SECTION: Search Bar (Desktop) */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden md:flex items-center flex-1 max-w-sm mx-6 lg:mx-8"
            >
              <div className="relative w-full">
                <div 
                  className="absolute left-0 inset-y-0 flex items-center pl-4 pointer-events-none transition-colors duration-300"
                  style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)' }}
                >
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="search"
                  placeholder="Search movies..."
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  className={`w-full pl-11 pr-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border ${
                    isDark
                      ? `bg-white/8 text-white placeholder:text-slate-500 border-white/15 focus:border-purple-400/50 focus:bg-white/12 focus:outline-none focus:ring-2 focus:ring-purple-400/20`
                      : `bg-slate-100/80 text-slate-900 placeholder:text-slate-500 border-slate-200/50 focus:border-purple-400/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400/20`
                  } ${searchFocus ? 'shadow-lg' : 'shadow-sm'}`}
                  aria-label="Search movies"
                />
              </div>
            </form>

            {/* RIGHT SECTION: Actions */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/5'
                }`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.5} />
                )}
              </button>

              {/* User Menu or Sign In (Desktop) */}
              {user ? (
                <div className="hidden sm:block relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                      isDark
                        ? 'bg-white/8 border border-white/15 hover:bg-white/12 hover:border-white/25'
                        : 'bg-slate-900/5 border border-slate-900/10 hover:bg-slate-900/8 hover:border-slate-900/15'
                    }`}
                    aria-label={`User menu for ${user.name || user.email}`}
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white bg-gradient-to-br from-pink-500 to-rose-600 shadow-md">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-semibold text-sm hidden lg:inline ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    } ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div 
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${
                        isDark
                          ? 'bg-slate-900/95 border-white/10 backdrop-blur-xl'
                          : 'bg-white/95 border-slate-200/50 backdrop-blur-xl'
                      }`}
                    >
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-slate-200/50'}`}>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {user.name || 'User'}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-left font-medium transition-colors duration-300 ${
                          isDark
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="hidden sm:inline-flex btn-primary text-xs sm:text-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/5'
                }`}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="md:hidden pb-4 px-2"
          >
            <div className="relative">
              <div 
                className="absolute left-0 inset-y-0 flex items-center pl-4 pointer-events-none"
                style={{ color: isDark ? 'rgba(148, 163, 184, 0.6)' : 'rgba(100, 116, 139, 0.6)' }}
              >
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Search movies..."
                className={`w-full pl-11 pr-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 border ${
                  isDark
                    ? `bg-white/8 text-white placeholder:text-slate-500 border-white/15 focus:border-purple-400/50 focus:bg-white/12 focus:outline-none focus:ring-2 focus:ring-purple-400/20`
                    : `bg-slate-100/80 text-slate-900 placeholder:text-slate-500 border-slate-200/50 focus:border-purple-400/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400/20`
                } shadow-sm`}
                aria-label="Search movies on mobile"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div 
          className={`md:hidden border-t transition-all duration-300 ${
            isDark
              ? 'bg-slate-900/50 border-white/10'
              : 'bg-slate-900/5 border-slate-200/50'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            {user ? (
              <>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isDark ? 'bg-white/8 border border-white/10' : 'bg-slate-900/5 border border-slate-200/50'
                }`}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white bg-gradient-to-br from-pink-500 to-rose-600">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {user.name || 'User'}
                    </p>
                    <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    isDark
                      ? 'text-red-400 hover:bg-red-500/10 bg-white/5'
                      : 'text-red-600 hover:bg-red-50 bg-slate-900/5'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="btn-primary w-full justify-center"
                onClick={closeMenus}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
