import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../contexts/BookingContext'
import { useAuth } from '../contexts/AuthContext'
import { bookingService, paymentService } from '../services/apiService'
import { handleApiError, ERROR_MESSAGES } from '../utils/errorHandler'
import { formatCurrency } from '../utils/helpers'
import { LoadingSpinner, ErrorMessage, InfoMessage } from '../components/LoadingAndError'
import { CreditCard, Smartphone, Building2, AlertCircle } from 'lucide-react'

export function PaymentPage() {
  const navigate = useNavigate()
  const { booking, grandTotal, resetBooking } = useBooking()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  if (!user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to continue</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!booking.show || !booking.seats || booking.seats.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Invalid booking data. Please select seats again.</p>
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

  const handleProcessPayment = async (e) => {
    e.preventDefault()

    if (!termsAccepted) {
      setError('Please accept the terms and conditions')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Step 1: Create booking
      const bookingPayload = {
        showId: booking.show?.id,
        userId: user.id,
        seats: booking.seats?.map(s => s.id) || [],
        totalAmount: grandTotal,
      }

      if (!bookingPayload.showId || !bookingPayload.seats.length) {
        setError('Invalid booking data. Please start over.')
        setLoading(false)
        return
      }

      const bookingResponse = await bookingService.createBooking(bookingPayload)
      const bookingId = bookingResponse?.id

      if (!bookingId) {
        setError('Failed to create booking. Please try again.')
        return
      }

      // Step 2: Process payment
      const paymentResponse = await paymentService.initiatePayment(
        bookingId,
        grandTotal,
        paymentMethod
      )

      if (paymentResponse?.paymentId) {
        // Step 3: Verify payment
        const verifyResponse = await paymentService.verifyPayment(
          bookingId,
          paymentResponse.paymentId,
          paymentResponse.signature || ''
        )

        if (verifyResponse?.status === 'SUCCESS' || verifyResponse?.paymentStatus === 'COMPLETED') {
          // Payment successful
          await bookingService.confirmBooking(bookingId)
          resetBooking()
          navigate(`/confirmation/${bookingId}`)
        } else {
          setError('Payment verification failed. Please try again.')
        }
      } else {
        setError('Payment initiation failed. Please try again.')
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || ERROR_MESSAGES.PAYMENT_FAILED
      setError(errorMsg)
      console.error('Payment error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment for your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {error && (
                <ErrorMessage message={error} onRetry={() => setError(null)} />
              )}

              <form onSubmit={handleProcessPayment} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'UPI', label: 'UPI', icon: Smartphone },
                      { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'NETBANKING', label: 'Net Banking', icon: Building2 },
                    ].map(method => {
                      const Icon = method.icon
                      return (
                        <label
                          key={method.id}
                          className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                          style={{
                            borderColor: paymentMethod === method.id ? '#db2777' : '#e5e7eb',
                            backgroundColor: paymentMethod === method.id ? '#fdf2f8' : '#f9fafb',
                          }}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={paymentMethod === method.id}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4"
                          />
                          <Icon className="w-5 h-5 ml-3 text-rose-600" />
                          <span className="ml-3 font-semibold text-gray-900">
                            {method.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Payment Details based on method */}
                {paymentMethod === 'CARD' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Card Details</h4>
                    <input
                      type="text"
                      placeholder="Card Number (1234 5678 9012 3456)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                      disabled={loading}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">UPI ID</h4>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rose-600"
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-1"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the <a href="#" className="text-rose-600 hover:underline">terms and conditions</a> and <a href="#" className="text-rose-600 hover:underline">privacy policy</a>
                  </label>
                </div>

                {/* Warning about test environment */}
                <InfoMessage 
                  message="This is a test environment. Use any valid format for payment details." 
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !termsAccepted}
                  className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingSpinner size="sm" /> : `Pay ${formatCurrency(grandTotal)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h3>

              {/* Movie */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Movie</p>
                <p className="font-semibold text-gray-900">{booking.movie?.title}</p>
              </div>

              {/* Theatre & Show */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Theatre</p>
                <p className="font-semibold text-gray-900">{booking.theatre?.name}</p>
                <p className="text-sm text-gray-600 mt-2">Show Time</p>
                <p className="font-semibold text-gray-900">{booking.show?.showTime}</p>
              </div>

              {/* Seats */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Selected Seats</p>
                <div className="flex flex-wrap gap-2">
                  {booking.seats
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
              </div>

              {/* Amount */}
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ticket Price</span>
                  <span className="font-semibold">{formatCurrency(booking.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Convenience Fee</span>
                  <span className="font-semibold">{formatCurrency(booking.convenienceFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-rose-600">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
