import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LoadingSpinner, ErrorMessage, InfoMessage } from '../components/LoadingAndError'
import { seatService, bookingService  } from '../services/apiService'
import { handleApiError } from '../utils/errorHandler'
import { useBooking } from '../contexts/BookingContext'
import { formatCurrency } from '../utils/helpers'

export function SeatBookingPage() {
  const { showId } = useParams()
  const navigate = useNavigate()
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { booking, setSeats: updateSelectedSeats, totalPrice, convenienceFee, grandTotal } = useBooking()
  const [selectedSeats, setSelectedSeats] = useState([])

  useEffect(() => {
    loadSeats()
  }, [showId])

  const loadSeats = async () => {
    try {
      setLoading(true)
      setError(null)
      // Validate showId before making API call
      if (!showId || showId === 'undefined' || showId === 'null') {
        setError('Invalid show ID')
        setLoading(false)
        return
      }
      const data = await seatService.getByShow(showId)
      setSeats(data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load seats'
      setError(errorMsg)
      console.error('Failed to load seats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSeatClick = (seat) => {
    // Can't select if booked
    if (seat.status === 'BOOKED' || seat.status === 'BLOCKED') return

    const isSelected = selectedSeats.find(s => s.id === seat.id)
    
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id))
    } else {
      setSelectedSeats([...selectedSeats, { ...seat, status: 'SELECTED' }])
    }
  }

  useEffect(() => {
    updateSelectedSeats(selectedSeats)
  }, [selectedSeats])

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat')
      return
    }

    // Update booking context with selected seats before navigating to payment
    updateSelectedSeats(selectedSeats)
    
    // Navigate to payment - booking will be created in PaymentPage
    navigate('/payment')
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading seat map..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadSeats} />
      </div>
    )
  }

  // Group seats by row
  const seatsByRow = {}
  seats.forEach(seat => {
    if (!seatsByRow[seat.row]) {
      seatsByRow[seat.row] = []
    }
    seatsByRow[seat.row].push(seat)
  })

  // Sort rows
  const sortedRows = Object.keys(seatsByRow).sort()

  const getSeatColor = (seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) {
      return 'bg-cyan-400 text-[#0d082b] border-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-105'
    }
    
    switch (seat.status) {
      case 'AVAILABLE':
        return seat.seatType === 'PREMIUM' 
          ? 'bg-transparent border border-pink-500/40 text-pink-300 hover:border-pink-500 hover:bg-pink-500/10' 
          : 'bg-transparent border border-white/20 text-slate-300 hover:border-cyan-400/50 hover:bg-white/5'
      case 'BLOCKED':
      case 'BOOKED':
        return 'bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed opacity-30'
      default:
        return 'bg-white/5 border border-white/10 text-slate-400'
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="app-container px-4">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight uppercase">Select Your Seats</h1>
          <p className="text-slate-400 font-semibold text-sm">
            {booking.theatre?.name} • <span className="text-cyan-400 font-bold">{booking.show?.showTime || 'Show Time'}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-10">
              {/* Curved Glowing Screen Representation */}
              <div className="relative w-4/5 mx-auto mb-16 text-center">
                <div className="w-full h-3 border-t-2 border-cyan-400/80 rounded-[50%] shadow-[0_-3px_15px_rgba(6,182,212,0.6)]" />
                <div className="absolute top-2 left-0 right-0 h-14 bg-gradient-to-b from-cyan-400/15 to-transparent pointer-events-none filter blur-md" />
                <p className="text-[10px] uppercase font-black tracking-widest text-cyan-400/60 mt-4">Screen</p>
              </div>

              {/* Seats Grid */}
              <div className="space-y-4 mb-10 overflow-x-auto py-2">
                <div className="min-w-[480px] space-y-4">
                  {sortedRows.map(row => (
                    <div key={row} className="flex justify-center items-center gap-4">
                      {/* Row Label */}
                      <span className="w-6 text-center font-bold text-xs text-slate-500">{row}</span>

                      {/* Seats */}
                      <div className="flex gap-2 flex-wrap justify-center">
                        {seatsByRow[row].map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === 'BOOKED' || seat.status === 'BLOCKED'}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center ${getSeatColor(seat)}`}
                            title={`${seat.row}${seat.seatNumber} - ${seat.price}`}
                          >
                            {seat.seatNumber}
                          </button>
                        ))}
                      </div>

                      {/* Row Label */}
                      <span className="w-6 text-center font-bold text-xs text-slate-500">{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-transparent border border-white/20 rounded-md" />
                    <span>Regular</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-transparent border border-pink-500/40 rounded-md" />
                    <span>Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-cyan-400 rounded-md shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 bg-white/5 border border-white/5 rounded-md opacity-30" />
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-black text-white mb-5 tracking-wide uppercase border-b border-white/10 pb-3">Booking Summary</h3>

              {/* Selected Seats */}
              <div className="mb-6 pb-5 border-b border-white/10">
                <p className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 mb-3">Selected Seats</p>
                {selectedSeats.length === 0 ? (
                  <p className="text-slate-500 text-sm font-semibold">Select seats on the map</p>
                ) : (
                  <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
                    {selectedSeats
                      .sort((a, b) => `${a.row}${a.seatNumber}`.localeCompare(`${b.row}${b.seatNumber}`))
                      .map(seat => (
                        <span
                          key={seat.id}
                          className="px-3 py-1 bg-white/5 text-white rounded-xl text-xs font-extrabold tracking-tight border border-white/10"
                        >
                          {seat.row}-{seat.seatNumber}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-5 border-b border-white/10">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Tickets ({selectedSeats.length})</span>
                  <span className="text-white">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Convenience Fee</span>
                  <span className="text-white">{formatCurrency(convenienceFee)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">Total Payable</span>
                  <span className="text-2xl font-black text-pink-500">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0}
                className="btn-primary w-full py-3.5 justify-center text-sm shadow-lg shadow-pink-500/20"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
