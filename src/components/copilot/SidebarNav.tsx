import { useState } from 'react'
import { Menu, X, Home, Clock, Star, Zap, Pin, PinOff, Mic, ClipboardList } from 'lucide-react'

export type NavView = 'home' | 'crm-agent' | 'cap-cbs' | 'active-actions' | 'history' | 'favorites'

interface NavItem {
  id: NavView
  label: string
  icon: React.ReactNode
}

interface SidebarNavProps {
  currentView: NavView
  onViewChange: (view: NavView) => void
}

// Historique a sa propre icône dédiée dans la barre du haut (accès direct) —
// il n'a donc pas besoin d'apparaître aussi dans la liste épinglable.
const PINNABLE_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home size={18} /> },
  { id: 'crm-agent', label: 'CRM+ Agent', icon: <Mic size={18} /> },
  { id: 'cap-cbs', label: 'CAP / CBS', icon: <ClipboardList size={18} /> },
  { id: 'active-actions', label: 'Active Actions', icon: <Zap size={18} /> },
  { id: 'favorites', label: 'Favorite Prompts', icon: <Star size={18} /> },
]

export function SidebarNav({ currentView, onViewChange }: SidebarNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pinnedTabs, setPinnedTabs] = useState<NavView[]>(['home', 'crm-agent', 'cap-cbs'])

  const togglePin = (id: NavView) => {
    setPinnedTabs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col">
      {/* Barre unique : burger + onglets épinglés + accès direct à l'historique — même marine que la nav de gauche */}
      <div className="px-3 py-2.5 flex items-center gap-1.5 bg-rad-navy">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition flex-shrink-0 text-slate-300"
          title="Menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
          {pinnedTabs.map((tabId) => {
            const item = PINNABLE_ITEMS.find((n) => n.id === tabId)
            if (!item) return null
            const isActive = currentView === tabId
            return (
              <button
                key={tabId}
                onClick={() => onViewChange(tabId)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition flex-shrink-0 ${
                  isActive ? 'bg-rad-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onViewChange('history')}
          className={`p-2 rounded-lg transition flex-shrink-0 ${
            currentView === 'history' ? 'bg-rad-indigo-600 text-white' : 'hover:bg-white/10 text-slate-300'
          }`}
          title="Conversation history"
        >
          <Clock size={18} />
        </button>
      </div>

      {/* Menu déroulant : liste complète + gestion des épinglés */}
      {menuOpen && (
        <div className="bg-rad-navy border-t border-white/10">
          <nav className="px-2 py-2 space-y-1">
            {PINNABLE_ITEMS.map((item) => (
              <div key={item.id} className="group flex items-center">
                <button
                  onClick={() => {
                    onViewChange(item.id)
                    setMenuOpen(false)
                  }}
                  className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                    currentView === item.id ? 'bg-rad-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>

                {/* Pin Button - Always visible, at right */}
                <button
                  onClick={() => togglePin(item.id)}
                  className="p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-white/10 rounded flex-shrink-0"
                  title={pinnedTabs.includes(item.id) ? 'Unpin' : 'Pin'}
                >
                  {pinnedTabs.includes(item.id) ? (
                    <PinOff size={14} className="text-rad-indigo-300" />
                  ) : (
                    <Pin size={14} className="text-slate-400" />
                  )}
                </button>
              </div>
            ))}

            {/* Historique : accès direct via l'icône, mais listé ici pour rester découvrable */}
            <button
              onClick={() => {
                onViewChange('history')
                setMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                currentView === 'history' ? 'bg-rad-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Clock size={18} className="flex-shrink-0" />
              <span className="text-sm font-medium">History</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
