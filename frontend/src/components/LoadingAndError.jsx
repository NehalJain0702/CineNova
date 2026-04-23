import { Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react'

// 🔄 Loading
export function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-rose-500`} />
      {text && <p className="text-slate-400 font-medium">{text}</p>}
    </div>
  )
}

// 🧱 Skeleton
export function SkeletonCard() {
  return (
    <div className="card overflow-hidden flex flex-col h-full animate-pulse border-slate-800 bg-slate-900/50">
      <div className="w-full h-80 bg-slate-800" />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="h-6 bg-slate-800 rounded-md w-3/4" />
        <div className="h-4 bg-slate-800 rounded-md w-1/2" />
        <div className="h-4 bg-slate-800 rounded-md w-1/3 mt-2" />
        <div className="h-10 bg-slate-800 rounded-xl w-full mt-auto" />
      </div>
    </div>
  )
}

// ❌ Error
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 card border-red-900/30 bg-red-950/10 max-w-lg mx-auto">
      <AlertCircle className="w-12 h-12 text-rose-500" />
      <p className="text-slate-300 text-center font-medium">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary mt-2"
        >
          Retry
        </button>
      )}
    </div>
  )
}

// ✅ Success
export function SuccessMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 card border-green-900/30 bg-green-950/10">
      <CheckCircle className="w-12 h-12 text-emerald-500" />
      <p className="text-slate-300 text-center font-medium">{message}</p>
    </div>
  )
}

// ℹ️ Info
export function InfoMessage({ message }) {
  return (
    <div className="flex gap-3 p-4 bg-blue-950/30 border border-blue-900/50 rounded-xl items-center">
      <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
      <p className="text-blue-200 text-sm font-medium">{message}</p>
    </div>
  )
}