import { useState, useRef, useEffect } from 'react'
import { ClipboardList, Target, TrendingUp, ShieldCheck, Leaf, Network, Send, Sparkles } from 'lucide-react'
import type { HostRoute } from '@/data/types'

interface CapCbsAgentPageProps {
  onNavigate?: (route: HostRoute) => void
  onOpenMyClientDev?: (route?: HostRoute) => void
  isCompact?: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const AXES = [
  { icon: <Target size={13} />, label: 'Contexte' },
  { icon: <TrendingUp size={13} />, label: 'Revenus historiques & prévisions' },
  { icon: <ShieldCheck size={13} />, label: 'RWA / Profitabilité' },
  { icon: <Leaf size={13} />, label: 'ESG' },
  { icon: <Network size={13} />, label: 'Angle IB/TB/GM — opportunités & connectivité' },
]

const RECENT_DOSSIERS = [
  { client: 'AeroDynamics Group', status: 'Draft' as const, updated: true, note: 'Axe ESG modifié il y a 2h' },
  { client: 'TechCorp France', status: 'Validated' as const, updated: false, note: 'Validé le 2 sept. 2026' },
  { client: 'Manufacturing Ltd', status: 'Draft' as const, updated: true, note: 'Nouvelle contribution région EMEA' },
]

/** Page dédiée dans le sidepanel assistant — ouvre le plan de travail CAP/CBS. */
export function CapCbsAgentPage({ onNavigate, onOpenMyClientDev, isCompact = true }: CapCbsAgentPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const titleSize = isCompact ? 'text-sm font-bold' : 'text-lg font-bold'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleOpen = () => {
    if (onNavigate) onNavigate('cap-cbs')
    else onOpenMyClientDev?.('cap-cbs')
  }

  const handleOpenDossier = () => {
    if (onNavigate) onNavigate('cap-cbs-detail')
    else onOpenMyClientDev?.('cap-cbs-detail')
  }

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
          content: `Je peux creuser ce point sur le CBS/CAP ("${question}"). Ouvrez le dossier pour éditer directement les axes concernés.`,
        },
      ])
    }, 500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={`flex-1 overflow-y-auto ${isCompact ? 'px-3 py-3' : 'px-4 py-5'} space-y-4`}>
        <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50/60 to-transparent p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <ClipboardList size={16} className="text-purple-600" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className={`${titleSize} text-slate-900`}>CAP / CBS</h2>
              <span className="text-2xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">Draft</span>
            </div>
          </div>
          <p className="text-2xs text-slate-600 leading-relaxed">
            Le CBS consolide la vision client, l'ambition commerciale, les trajectoires de revenus
            et de rentabilité, les opportunités prioritaires et l'intensité relationnelle. Le CAP
            traduit cette stratégie en actions, contributions et suivis.
          </p>
        </div>

        <div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Les 5 axes du CBS</p>
          <div className="space-y-1.5">
            {AXES.map((axis, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-purple-600 flex-shrink-0">{axis.icon}</span>
                <span className="text-2xs text-slate-700">{axis.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleOpen}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition"
        >
          <ClipboardList size={16} />
          Ouvrir le CBS/CAP
        </button>

        {/* Dossiers récents avec indicateur de mise à jour */}
        <div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Dossiers récents</p>
          <div className="space-y-1.5">
            {RECENT_DOSSIERS.map((d, i) => (
              <button
                key={i}
                onClick={handleOpenDossier}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {d.updated && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" title="Mis à jour récemment" />}
                    <p className="text-2xs font-semibold text-slate-900 truncate">{d.client}</p>
                  </div>
                  <p className="text-2xs text-slate-500 truncate">{d.note}</p>
                </div>
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                    d.status === 'Validated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {d.status === 'Validated' ? 'Validated' : 'Draft'}
                </span>
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
                    msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-900'
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
          <Sparkles className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-purple-500" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Démarrer une nouvelle conversation sur le CBS/CAP..."
            className="w-full h-8 rounded-lg border border-slate-200 bg-white pl-7 pr-9 text-2xs focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-50 rounded transition"
          >
            <Send size={14} className="text-purple-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
