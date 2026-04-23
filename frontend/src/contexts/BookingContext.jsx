import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    movie: null,
    theatre: null,
    show: null,
    seats: [],
    bookingId: null,
  })

  const setMovie = (movie) => {
    setBooking(prev => ({ ...prev, movie }))
  }

  const setTheatre = (theatre) => {
    setBooking(prev => ({ ...prev, theatre }))
  }

  const setShow = (show) => {
    setBooking(prev => ({ ...prev, show }))
  }

  const setSeats = (seats) => {
    setBooking(prev => ({ ...prev, seats }))
  }

  const setBookingId = (bookingId) => {
    setBooking(prev => ({ ...prev, bookingId }))
  }

  const resetBooking = () => {
    setBooking({
      movie: null,
      theatre: null,
      show: null,
      seats: [],
      bookingId: null,
    })
  }

  // Calculate total price
  const totalPrice = booking.seats.reduce((sum, seat) => sum + (seat.price || 0), 0)
  const convenienceFee = Math.round(totalPrice * 0.02 * 100) / 100
  const grandTotal = totalPrice + convenienceFee

  return (
    <BookingContext.Provider value={{
      booking,
      setMovie,
      setTheatre,
      setShow,
      setSeats,
      setBookingId,
      resetBooking,
      totalPrice,
      convenienceFee,
      grandTotal,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}
