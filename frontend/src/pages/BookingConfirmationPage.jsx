import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LoadingSpinner, ErrorMessage } from '../components/LoadingAndError'
import { bookingService } from '../services/apiService'
import { handleApiError } from '../utils/errorHandler'
import { formatCurrency } from '../utils/helpers'
import { CheckCircle, Download, Share2, Home } from 'lucide-react'

export function BookingConfirmationPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadBookingDetails()
  }, [bookingId])

  const loadBookingDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      // Validate bookingId before making API call
      if (!bookingId || bookingId === 'undefined' || bookingId === 'null') {
        setError('Invalid booking ID')
        setLoading(false)
        return
      }
      const data = await bookingService.getBookingDetails(bookingId)
      setBooking(data || {})
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load booking details'
      setError(errorMsg)
      console.error('Booking details error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTicket = () => {
    // This would typically generate a PDF or similar
    alert('Ticket download functionality would be implemented here')
  }

  const handleShareBooking = () => {
    const message = `I've booked tickets for ${booking?.movie?.title} at ${booking?.theatre?.name}! Booking Reference: ${bookingId}`
    if (navigator.share) {
      navigator.share({
        title: 'CineNova Booking',
        text: message,
      }).catch(err => console.error('Share failed:', err))
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(message)
      alert('Booking details copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading booking confirmation..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadBookingDetails} />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Booking not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const totalAmount = (booking.totalAmount || 0) + (booking.convenienceFee || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">Your tickets are confirmed. Check your email for details.</p>
        </div>

        {/* Main Confirmation Card */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Booking Reference */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
              <p className="text-gray-600 text-sm mb-1">Booking Reference Number</p>
              <p className="text-4xl font-bold text-rose-600 font-mono">{bookingId}</p>
              <p className="text-gray-600 text-sm mt-2">Confirm this number at the cinema counter</p>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
              {/* Movie */}
              <div>
                <p className="text-gray-600 text-sm mb-1">Movie</p>
                <p className="font-bold text-gray-900">{booking.movie?.title}</p>
              </div>

              {/* Theatre */}
              <div>
                <p className="text-gray-600 text-sm mb-1">Theatre</p>
                <p className="font-bold text-gray-900">{booking.theatre?.name}</p>
              </div>

              {/* Show Time */}
              <div>
                <p className="text-gray-600 text-sm mb-1">Show Time</p>
                <p className="font-bold text-gray-900">{booking.show?.showTime}</p>
              </div>

              {/* Date */}
              <div>
                <p className="text-gray-600 text-sm mb-1">Show Date</p>
                <p className="font-bold text-gray-900">
                  {booking.show?.showDate ? new Date(booking.show.showDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Seats */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-gray-600 text-sm mb-3">Your Seats</p>
              <div className="flex flex-wrap gap-2">
                {booking.seats && booking.seats.map((seat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-semibold"
                  >
                    {seat.row}
                    {seat.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-8 pb-8 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-700">Ticket Price ({booking.seats?.length || 0} seats)</span>
                <span className="font-semibold">{formatCurrency(booking.totalAmount || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Convenience Fee (2%)</span>
                <span className="font-semibold">{formatCurrency(booking.convenienceFee || 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-rose-600">
                <span>Total Paid</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-900 font-semibold mb-2">📋 Important:</p>
              <ul className="text-sm text-blue-900 space-y-1">
                <li>✓ A confirmation email has been sent to your registered email address</li>
                <li>✓ Present your booking reference at the theatre counter</li>
                <li>✓ Arrive 15 minutes before the show time</li>
                <li>✓ This booking is non-cancellable and non-refundable</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handleDownloadTicket}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                <Download className="w-5 h-5" />
                Download Ticket
              </button>
              <button
                onClick={handleShareBooking}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition font-semibold"
              >
                <Share2 className="w-5 h-5" />
                Share Booking
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition font-semibold"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
