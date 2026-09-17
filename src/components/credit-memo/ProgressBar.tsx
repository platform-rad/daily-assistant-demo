interface ProgressBarProps {
  completed: number
  total: number
  progress: number
}

export function ProgressBar({ completed, total, progress }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-700">
          {completed} / {total} sections complétées
        </span>
        <span className="text-xs font-medium text-slate-600">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
