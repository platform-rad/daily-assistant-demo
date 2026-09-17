import { useState } from 'react'
import { SideNavigation } from './sidebar/SideNavigation'
import { HomePage } from './pages/HomePage'
import { HistoryPage } from './pages/HistoryPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { ActiveActionsPage } from './pages/ActiveActionsPage'

type ViewType = 'home' | 'history' | 'favorites' | 'active-actions'

interface StandaloneViewProps {
  onSelectPrompt?: (prompt: string) => void
  onCreateCreditMemo?: () => void
}

export function StandaloneView({ onSelectPrompt, onCreateCreditMemo }: StandaloneViewProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar */}
      <SideNavigation
        isOpen={sidebarOpen}
        currentView={currentView}
        onViewChange={setCurrentView}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            {currentView === 'home' && 'Accueil'}
            {currentView === 'history' && 'Historique'}
            {currentView === 'favorites' && 'Prompts Favoris'}
            {currentView === 'active-actions' && 'Actions en Cours'}
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'home' && <HomePage onSelectPrompt={onSelectPrompt} onCreateCreditMemo={onCreateCreditMemo} />}
          {currentView === 'history' && <HistoryPage />}
          {currentView === 'favorites' && <FavoritesPage onSelectPrompt={onSelectPrompt} />}
          {currentView === 'active-actions' && <ActiveActionsPage />}
        </div>
      </div>
    </div>
  )
}
