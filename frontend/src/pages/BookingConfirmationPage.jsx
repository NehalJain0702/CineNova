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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading booking confirmation..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadBookingDetails} />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 max-w-sm text-center">
          <p className="text-slate-400 text-lg mb-6">Booking not found</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full justify-center"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const totalAmount = (booking.totalAmount || 0) + (booking.convenienceFee || 0)

  return (
    <div className="min-h-screen py-16">
      <div className="app-container px-4">
        {/* Success Message Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-full shadow-lg shadow-cyan-400/5">
              <CheckCircle className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Booking Confirmed!</h1>
          <p className="text-slate-400 font-semibold text-sm">Your tickets are confirmed. Enjoy the show!</p>
        </div>

        {/* Main Ticket Receipt Card */}
        <div className="max-w-xl mx-auto">
          <div className="card overflow-visible relative">
            
            {/* Top Ticket Portion */}
            <div className="p-6 sm:p-8">
              {/* Booking Reference */}
              <div className="text-center mb-6 pb-6 border-b border-white/5">
                <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Booking Reference</p>
                <p className="text-3xl font-black text-white font-mono tracking-widest">{bookingId}</p>
                <p className="text-[10px] text-slate-500 mt-2 font-semibold">Present this code at the ticket counter</p>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Movie */}
                <div className="col-span-2">
                  <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Movie</p>
                  <p className="font-extrabold text-white text-sm uppercase">{booking.movie?.title}</p>
                </div>

                {/* Theatre */}
                <div className="col-span-2">
                  <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Theatre</p>
                  <p className="font-bold text-white text-sm">{booking.theatre?.name}</p>
                </div>

                {/* Show Time */}
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Time</p>
                  <p className="font-bold text-white text-sm">{booking.show?.showTime}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Date</p>
                  <p className="font-bold text-white text-sm">
                    {booking.show?.showDate ? new Date(booking.show.showDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Seats */}
              <div>
                <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mb-2">Seats</p>
                <div className="flex flex-wrap gap-1.5">
                  {booking.seats && booking.seats.map((seat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 bg-white/5 text-white rounded-lg text-xs font-extrabold border border-white/10"
                    >
                      {seat.row}-{seat.seatNumber}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tear-off Ticket Division */}
            <div className="relative h-6 my-2">
              <div className="ticket-cutout-left" />
              <div className="ticket-cutout-right" />
              <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-white/10 -translate-y-1/2" />
            </div>

            {/* Bottom Ticket Portion */}
            <div className="p-6 sm:p-8">
              {/* Price Breakdown */}
              <div className="space-y-2 mb-6 pb-6 border-b border-white/5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Tickets ({booking.seats?.length || 0} seats)</span>
                  <span className="text-white">{formatCurrency(booking.totalAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Convenience Fee</span>
                  <span className="text-white">{formatCurrency(booking.convenienceFee || 0)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/5">
                  <span className="text-xs font-extrabold text-white">Grand Total</span>
                  <span className="text-base font-black text-pink-500">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
                <p className="text-[10px] font-extrabold text-slate-300 tracking-wider uppercase mb-2.5">Important Information</p>
                <ul className="text-[10px] text-slate-400 space-y-2 font-semibold">
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">✓</span> A confirmation email has been sent.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">✓</span> Present your booking code at the counter.
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400">✓</span> Arrive at least 15 minutes before show time.
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleDownloadTicket}
                  className="btn-secondary py-3 text-[10px]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={handleShareBooking}
                  className="btn-secondary py-3 text-[10px]"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary py-3 text-[10px]"
                >
                  <Home className="w-3.5 h-3.5" />
                  Home
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
