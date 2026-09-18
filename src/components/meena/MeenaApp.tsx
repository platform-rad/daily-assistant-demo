import { useState, useRef } from 'react'
import { SideNavigation } from '../copilot/sidebar/SideNavigation'
import { Clock, Send, Upload, Menu, X, Star, Zap, Home as HomeIcon } from 'lucide-react'

type ViewType = 'home' | 'history' | 'favorites' | 'active-actions'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MeenaAppProps {
  /** true quand la fenêtre est collée (sticky) à droite de l'écran → layout compact */
  isDocked?: boolean
}

const NAV_ITEMS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Accueil', icon: <HomeIcon size={18} /> },
  { id: 'active-actions', label: 'Actions en cours', icon: <Zap size={18} /> },
  { id: 'history', label: 'Historique', icon: <Clock size={18} /> },
  { id: 'favorites', label: 'Favoris', icon: <Star size={18} /> },
]

export function MeenaApp({ isDocked = false }: MeenaAppProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Bonjour! Je suis votre assistant Meena. Vous pouvez me poser des questions sur vos notes de réunion et je vous aiderai à les analyser et à les synchroniser avec CRM+.',
      timestamp: new Date(),
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'J\'ai analysé votre demande sur les notes de réunion. Vous pouvez continuer à discuter ou cliquer sur "Envoyer à CRM+" pour synchroniser vos notes.',
        timestamp: new Date(),
      }
      setChatMessages(prev => [...prev, assistantMessage])
    }, 500)
  }

  const viewTitle = {
    home: '🎙️ Meeting Notes',
    history: 'Meeting History',
    favorites: 'Saved Meetings',
    'active-actions': 'Action Items',
  }[currentView]

  return (
    <div className="flex h-full bg-slate-50 flex-col min-w-0">
      <div className="flex flex-1 overflow-hidden min-w-0">
        {/* Sidebar classique (fenêtre détachée / large) OU burger menu (fenêtre sticky à droite) */}
        {isDocked ? (
          <div className="w-full flex flex-col min-w-0">
            {/* Top bar avec burger menu */}
            <div className="border-b border-slate-200 bg-white px-3 py-2.5 flex items-center gap-2 flex-shrink-0 relative">
              <button
                onClick={() => setBurgerMenuOpen(!burgerMenuOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition flex-shrink-0"
                title="Menu"
              >
                {burgerMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <h1 className="text-sm font-bold text-slate-900 truncate flex-1">{viewTitle}</h1>

              {/* Dropdown menu */}
              {burgerMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 mx-2 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <nav className="p-1.5 space-y-1">
                    {NAV_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentView(item.id)
                          setBurgerMenuOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-left ${
                          currentView === item.id ? 'text-white' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        style={currentView === item.id ? { background: '#d97706' } : {}}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            {/* Content Area (compact) */}
            <div className="flex-1 overflow-y-auto p-3 min-w-0">
              {currentView === 'home' && (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-base">🎙️</span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-slate-900 truncate">Start Recording</h2>
                        <p className="text-xs text-slate-600 truncate">Record & sync to CRM+</p>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition">
                      Start Recording
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-xl font-bold text-slate-900">0</div>
                      <p className="text-xs text-slate-600 mt-0.5">Meetings</p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3">
                      <div className="text-xl font-bold text-slate-900">0</div>
                      <p className="text-xs text-slate-600 mt-0.5">Actions</p>
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'history' && (
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <Clock size={24} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600">No past meetings yet</p>
                </div>
              )}

              {currentView === 'favorites' && (
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <p className="text-xs text-slate-600">No saved meetings yet</p>
                </div>
              )}

              {currentView === 'active-actions' && (
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <p className="text-xs text-slate-600">No action items yet</p>
                </div>
              )}
            </div>

            {/* Chat Section at Bottom */}
            <div className="border-t border-slate-200 bg-white flex flex-col flex-shrink-0 max-h-56">
              <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs ${
                        msg.role === 'user' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-slate-200 px-2.5 py-2.5 space-y-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Question sur vos notes..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-200 bg-white focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-50 rounded transition"
                  >
                    <Send size={13} className="text-amber-600" />
                  </button>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white transition">
                  <Upload size={13} />
                  Envoyer à CRM+
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Sidebar classique (fenêtre détachée, largeur confortable) */}
            <SideNavigation
              isOpen={sidebarOpen}
              currentView={currentView}
              onViewChange={setCurrentView}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* Header */}
              <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                <h1 className="text-xl font-bold text-slate-900 truncate">{viewTitle}</h1>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {currentView === 'home' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                          <span className="text-xl">🎙️</span>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">Start Recording Meeting</h2>
                          <p className="text-sm text-slate-600">Record, transcribe, and sync to CRM+</p>
                        </div>
                      </div>
                      <button className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition">
                        Start Recording
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <div className="text-3xl font-bold text-slate-900">0</div>
                        <p className="text-sm text-slate-600 mt-1">Meetings Today</p>
                      </div>
                      <div className="bg-white rounded-lg border border-slate-200 p-4">
                        <div className="text-3xl font-bold text-slate-900">0</div>
                        <p className="text-sm text-slate-600 mt-1">Pending Actions</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentView === 'history' && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                    <Clock size={32} className="text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No past meetings yet</p>
                  </div>
                )}

                {currentView === 'favorites' && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                    <p className="text-slate-600">No saved meetings yet</p>
                  </div>
                )}

                {currentView === 'active-actions' && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                    <p className="text-slate-600">No action items yet</p>
                  </div>
                )}
              </div>

              {/* Chat Section at Bottom */}
              <div className="border-t border-slate-200 bg-white flex flex-col flex-shrink-0 max-h-64">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs rounded-lg px-3 py-2 text-xs ${
                          msg.role === 'user'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input & Actions */}
                <div className="border-t border-slate-200 px-3 py-3 space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Posez une question sur vos notes..."
                        className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 bg-white focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-50 rounded transition"
                      >
                        <Send size={14} className="text-amber-600" />
                      </button>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white transition">
                    <Upload size={14} />
                    Envoyer à CRM+
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
