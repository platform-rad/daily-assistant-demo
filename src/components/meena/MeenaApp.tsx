import { useState, useRef } from 'react'
import { SideNavigation } from '../copilot/sidebar/SideNavigation'
import { Clock, Send, Upload } from 'lucide-react'

type ViewType = 'home' | 'history' | 'favorites' | 'active-actions'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function MeenaApp() {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
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

  return (
    <div className="flex h-full bg-slate-50 flex-col">
      <div className="flex flex-1 overflow-hidden">
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
          <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h1 className="text-xl font-bold text-slate-900">
              {currentView === 'home' && '🎙️ Meeting Notes'}
              {currentView === 'history' && 'Meeting History'}
              {currentView === 'favorites' && 'Saved Meetings'}
              {currentView === 'active-actions' && 'Action Items'}
            </h1>
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
      </div>
    </div>
  )
}
