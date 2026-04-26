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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading seat map..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      return 'bg-rose-600 text-white'
    }
    
    switch (seat.status) {
      case 'AVAILABLE':
        return seat.seatType === 'PREMIUM' ? 'bg-purple-300 hover:bg-purple-400' : 'bg-green-300 hover:bg-green-400'
      case 'BLOCKED':
        return 'bg-yellow-400 cursor-not-allowed'
      case 'BOOKED':
        return 'bg-gray-400 cursor-not-allowed'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Select Your Seats</h1>
          <p className="text-gray-600">
            {booking.theatre?.name} • {booking.show?.showTime || 'Show Time'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              <div className="text-center mb-8">
                <div className="inline-block border-4 border-gray-900 w-full py-2 mb-4 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-1 text-xs font-bold">
                    SCREEN
                  </div>
                </div>
              </div>

              {/* Seats Grid */}
              <div className="space-y-3 mb-8">
                {sortedRows.map(row => (
                  <div key={row} className="flex justify-center items-center gap-2">
                    {/* Row Label */}
                    <span className="w-8 text-center font-bold text-gray-600">{row}</span>

                    {/* Seats */}
                    <div className="flex gap-2 flex-wrap justify-center">
                      {seatsByRow[row].map(seat => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'BOOKED' || seat.status === 'BLOCKED'}
                          className={`w-8 h-8 rounded text-xs font-semibold transition ${getSeatColor(seat)}`}
                          title={`${seat.row}${seat.seatNumber} - ${seat.price}`}
                        >
                          {seat.seatNumber}
                        </button>
                      ))}
                    </div>

                    {/* Row Label */}
                    <span className="w-8 text-center font-bold text-gray-600">{row}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-300 rounded" />
                    <span>Regular</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-300 rounded" />
                    <span>Premium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-rose-600 rounded" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded" />
                    <span>Booked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>

              {/* Selected Seats */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <p className="font-semibold text-gray-700 mb-2">Selected Seats:</p>
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-600 text-sm">No seats selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats
                      .sort((a, b) => `${a.row}${a.seatNumber}`.localeCompare(`${b.row}${b.seatNumber}`))
                      .map(seat => (
                        <span
                          key={seat.id}
                          className="px-2 py-1 bg-rose-100 text-rose-800 rounded text-xs font-semibold"
                        >
                          {seat.row}
                          {seat.seatNumber}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ticket Price ({selectedSeats.length})</span>
                  <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Convenience Fee (2%)</span>
                  <span className="font-semibold">{formatCurrency(convenienceFee)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-rose-600">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <InfoMessage message={`${selectedSeats.length} seat(s) selected. Total: ${formatCurrency(grandTotal)}`} />
              )}

              {/* Proceed Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0}
                className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
