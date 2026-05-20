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
      // Validate movieId before making API call
      if (!movieId || movieId === 'undefined' || movieId === 'null') {
        setError('Invalid movie ID')
        setLoading(false)
        return
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading theatres..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadTheatres} />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="app-container px-4">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight uppercase">Select Theatre & Show Time</h1>
          <p className="text-slate-400 font-semibold text-sm">
            Choose from available theatres for <span className="text-pink-400 font-bold">{booking.movie?.title || 'your movie'}</span>
          </p>
        </div>

        {/* Theatres List */}
        {theatres.length === 0 ? (
          <div className="text-center py-16 card max-w-2xl mx-auto">
            <p className="text-slate-400 text-lg font-bold">No theatres available for this movie.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {theatres.map(theatre => (
              <div key={theatre.id} className="card overflow-hidden">
                {/* Theatre Header */}
                <div
                  onClick={() => handleTheatreSelect(theatre)}
                  className={`p-5 sm:p-6 cursor-pointer hover:bg-white/5 transition-all duration-300 ${selectedTheatreId === theatre.id ? 'border-b border-white/10' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black uppercase tracking-wide text-white mb-1">{theatre.name}</h3>
                      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium">{theatre.location}</span>
                      </div>
                      {theatre.distance && (
                        <p className="text-xs text-slate-500 ml-5 font-semibold">
                          {theatre.distance} km away
                        </p>
                      )}
                    </div>
                    
                    <div className="text-left sm:text-right">
                      {selectedTheatreId === theatre.id ? (
                        <span className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-lg shadow-pink-500/20 scale-105 transition-all">
                          Selected
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-bold border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                          View Shows
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Show Times Panel */}
                {selectedTheatreId === theatre.id && (
                  <div className="p-5 sm:p-6 bg-white/[0.02]">
                    {!showsData[theatre.id] ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                      </div>
                    ) : showsData[theatre.id].length === 0 ? (
                      <p className="text-slate-400 text-center py-4 font-bold">No show times available</p>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-xs font-black text-cyan-400 mb-4 tracking-wider uppercase">Available Shows</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {showsData[theatre.id].map(show => (
                            <button
                              key={show.id}
                              onClick={() => handleShowSelect(theatre, show)}
                              className="group flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-[#0d082b]"
                            >
                              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                <span className="font-extrabold text-white text-sm group-hover:text-cyan-300 transition-colors">
                                  {show.showTime || 'N/A'}
                                </span>
                              </div>
                              {show.format && (
                                <p className="text-[9px] uppercase font-bold text-slate-300 tracking-wider mb-2 border border-white/10 px-2 py-0.5 rounded-full">{show.format}</p>
                              )}
                              {show.price && (
                                <p className="text-xs font-black text-pink-500">
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
