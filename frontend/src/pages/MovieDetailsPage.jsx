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
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><LoadingSpinner size="lg" text="Loading movie details..." /></div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><ErrorMessage message={error} onRetry={loadMovie} /></div>
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xl font-medium">Movie not found</div>
  }

  const bannerUrl = `https://picsum.photos/seed/${movieId}banner/1920/600`
  const posterUrl = movie.posterUrl || `https://picsum.photos/seed/${movieId}/400/600`

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[500px]">
        {/* Banner Image */}
        <div className="absolute inset-0">
          <img src={bannerUrl} alt="Movie Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 dark:from-slate-950 dark:via-slate-950/80 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 dark:from-slate-950 via-slate-50/60 dark:via-slate-950/60 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0">
          <div className="app-container h-full flex flex-col md:flex-row items-center md:items-end pb-12 gap-8 px-4 md:px-8">
            
            {/* Poster (Hidden on very small screens, shown as glass card on larger) */}
            <div className="hidden md:block w-64 lg:w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 transform translate-y-16 group">
              <div className="relative aspect-[2/3] bg-slate-800">
                <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Movie Info Details */}
            <div className="flex-1 w-full mt-24 md:mt-0 text-slate-900 dark:text-white z-10 flex flex-col justify-end">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {movie.certification && (
                  <span className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest text-slate-800 dark:text-slate-200 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                    {movie.certification}
                  </span>
                )}
                <span className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm">
                  <Tag className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  {movie.genre || 'Entertainment'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-balance drop-shadow-lg">
                {movie.title}
              </h1>

              {/* Meta Grid */}
              <div className="flex flex-wrap items-center gap-6 mb-8 bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md p-4 rounded-2xl max-w-3xl shadow-lg">
                {movie.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400 drop-shadow-md" />
                    <div>
                      <div className="font-bold text-lg leading-none text-slate-900 dark:text-white">{movie.rating}/10</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">{movie.reviewCount?.toLocaleString() || 'New'} Ratings</div>
                    </div>
                  </div>
                )}
                
                <div className="w-px h-10 bg-slate-300 dark:bg-slate-700 hidden sm:block"></div>

                <div className="flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {movie.duration && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Clock className="w-4 h-4" /> Duration</div>
                      <div className="text-slate-900 dark:text-white text-base">{movie.duration} min</div>
                    </div>
                  )}
                  {movie.languages && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Globe className="w-4 h-4" /> Language</div>
                      <div className="text-slate-900 dark:text-white text-base">{Array.isArray(movie.languages) ? movie.languages.join(', ') : movie.languages || movie.language}</div>
                    </div>
                  )}
                  {movie.releaseDate && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Calendar className="w-4 h-4" /> Release</div>
                      <div className="text-slate-900 dark:text-white text-base">{new Date(movie.releaseDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleBookTickets}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-rose-600/30 transform hover:-translate-y-1 transition-all duration-300 text-lg border border-rose-500/50"
                >
                  Book Tickets
                </button>

                {movie.trailerUrl && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700 backdrop-blur-md text-slate-900 dark:text-white font-semibold py-4 px-8 rounded-xl flex items-center gap-3 transition-all duration-300 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <Play className="w-5 h-5 fill-slate-900 dark:fill-white" /> Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="app-container mt-20 md:mt-32 px-4 md:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-rose-600 rounded-full"></div>
            About the Movie
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed bg-white/60 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            {movie.description || 'No description available for this movie.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailsPage