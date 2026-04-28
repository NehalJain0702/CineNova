import React from 'react'
import { Star, Clock, Globe, AlertCircle } from 'lucide-react'

function MovieCard({ movie, movieId, onBook }) {
  if (!movie) return null

  // Use provided movieId or fall back to movie.id
  const id = movieId || movie.id
  
  const handleBook = (e) => {
    e.stopPropagation();
    console.log('MovieCard - handleBook clicked, id:', id) // Debug log
    if (onBook && id) {
      onBook(id)
    } else {
      console.error('Cannot book: id is missing', { id, movie }) // Debug log
    }
  }

  // Use specific requested posters or a fallback
  let posterUrl = movie.posterUrl || `https://picsum.photos/seed/${movie.id}/400/600`
  const title = movie.title?.toLowerCase() || ''
  
  // Apply requested Avengers and Pushpa posters with working URLs
  if (title.includes('avenger') || title.includes('endgame')) {
    posterUrl = 'https://s.yimg.com/fz/api/res/1.2/6DECN186p0luSH9dNV5u0A--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpbGw7aD00MTI7cHhvZmY9NTA7cHlvZmY9MTAwO3E9ODA7c3M9MTt3PTM4OA--/https://i.pinimg.com/736x/21/d6/21/21d62106e83e8bddfa41024dfc195356.jpg'
  } else if (title.includes('pushpa')) {
    posterUrl = 'https://tse2.mm.bing.net/th/id/OIP.2hUAQZT-9mSGs-7Q_f4izwHaJQ?pid=Api&P=0&h=180'
  }

  return (
    <div 
      className="card card-hover overflow-hidden group cursor-pointer flex flex-col h-full"
      onClick={() => {
        if (onBook && id) {
          console.log('MovieCard div clicked - navigating with ID:', id)
          onBook(id)
        } else {
          console.warn('MovieCard div clicked but id missing:', { id, movie })
        }
      }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-200 dark:bg-slate-800 transition-colors">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 dark:from-slate-950 dark:via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Top Badges */}
        {movie.certification && (
          <div className="absolute top-3 right-3 bg-rose-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold tracking-wider shadow-lg">
            {movie.certification}
          </div>
        )}

        {/* Hover Book Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
          <button
            onClick={handleBook}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 px-6 rounded-xl shadow-2xl shadow-rose-600/50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            Book Tickets
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col z-10">
        <h3 className="font-bold text-lg leading-tight mb-2 text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300 line-clamp-1" title={movie.title}>
          {movie.title}
        </h3>

        {/* Rating */}
        {movie.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{movie.rating}/10</span>
            {movie.reviewCount && (
              <span className="text-xs text-slate-500 font-medium">({movie.reviewCount.toLocaleString()} votes)</span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-auto">
          {movie.duration && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md transition-colors">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{movie.duration}m</span>
            </div>
          )}
          {(movie.language || (movie.languages && movie.languages[0])) && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md transition-colors">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{movie.language || movie.languages?.[0]}</span>
            </div>
          )}
        </div>

        {/* Genre */}
        {movie.genre && (
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-500 truncate">{movie.genre}</p>
          </div>
        )}

        {/* Mobile Book Button (visible only on small screens or when not hovering) */}
        <button
          onClick={handleBook}
          className="btn-primary w-full mt-auto sm:hidden group-hover:hidden"
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

export default MovieCard
