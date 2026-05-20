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
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const categories = ['All', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller', 'Adventure']

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
      
      const matchesSearch = movie.title?.toLowerCase().includes(searchQuery)
      const matchesCategory = selectedCategory === 'All' || 
        movie.genre?.toLowerCase().includes(selectedCategory.toLowerCase())

      return matchesSearch && matchesCategory
    })

  const handleBook = (id) => {
    if (!id || id === 'undefined' || id === 'null') {
      console.error('Invalid movie ID:', id)
      return
    }
    navigate(`/movies/${id}`)
  }

  if (error) {
    return (
      <div className="app-container page min-h-[70vh] flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchMovies} />
      </div>
    )
  }

  return (
    <div className="app-container page py-12">
      {/* Header and Title */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-3">
          Choose Movie
        </h1>
        <p className="text-sm font-semibold text-slate-400 tracking-wider">
          Find the best cinematic experiences showing today
        </p>
      </div>

      {/* Categories Horizontal Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 justify-start sm:justify-center scrollbar-none">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white border-transparent shadow-lg shadow-pink-500/20 scale-105'
                : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
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
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
          <p className="text-lg text-slate-400 font-bold">No movies found in this category</p>
        </div>
      )}
    </div>
  )
}

export default HomePage