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
      className="card card-hover p-3 overflow-hidden group cursor-pointer flex flex-col h-full bg-white/5 border border-white/10 backdrop-blur-md hover:border-pink-500/30 rounded-[28px]"
      onClick={() => {
        if (onBook && id) {
          onBook(id)
        }
      }}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900 rounded-2xl">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute bottom-2 left-2 bg-[#0c082b]/80 backdrop-blur-md text-white px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md border border-white/5">
            <Star className="w-3 h-3 fill-pink-500 text-pink-500" />
            <span>{movie.rating}</span>
          </div>
        )}

        {/* Certification Badge */}
        {movie.certification && (
          <div className="absolute top-2 right-2 bg-pink-500/80 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[9px] font-extrabold tracking-wider shadow-sm uppercase border border-white/10">
            {movie.certification}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 flex-1 flex flex-col justify-between pt-4">
        <div>
          <h3 className="font-extrabold text-sm leading-tight text-white group-hover:text-pink-400 transition-colors duration-200 line-clamp-1 mb-1" title={movie.title}>
            {movie.title}
          </h3>
          
          {/* Genre */}
          {movie.genre && (
            <p className="text-[11px] font-medium text-slate-400 truncate mb-3">{movie.genre}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          {movie.language && (
            <span className="text-[9px] uppercase font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-md">
              {movie.language}
            </span>
          )}
          
          {movie.duration && (
            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {movie.duration}m
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
