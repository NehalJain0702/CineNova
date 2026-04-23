import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { BookingProvider } from './contexts/BookingContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { useAuth } from './contexts/AuthContext'
import { LoadingSpinner } from './components/LoadingAndError'

// Pages
import  HomePage  from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'
import  MovieDetailsPage  from './pages/MovieDetailsPage'
import { TheatreSelectionPage } from './pages/TheatreSelectionPage'
import { SeatBookingPage } from './pages/SeatBookingPage'
import { PaymentPage } from './pages/PaymentPage'
import { BookingConfirmationPage } from './pages/BookingConfirmationPage'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

// App Content
function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/movie/:movieId"
            element={
              <ProtectedRoute>
                <MovieDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theatres/:movieId"
            element={
              <ProtectedRoute>
                <TheatreSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seats/:showId"
            element={
              <ProtectedRoute>
                <SeatBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation/:bookingId"
            element={
              <ProtectedRoute>
                <BookingConfirmationPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </AuthProvider>
    </Router>
  )
}
