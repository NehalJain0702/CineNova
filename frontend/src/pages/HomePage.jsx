import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { SkeletonCard, ErrorMessage } from '../components/LoadingAndError'
import { movieService } from '../services/apiService'
import { Film } from 'lucide-react'

// Helper function to safely get a movie ID
const getMovieId = (movie, index) => {
  if (movie?.id && movie.id !== 'undefined' && movie.id !== 'null') {
    return movie.id
  }
  // Fallback: use array index or title-based ID
  console.warn('Movie missing valid ID, using fallback:', movie?.title)
  return null
}
function HomePage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const data = await movieService.getAll()
      console.log('Fetched movies:', data) // Debug log
      setMovies(data || [])
    } catch (err) {
      console.error('Movies fetch error:', err) // Debug log
      setError('Failed to load movies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const searchQuery = searchParams.get('search')?.toLowerCase() || ''

  const filteredMovies = movies
    .filter(movie => {
      if (!movie.id || movie.id === 'undefined' || movie.id === 'null') {
        console.warn('Skipping movie without valid ID:', movie)
        return false
      }
      return movie.title?.toLowerCase().includes(searchQuery)
    })

  const handleBook = (id) => {
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid movie ID:', id)
      return
    }
    navigate(`/movies/${id}`)
  }

  if (error) {
    return <div className="app-container page min-h-[70vh] flex items-center justify-center"><ErrorMessage message={error} onRetry={fetchMovies} /></div>
  }

  return (
    <div className="app-container page">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-rose-600/20 rounded-xl">
          <Film className="w-8 h-8 text-rose-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">Recommended Movies</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 transition-colors duration-300">Discover the latest blockbusters and indie gems.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie, index) => {
            const movieId = getMovieId(movie)
            return (
              <MovieCard 
                key={movieId || index} 
                movie={movie} 
                movieId={movieId}
                onBook={handleBook} 
              />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/60 dark:bg-slate-900/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition-colors duration-300 shadow-sm">
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">No movies found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}

export default HomePage