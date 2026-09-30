import { useState, useRef, useEffect } from 'react'
import { Mic, Send, Clock, ArrowLeft, Plus, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface CrmAgentPageProps {
  onOpenMeena?: () => void
  isCompact?: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Dossier {
  id: string
  client: string
  subject: string
  status: 'Synchronisé' | 'Brouillon'
  updatedAt: string
  messages: ChatMessage[]
}

const INITIAL_DOSSIERS: Dossier[] = [
  {
    id: 'd1',
    client: 'AeroDynamics Group',
    subject: 'Call CFO — refinancement 2027',
    status: 'Synchronisé',
    updatedAt: '18 août 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Note synchronisée avec CRM+. Points clés : cadrage du calendrier de refinancement, ouverture évoquée sur le mandat sell-side.' },
    ],
  },
  {
    id: 'd2',
    client: 'TechCorp France',
    subject: 'Point mensuel commercial',
    status: 'Synchronisé',
    updatedAt: '12 août 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Note synchronisée avec CRM+. Aucune action bloquante identifiée.' },
    ],
  },
  {
    id: 'd3',
    client: 'Manufacturing Ltd',
    subject: 'Suivi covenant Q2',
    status: 'Brouillon',
    updatedAt: '5 août 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Brouillon en attente de relecture avant synchronisation CRM+.' },
    ],
  },
]

/** Page dédiée dans le sidepanel assistant — plan de travail de l'agent Meena (notes de réunion). */
export function CrmAgentPage({ onOpenMeena, isCompact = true }: CrmAgentPageProps) {
  const [dossiers, setDossiers] = useState<Dossier[]>(INITIAL_DOSSIERS)
  const [openId, setOpenId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const pad = isCompact ? 'px-3 py-3' : 'px-4 py-4'

  const openDossier = dossiers.find((d) => d.id === openId) || null

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [openDossier?.messages.length])

  const handleNewConversation = () => {
    const newDossier: Dossier = {
      id: Date.now().toString(),
      client: 'Nouveau sujet',
      subject: 'Conversation non classée',
      status: 'Brouillon',
      updatedAt: "à l'instant",
      messages: [],
    }
    setDossiers((prev) => [newDossier, ...prev])
    setOpenId(newDossier.id)
  }

  const handleSend = () => {
    if (!input.trim() || !openId) return
    const question = input.trim()
    setInput('')
    setDossiers((prev) =>
      prev.map((d) => (d.id === openId ? { ...d, messages: [...d.messages, { id: Date.now().toString(), role: 'user', content: question }] } : d))
    )
    setTimeout(() => {
      setDossiers((prev) =>
        prev.map((d) =>
          d.id === openId
            ? {
                ...d,
                messages: [
                  ...d.messages,
                  {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `Je peux préparer une note de réunion à ce sujet ("${question}"). Cliquez sur "Ouvrir Meena" pour démarrer l'enregistrement vocal.`,
                  },
                ],
              }
            : d
        )
      )
    }, 500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* En-tête compact : titre + info au survol */}
      <div className={`flex items-center gap-2 ${pad} pb-2 border-b border-slate-200 flex-shrink-0`}>
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Mic size={14} className="text-amber-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-900 flex-1 truncate">CRM+ Agent · Meena</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 rounded hover:bg-slate-100 transition flex-shrink-0" title="En savoir plus">
              <Info size={14} className="text-slate-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="font-semibold text-white mb-1">Rédigez vos notes à la voix</p>
            <ul className="space-y-0.5 text-slate-300">
              <li>• Enregistrement vocal de la réunion</li>
              <li>• Transcription et extraction des actions</li>
              <li>• Synchronisation automatique avec CRM+</li>
            </ul>
          </TooltipContent>
        </Tooltip>
        <button
          onClick={() => onOpenMeena?.()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-2xs font-medium transition flex-shrink-0"
        >
          <Mic size={12} />
          Ouvrir
        </button>
      </div>

      {openDossier ? (
        /* Détail d'un dossier : historique de la conversation + composer */
        <>
          <div className={`flex items-center gap-2 ${pad} py-2 border-b border-slate-200 flex-shrink-0`}>
            <button onClick={() => setOpenId(null)} className="p-1 rounded hover:bg-slate-100 transition">
              <ArrowLeft size={14} className="text-slate-600" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{openDossier.client}</p>
              <p className="text-2xs text-slate-500 truncate">{openDossier.subject}</p>
            </div>
            <span
              className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                openDossier.status === 'Synchronisé' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {openDossier.status}
            </span>
          </div>

          <div className={`flex-1 overflow-y-auto ${pad} space-y-1.5`}>
            {openDossier.messages.length === 0 && (
              <p className="text-2xs text-slate-400 text-center pt-6">Aucun message pour l'instant — posez une question ci-dessous.</p>
            )}
            {openDossier.messages.map((msg) => (
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

          <div className={`border-t border-slate-200 bg-white ${isCompact ? 'p-2' : 'p-3'} flex-shrink-0`}>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Continuer la conversation..."
                className="w-full h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-2xs focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button onClick={handleSend} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-50 rounded transition">
                <Send size={14} className="text-amber-600" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Liste des dossiers traités */
        <div className={`flex-1 overflow-y-auto ${pad} space-y-2`}>
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 transition text-2xs font-medium"
          >
            <Plus size={14} />
            Nouvelle conversation
          </button>

          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide pt-1">Dossiers traités</p>
          <div className="space-y-1.5">
            {dossiers.map((d) => (
              <button
                key={d.id}
                onClick={() => setOpenId(d.id)}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-2xs font-semibold text-slate-900 truncate">{d.client}</p>
                  <p className="text-2xs text-slate-500 truncate">{d.subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span
                    className={`text-2xs px-1.5 py-0.5 rounded font-medium ${
                      d.status === 'Synchronisé' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {d.status}
                  </span>
                  <span className="text-2xs text-slate-400 flex items-center gap-0.5">
                    <Clock size={10} />
                    {d.updatedAt}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
