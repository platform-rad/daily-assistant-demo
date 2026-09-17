import { Home, Clock, Star, Menu, Plus, Zap } from 'lucide-react'

interface SideNavigationProps {
  isOpen: boolean
  currentView: string
  onViewChange: (view: any) => void
  onToggleSidebar: () => void
}

export function SideNavigation({ isOpen, currentView, onViewChange, onToggleSidebar }: SideNavigationProps) {
  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'active-actions', label: 'Actions en cours', icon: Zap },
    { id: 'history', label: 'Historique', icon: Clock },
    { id: 'favorites', label: 'Prompts Favoris', icon: Star },
  ]

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo & Brand */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">Daily Assistant</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Copilot Métier BNP</p>
        </div>

        {/* Create Action Button */}
        <div className="p-4 border-b border-slate-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:from-orange-600 hover:to-orange-700 transition">
            <Plus size={18} />
            <span>Nouvelle Action</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                  isActive
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className="text-xs text-slate-500 space-y-1">
            <p>💡 Conseil du jour:</p>
            <p>"Utilisez les prompts favoris pour accélérer vos analyses"</p>
          </div>
        </div>
      </div>

      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={onToggleSidebar}
          className="w-16 border-r border-slate-200 bg-white hover:bg-slate-50 transition flex items-center justify-center"
          title="Ouvrir le menu"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
      )}
    </>
  )
}
