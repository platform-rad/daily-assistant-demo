import { Home, Clock, Star, Menu, Plus, Zap, Pin, MessageSquare, Settings } from 'lucide-react'

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

  const pinnedConversations = [
    { id: 1, title: 'TechCorp Q3 Review', date: '2j' },
    { id: 2, title: 'Portfolio Rebalancing', date: '5j' },
  ]

  const recentConversations = [
    { id: 1, title: 'Manufacturing Risk...', date: 'Auj' },
    { id: 2, title: 'Facility Covenant...', date: 'Hier' },
    { id: 3, title: 'Pipeline Forecast', date: '2j' },
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}>
              🤖
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Métier BNP</p>
            </div>
          </div>
        </div>

        {/* Create Action Button */}
        <div className="p-4 border-b border-slate-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}>
            <Plus size={18} />
            <span>Nouveau</span>
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
                onClick={() => onViewChange(item.id)}
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

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto">
          {/* Pinned Conversations */}
          <div className="px-3 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Pin size={16} className="text-orange-600" />
              <span className="text-xs font-bold text-slate-700 uppercase">Épinglées</span>
            </div>
            <div className="space-y-2">
              {pinnedConversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent transition"
                >
                  <p className="text-xs font-medium text-slate-900 truncate">{conv.title}</p>
                  <p className="text-2xs text-slate-500">{conv.date}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="px-3 py-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={16} className="text-slate-600" />
              <span className="text-xs font-bold text-slate-700 uppercase">Récentes</span>
            </div>
            <div className="space-y-2">
              {recentConversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 border border-transparent transition"
                >
                  <p className="text-xs font-medium text-slate-900 truncate">{conv.title}</p>
                  <p className="text-2xs text-slate-500">{conv.date}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Footer */}
        <div className="border-t border-slate-200 px-3 py-4 bg-white">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition">
            <Settings size={18} />
            <span className="text-sm font-medium">Paramètres</span>
          </button>
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
