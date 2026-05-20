import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LoadingSpinner, ErrorMessage } from '../components/LoadingAndError'
import { movieService } from '../services/apiService'
import { useBooking } from '../contexts/BookingContext'
import { Star, Clock, Globe, Calendar, Play, Tag, ShieldCheck } from 'lucide-react'

function MovieDetailsPage() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const { setMovie: setBookingMovie } = useBooking()

  /**
   * Convert and validate movieId from URL params
   * ⚠️ IMPORTANT: useParams() returns strings, not numbers
   * Backend expects integers, so we must convert
   */
  const getValidatedMovieId = () => {
    if (!movieId) {
      return null
    }

    // Convert string to number
    const numericId = Number(movieId)
    
    // Validate it's a positive integer
    if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
      console.error('❌ Invalid movie ID format:', { original: movieId, attempted: numericId })
      return null
    }

    console.log('✅ Valid movie ID:', { original: movieId, converted: numericId })
    return numericId
  }

  useEffect(() => {
    loadMovie()
  }, [movieId])
  
  // ... rest of function
  const loadMovie = async () => {
    try {
      setLoading(true)
      setError(null)

      // ✅ Validate movieId before making API call
      const validatedId = getValidatedMovieId()
      
      if (!validatedId) {
        const errorMsg = `Invalid movie ID: "${movieId}". Expected a positive integer.`
        console.error(errorMsg)
        setError(errorMsg)
        setLoading(false)
        return
      }

      // ✅ Make API call with validated numeric ID
      console.log(`📤 Fetching movie from API with ID: ${validatedId}`)
      const data = await movieService.getById(validatedId)
      
      // ✅ Verify response is valid
      if (!data) {
        throw new Error('Server returned empty movie data')
      }

      console.log('✅ Movie data received:', { id: data.id, title: data.title })
      setMovie(data)
    } catch (err) {
      // ✅ Comprehensive error handling
      const errorMessage = 
        err.response?.data?.message ||  // Backend error message
        err.message ||                   // Axios/JS error message
        'Failed to load movie'           // Fallback

      const statusCode = err.response?.status

      const userFriendlyError = statusCode === 404
        ? 'Movie not found. It may have been removed.'
        : statusCode === 400
        ? 'Invalid request. Please try again.'
        : statusCode >= 500
        ? 'Server error. Please try again later.'
        : errorMessage

      console.error('🔴 Error loading movie:', {
        status: statusCode,
        message: errorMessage,
        fullError: err,
      })

      setError(userFriendlyError)
    } finally {
      setLoading(false)
    }
  }

  const handleBookTickets = () => {
    if (movie && movie.id) {
      setBookingMovie(movie)
      navigate(`/theatres/${movie.id}`)
    } else {
      console.error('❌ Cannot book: missing movie data')
      setError('Movie data is incomplete. Please refresh the page.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading movie details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadMovie} />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-xl font-bold">
        Movie not found
      </div>
    )
  }

  const bannerUrl = `https://picsum.photos/seed/${movieId}banner/1920/600`
  const posterUrl = movie.posterUrl || `https://picsum.photos/seed/${movieId}/400/600`

  return (
    <div className="min-h-screen pb-20">
      {/* Banner Backdrop */}
      <div className="relative w-full h-[50vh] min-h-[380px] overflow-hidden">
        <img 
          src={bannerUrl} 
          alt="Movie Banner" 
          className="w-full h-full object-cover opacity-45 scale-105 filter blur-[1px]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d082b] via-[#0d082b]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d082b]/90 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="app-container relative -mt-40 px-4 md:px-8 z-10 flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Poster Wrapper */}
        <div className="w-56 md:w-68 lg:w-76 flex-shrink-0 mx-auto md:mx-0 p-3 card rounded-[32px] overflow-hidden shadow-2xl">
          <div className="aspect-[2/3] w-full relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
            <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Movie Info Details Panel */}
        <div className="flex-1 text-white flex flex-col pt-4 md:pt-16">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {movie.certification && (
              <span className="inline-flex items-center gap-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                {movie.certification}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              {movie.genre || 'Entertainment'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-balance uppercase">
            {movie.title}
          </h1>

          {/* Meta Information Row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-8 text-sm font-semibold text-slate-400">
            {movie.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-pink-500 text-pink-500" />
                <span className="text-base font-extrabold text-white">{movie.rating}/10</span>
                <span className="text-xs font-normal">({movie.reviewCount?.toLocaleString() || 'New ratings'})</span>
              </div>
            )}
            
            {movie.duration && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{movie.duration} min</span>
              </div>
            )}
            {movie.languages && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{Array.isArray(movie.languages) ? movie.languages.join(', ') : movie.languages || movie.language}</span>
              </div>
            )}
            {movie.releaseDate && (
              <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{new Date(movie.releaseDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>

          {/* About Section Glass Panel */}
          <div className="mb-10 max-w-3xl card p-6 md:p-8 rounded-[28px]">
            <h2 className="text-lg font-black uppercase tracking-wider mb-3 text-white">About the Movie</h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
              {movie.description || 'No description available for this movie.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-auto border-t border-white/10 pt-6">
            <button
              onClick={handleBookTickets}
              className="btn-primary py-3.5 px-8 text-sm"
            >
              Book Tickets
            </button>

            {movie.trailerUrl && (
              <button
                onClick={() => setShowTrailer(true)}
                className="btn-secondary py-3.5 px-8 text-sm"
              >
                <Play className="w-4 h-4 mr-1 text-pink-500 fill-pink-500" /> Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsPage