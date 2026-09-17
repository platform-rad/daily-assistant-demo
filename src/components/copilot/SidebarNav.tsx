import { useState } from 'react'
import { Menu, X, Plus, Home, Clock, Star, Zap, Pin, PinOff } from 'lucide-react'

export type NavView = 'home' | 'active-actions' | 'history' | 'favorites'

interface NavItem {
  id: NavView
  label: string
  icon: React.ReactNode
}

interface SidebarNavProps {
  currentView: NavView
  onViewChange: (view: NavView) => void
}

export function SidebarNav({ currentView, onViewChange }: SidebarNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pinnedTabs, setPinnedTabs] = useState<NavView[]>(['home'])

  const navItems: NavItem[] = [
    { id: 'home', label: 'Accueil', icon: <Home size={18} /> },
    { id: 'active-actions', label: 'Actions en cours', icon: <Zap size={18} /> },
    { id: 'history', label: 'Historique', icon: <Clock size={18} /> },
    { id: 'favorites', label: 'Prompts Favoris', icon: <Star size={18} /> },
  ]

  const togglePin = (id: NavView) => {
    setPinnedTabs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col border-b border-slate-200">
      {/* Top Bar: Burger Menu + Nouveau Button */}
      <div className="px-3 py-3 flex items-center gap-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          title="Menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white font-medium transition hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}>
          <Plus size={16} />
          <span className="text-sm">Nouveau</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-slate-50">
          <nav className="px-2 py-2 space-y-1">
            {navItems.map((item) => (
              <div key={item.id} className="group">
                <button
                  onClick={() => {
                    onViewChange(item.id)
                    setMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    currentView === item.id
                      ? 'text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  style={
                    currentView === item.id
                      ? { background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }
                      : {}
                  }
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                </button>

                {/* Pin Button (appears on hover) */}
                <button
                  onClick={() => togglePin(item.id)}
                  className="absolute right-3 p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-slate-200 rounded"
                  title={pinnedTabs.includes(item.id) ? 'Dépingler' : 'Épingler'}
                >
                  {pinnedTabs.includes(item.id) ? (
                    <PinOff size={14} className="text-red-500" />
                  ) : (
                    <Pin size={14} className="text-slate-400" />
                  )}
                </button>
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Pinned Tabs */}
      {pinnedTabs.length > 0 && (
        <div className="px-2 py-2 border-t border-slate-200 flex gap-1 overflow-x-auto">
          {pinnedTabs.map((tabId) => {
            const item = navItems.find((n) => n.id === tabId)
            if (!item) return null

            return (
              <button
                key={tabId}
                onClick={() => onViewChange(tabId)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition flex-shrink-0 ${
                  currentView === tabId
                    ? 'text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                style={
                  currentView === tabId
                    ? { background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }
                    : {}
                }
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
