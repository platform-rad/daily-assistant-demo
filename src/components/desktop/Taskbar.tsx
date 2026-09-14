
interface TaskbarApp {
  id: string
  label: string
  icon: React.ReactNode
  isActive: boolean
  isMinimized: boolean
}

interface TaskbarProps {
  apps: TaskbarApp[]
  onAppClick: (appId: string) => void
  currentTime: string
}

export function Taskbar({ apps, onAppClick, currentTime }: TaskbarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 flex items-center px-2 gap-1 z-50">
      {/* Start Menu (simulation) */}
      <button className="px-3 py-2 hover:bg-gray-700 rounded text-white text-sm font-semibold transition">
        ⊞
      </button>

      {/* Taskbar Apps */}
      <div className="flex gap-1 flex-1 ml-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppClick(app.id)}
            className={`px-3 py-1 rounded flex items-center gap-2 text-white text-xs transition ${
              app.isActive && !app.isMinimized
                ? 'bg-blue-600 border-t-2 border-blue-400'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title={app.label}
          >
            {app.icon}
            <span className="hidden sm:inline">{app.label}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 text-white text-xs">
        <div className="flex items-center gap-2">
          <span>🔊</span>
          <span>🔌</span>
          <span>📶</span>
        </div>
        <div className="text-gray-300">{currentTime}</div>
      </div>
    </div>
  )
}
