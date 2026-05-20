import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Search, Moon, Sun } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../hooks/useTheme'
import logo from "./img.png";
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`)
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#0c082b]/60 border-b border-white/5 backdrop-blur-xl transition-all duration-300">
      <div className="app-container px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
           <img
                  src={logo}
                  alt="Logo"
                  className="w-8 h-8 object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                />
            <span className="font-black text-lg hidden sm:inline text-white uppercase tracking-wider">
              CineNova
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-between gap-6 flex-1 px-8">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm ml-auto">
              <input
                type="text"
                name="search"
                placeholder="Search movies..."
                className="input pl-10 py-2 w-full"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Theme Toggle & User Menu */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-400 hover:bg-white/10 transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {user ? (
                <>
                  <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-white/10 bg-white/5">
                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-black">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white font-extrabold text-xs uppercase tracking-wider">{user.name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-pink-500 hover:bg-white/5 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <Link to="/auth" className="btn-primary">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-[100%] left-0 right-0 p-4 border-b border-white/10 bg-[#0c082b]/95 shadow-lg backdrop-blur-xl">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                name="search"
                placeholder="Search movies..."
                className="input pl-10"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-slate-400" />
              </button>
            </form>

            {user ? (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-black">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  <p className="text-white font-bold">{user.email || user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary w-full justify-center text-pink-500 hover:border-pink-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary w-full justify-center">
                Sign In
              </Link>
            )}
          </div>
        )}
        </div>
      </div>
    </nav>
  )
}
