import { useState, useRef, useEffect } from 'react'
import { Mic, CheckCircle2, Upload, FileAudio, Send, Clock } from 'lucide-react'

interface CrmAgentPageProps {
  onOpenMeena?: () => void
  isCompact?: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const FEATURES = [
  { icon: <FileAudio size={14} />, text: 'Enregistrement vocal de la réunion' },
  { icon: <CheckCircle2 size={14} />, text: 'Transcription et extraction des actions' },
  { icon: <Upload size={14} />, text: 'Synchronisation automatique avec CRM+' },
]

const RECENT_TOPICS = [
  { client: 'AeroDynamics Group', subject: 'Call CFO — refinancement 2027', date: '18 août 2026', status: 'Synchronisé' as const },
  { client: 'TechCorp France', subject: 'Point mensuel commercial', date: '12 août 2026', status: 'Synchronisé' as const },
  { client: 'Manufacturing Ltd', subject: 'Suivi covenant Q2', date: '5 août 2026', status: 'Brouillon' as const },
]

/** Page dédiée dans le sidepanel assistant — lance l'agent Meena (notes de réunion). */
export function CrmAgentPage({ onOpenMeena, isCompact = true }: CrmAgentPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const titleSize = isCompact ? 'text-sm font-bold' : 'text-lg font-bold'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const question = input.trim()
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: question }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Je peux préparer une nouvelle note de réunion à ce sujet ("${question}"). Cliquez sur "Ouvrir Meena" pour démarrer l'enregistrement vocal.`,
        },
      ])
    }, 500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={`flex-1 overflow-y-auto ${isCompact ? 'px-3 py-3' : 'px-4 py-5'} space-y-4`}>
        <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50/60 to-transparent p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Mic size={16} className="text-amber-600" />
            </div>
            <div>
              <h2 className={`${titleSize} text-slate-900`}>CRM+ Agent · Meena</h2>
            </div>
          </div>
          <p className="text-2xs text-slate-600 leading-relaxed">
            Rédigez vos notes de réunion à la voix : Meena transcrit, extrait les actions et
            synchronise le tout avec CRM+ automatiquement.
          </p>
        </div>

        <div className="space-y-1.5">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-amber-600 flex-shrink-0">{f.icon}</span>
              <span className="text-2xs text-slate-700">{f.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onOpenMeena?.()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition"
        >
          <Mic size={16} />
          Ouvrir Meena
        </button>

        {/* Derniers sujets traités */}
        <div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Derniers sujets traités</p>
          <div className="space-y-1.5">
            {RECENT_TOPICS.map((topic, i) => (
              <button
                key={i}
                onClick={() => onOpenMeena?.()}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-2xs font-semibold text-slate-900 truncate">{topic.client}</p>
                  <p className="text-2xs text-slate-500 truncate">{topic.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`text-2xs px-1.5 py-0.5 rounded font-medium ${
                      topic.status === 'Synchronisé' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {topic.status}
                  </span>
                  <span className="text-2xs text-slate-400 flex items-center gap-0.5">
                    <Clock size={10} />
                    {topic.date}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fil de la nouvelle conversation */}
        {messages.length > 0 && (
          <div className="space-y-1.5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-2xs leading-snug ${
                    msg.role === 'user' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Démarrer une nouvelle conversation pour ce sujet */}
      <div className={`border-t border-slate-200 bg-white ${isCompact ? 'p-2' : 'p-3'} flex-shrink-0`}>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Démarrer une nouvelle conversation sur CRM+..."
            className="w-full h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-2xs focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            onClick={handleSend}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-50 rounded transition"
          >
            <Send size={14} className="text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
