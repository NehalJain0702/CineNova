import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Search, Moon, Sun } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../hooks/useTheme'

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
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg transition-colors duration-300">
      <div className="app-container px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20 group-hover:bg-rose-500 transition-colors">
              <span className="text-white font-black text-xl tracking-tighter">B</span>
            </div>
            <span className="font-extrabold text-2xl hidden sm:inline text-slate-900 dark:text-white tracking-tight">
              CineNova
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-between gap-6 flex-1 px-8">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <input
                type="text"
                name="search"
                placeholder="Search movies, events, plays..."
                className="input pr-12 w-full bg-slate-100/60 dark:bg-slate-900/60 focus:bg-white dark:focus:bg-slate-900"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors">
                <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
            </form>

            {/* Theme Toggle & User Menu */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <>
                  <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/50 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                    <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{user.email || user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="btn-primary"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
          <div className="md:hidden py-4 px-2 space-y-4 border-t border-slate-200 dark:border-slate-800 mt-2 bg-white/95 dark:bg-slate-900/95 rounded-2xl mb-4 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search movies..."
                className="input w-full"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2">
                <Search className="w-4 h-4 text-slate-400" />
              </button>
            </form>

            {user ? (
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 px-2">
                   <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium">{user.email || user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary w-full border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary w-full"
              >
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
