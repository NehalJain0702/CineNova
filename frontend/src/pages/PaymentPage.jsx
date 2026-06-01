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
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 max-w-sm text-center">
          <p className="text-slate-400 text-lg mb-6 font-semibold">Please login to continue</p>
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary w-full justify-center"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!booking.show || !booking.seats || booking.seats.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 max-w-sm text-center">
          <p className="text-slate-400 text-lg mb-6 font-semibold">Invalid booking data. Please select seats again.</p>
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
      const paymentResponse = await paymentService.initiatePayment(grandTotal)
      if (paymentResponse?.orderId) {

    const options = {
        key: "rzp_test_SwL03XTmh32J9b",
        amount: paymentResponse.amount,
        currency: "INR",
        order_id: paymentResponse.orderId,

        name: "CineNova",
        description: "Movie Ticket Booking",

        handler: async function (response) {

            const verifyResponse =
                await paymentService.verifyPayment({
                    razorpay_payment_id:
                        response.razorpay_payment_id,

                    razorpay_order_id:
                        response.razorpay_order_id,

                    razorpay_signature:
                        response.razorpay_signature
                });

            if (
                verifyResponse.status === "SUCCESS" ||
                verifyResponse.paymentStatus === "COMPLETED"
            ) {

                await bookingService.confirmBooking(
                    bookingId
                );

                resetBooking();

                navigate(`/confirmation/${bookingId}`);
            }
        }
    };

    const rzp = new window.Razorpay(options);

    rzp.open();

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
    <div className="min-h-screen py-12">
      <div className="app-container px-4">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight uppercase">Complete Payment</h1>
          <p className="text-slate-400 font-semibold text-sm">Secure checkout for your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              {error && (
                <div className="mb-6">
                  <ErrorMessage message={error} onRetry={() => setError(null)} />
                </div>
              )}

              <form onSubmit={handleProcessPayment} className="space-y-8">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="text-xs font-black text-slate-400 mb-4 tracking-wider uppercase">Select Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'UPI', label: 'UPI Instant Pay', icon: Smartphone },
                      { id: 'CARD', label: 'Credit or Debit Card', icon: CreditCard },
                      { id: 'NETBANKING', label: 'Net Banking', icon: Building2 },
                    ].map(method => {
                      const Icon = method.icon
                      const isActive = paymentMethod === method.id
                      return (
                        <label
                          key={method.id}
                          className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                            isActive
                              ? 'border-pink-500/50 bg-pink-500/10 text-white'
                              : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={isActive}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-pink-500 border-white/10 bg-transparent focus:ring-0 focus:ring-offset-0"
                          />
                          <Icon className="w-5 h-5 ml-4 text-slate-400" />
                          <span className="ml-3 font-extrabold text-sm uppercase tracking-wider">
                            {method.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Payment Details based on method */}
                {paymentMethod === 'CARD' && (
                  <div className="space-y-4 p-5 bg-white/[0.02] border border-white/10 rounded-2xl animate-in fade-in duration-200">
                    <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Card Details</h4>
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="input"
                      disabled={loading}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="input"
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="input"
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="space-y-4 p-5 bg-white/[0.02] border border-white/10 rounded-2xl animate-in fade-in duration-200">
                    <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">UPI ID</h4>
                    <input
                      type="text"
                      placeholder="username@upi"
                      className="input"
                      disabled={loading}
                    />
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-pink-500 focus:ring-0 focus:ring-offset-0"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-xs text-slate-400 leading-normal">
                    I agree to the <a href="#" className="text-white underline font-semibold">terms & conditions</a> and <a href="#" className="text-white underline font-semibold">privacy policy</a>
                  </label>
                </div>

                {/* Warning about test environment */}
                <InfoMessage 
                  message="This is a demo checkout. You can enter any mock credentials to complete payment." 
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !termsAccepted}
                  className="btn-primary w-full py-4 justify-center text-sm shadow-lg shadow-pink-500/20"
                >
                  {loading ? 'Processing Pay...' : `Pay ${formatCurrency(grandTotal)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-black text-white mb-5 tracking-wide uppercase border-b border-white/10 pb-3">Booking Details</h3>

              {/* Movie */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Movie</p>
                <p className="font-bold text-white">{booking.movie?.title}</p>
              </div>

              {/* Theatre & Show */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">Theatre</p>
                <p className="font-bold text-white">{booking.theatre?.name}</p>
                <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1 mt-4">Show Time</p>
                <p className="font-bold text-white">{booking.show?.showTime}</p>
              </div>

              {/* Seats */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-2">Selected Seats</p>
                <div className="flex flex-wrap gap-2">
                  {booking.seats
                    .sort((a, b) => `${a.row}${a.seatNumber}`.localeCompare(`${b.row}${b.seatNumber}`))
                    .map(seat => (
                      <span
                        key={seat.id}
                        className="px-3 py-1 bg-white/5 text-white rounded-xl text-xs font-extrabold border border-white/10"
                      >
                        {seat.row}-{seat.seatNumber}
                      </span>
                    ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3 mb-6 pb-5 border-b border-white/10">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Tickets ({booking.seats.length})</span>
                  <span className="text-white">{formatCurrency(booking.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-slate-400">Convenience Fee</span>
                  <span className="text-white">{formatCurrency(booking.convenienceFee)}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">Total Payable</span>
                  <span className="text-2xl font-black text-pink-500">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
