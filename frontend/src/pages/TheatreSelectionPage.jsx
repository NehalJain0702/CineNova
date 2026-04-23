import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LoadingSpinner, ErrorMessage } from '../components/LoadingAndError'
import { theatreService, showService } from '../services/apiService'
import { handleApiError } from '../utils/errorHandler'
import { useBooking } from '../contexts/BookingContext'
import { MapPin, Clock } from 'lucide-react'

export function TheatreSelectionPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [theatres, setTheatres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTheatreId, setSelectedTheatreId] = useState(null)
  const [showsData, setShowsData] = useState({})
  const { booking, setTheatre, setShow } = useBooking()

  useEffect(() => {
    loadTheatres()
  }, [movieId])

  const loadTheatres = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await theatreService.getByMovieId(movieId)
      setTheatres(data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load theatres'
      setError(errorMsg)
      console.error('Failed to load theatres:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadShowsForTheatre = async (theatreId) => {
    try {
      if (showsData[theatreId]) return // Already loaded

      const data = await showService.getByMovieAndTheatre(movieId, theatreId)
      setShowsData(prev => ({
        ...prev,
        [theatreId]: data || [],
      }))
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load shows'
      console.error('Failed to load shows:', errorMsg, err)
    }
  }

  const handleTheatreSelect = async (theatre) => {
    setSelectedTheatreId(theatre.id)
    await loadShowsForTheatre(theatre.id)
  }

  const handleShowSelect = (theatre, show) => {
    setTheatre(theatre)
    setShow(show)
    navigate(`/seats/${show.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading theatres..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadTheatres} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Select Theatre & Show Time</h1>
          <p className="text-gray-600">
            Choose from available theatres for {booking.movie?.title || 'your movie'}
          </p>
        </div>

        {/* Theatres List */}
        {theatres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No theatres available for this movie</p>
          </div>
        ) : (
          <div className="space-y-4">
            {theatres.map(theatre => (
              <div key={theatre.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Theatre Header */}
                <div
                  onClick={() => handleTheatreSelect(theatre)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition border-b border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{theatre.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{theatre.location}</span>
                      </div>
                      {theatre.distance && (
                        <p className="text-sm text-gray-600 mt-1">
                          {theatre.distance} km away
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        selectedTheatreId === theatre.id
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {selectedTheatreId === theatre.id ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Show Times */}
                {selectedTheatreId === theatre.id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    {!showsData[theatre.id] ? (
                      <p className="text-gray-600">Loading show times...</p>
                    ) : showsData[theatre.id].length === 0 ? (
                      <p className="text-gray-600">No show times available</p>
                    ) : (
                      <div className="space-y-3">
                        <p className="font-semibold text-gray-900 mb-3">Available Shows:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {showsData[theatre.id].map(show => (
                            <button
                              key={show.id}
                              onClick={() => handleShowSelect(theatre, show)}
                              className="p-3 border-2 border-gray-300 rounded-lg hover:border-rose-600 hover:bg-rose-50 transition text-center"
                            >
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="font-bold text-gray-900">
                                  {show.showTime || 'N/A'}
                                </span>
                              </div>
                              {show.format && (
                                <p className="text-xs text-gray-600">{show.format}</p>
                              )}
                              {show.price && (
                                <p className="text-sm font-semibold text-rose-600 mt-1">
                                  ₹{show.price}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
