import { useState } from 'react'
import { Home, Clock, Star, Zap, Settings, ChevronRight, Brain } from 'lucide-react'
import { HomePage } from './pages/HomePage'
import { HistoryPage } from './pages/HistoryPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ActiveActionsPage } from './pages/ActiveActionsPage'

type ViewType = 'home' | 'history' | 'favorites' | 'active-actions'

interface CopilotSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  onSelectPrompt?: (prompt: string) => void
}

export function CopilotSidebar({ isCollapsed, onToggleCollapse, onSelectPrompt }: CopilotSidebarProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home')

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'active-actions', label: 'Actions en cours', icon: Zap },
    { id: 'history', label: 'Historique', icon: Clock },
    { id: 'favorites', label: 'Prompts Favoris', icon: Star },
  ]

  if (isCollapsed) {
    return null
  }

  return (
    <div className="w-80 border-l border-slate-200 bg-white flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}>
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">Copilot</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-100 rounded transition"
          title="Réduire"
        >
          <ChevronRight size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Create Action Button */}
      <div className="px-4 py-3 border-b border-slate-200">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}>
          <span>+ Nouveau</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 py-4 space-y-1 border-b border-slate-200">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                isActive
                  ? 'text-white border border-purple-300'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' } : {}}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Pages Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'home' && <HomePage onSelectPrompt={onSelectPrompt} />}
        {currentView === 'history' && <HistoryPage />}
        {currentView === 'favorites' && <FavoritesPage onSelectPrompt={onSelectPrompt} />}
        {currentView === 'active-actions' && <ActiveActionsPage />}
      </div>

      {/* Settings Footer */}
      <div className="border-t border-slate-200 px-3 py-4 bg-white">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition">
          <Settings size={18} />
          <span className="text-sm font-medium">Paramètres</span>
        </button>
      </div>
    </div>
  )
}
