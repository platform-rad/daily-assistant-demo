import { useState, useRef, useEffect } from 'react'
import { ClipboardList, Send, ArrowLeft, ArrowUpRight, Plus, Info, LayoutGrid } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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

interface Dossier {
  id: string
  client: string
  status: 'Draft' | 'Validated'
  updated: boolean
  note: string
  messages: ChatMessage[]
}

const INITIAL_DOSSIERS: Dossier[] = [
  {
    id: 'c1',
    client: 'AeroDynamics Group',
    status: 'Draft',
    updated: true,
    note: 'Axe ESG modifié il y a 2h',
    messages: [{ id: 'm1', role: 'assistant', content: "3 axes sur 5 complétés. L'axe ESG a été mis à jour par É. Mercier il y a 2h." }],
  },
  {
    id: 'c2',
    client: 'TechCorp France',
    status: 'Validated',
    updated: false,
    note: 'Validé le 2 sept. 2026',
    messages: [{ id: 'm1', role: 'assistant', content: 'CBS/CAP validé — données figées jusqu\'à la prochaine revue (sept. 2027).' }],
  },
  {
    id: 'c3',
    client: 'Manufacturing Ltd',
    status: 'Draft',
    updated: true,
    note: 'Nouvelle contribution région EMEA',
    messages: [{ id: 'm1', role: 'assistant', content: 'La région EMEA a ajouté une contribution sur l\'axe Angle IB/TB/GM.' }],
  },
]

/** Page dédiée dans le sidepanel assistant — plan de travail CAP/CBS. */
export function CapCbsAgentPage({ onNavigate, onOpenMyClientDev, isCompact = true }: CapCbsAgentPageProps) {
  const [dossiers, setDossiers] = useState<Dossier[]>(INITIAL_DOSSIERS)
  const [openId, setOpenId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const pad = isCompact ? 'px-3 py-3' : 'px-4 py-4'

  const openDossier = dossiers.find((d) => d.id === openId) || null

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [openDossier?.messages.length])

  const goToDashboard = () => {
    if (onNavigate) onNavigate('cap-cbs')
    else onOpenMyClientDev?.('cap-cbs')
  }

  const goToDetail = () => {
    if (onNavigate) onNavigate('cap-cbs-detail')
    else onOpenMyClientDev?.('cap-cbs-detail')
  }

  const handleNewConversation = () => {
    const newDossier: Dossier = {
      id: Date.now().toString(),
      client: 'Nouveau sujet',
      status: 'Draft',
      updated: false,
      note: 'Conversation non classée',
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
                    content: `Je peux creuser ce point sur le CBS/CAP ("${question}"). Ouvrez le dossier complet pour éditer directement les axes concernés.`,
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
        <div className="w-7 h-7 rounded-lg bg-rad-indigo-100 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={14} className="text-rad-indigo-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-900 flex-1 truncate">CAP / CBS</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 rounded hover:bg-slate-100 transition flex-shrink-0" title="En savoir plus">
              <Info size={14} className="text-slate-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="font-semibold text-white mb-1">Stratégie & plan d'action client</p>
            <p className="text-slate-300 mb-1.5">
              Le CBS consolide la vision client, l'ambition commerciale et les opportunités
              prioritaires. Le CAP traduit cette stratégie en actions et suivis.
            </p>
            <ul className="space-y-0.5 text-slate-300">
              <li>• Contexte</li>
              <li>• Revenus historiques & prévisions</li>
              <li>• RWA / Profitabilité</li>
              <li>• ESG</li>
              <li>• Angle IB/TB/GM — opportunités & connectivité</li>
            </ul>
          </TooltipContent>
        </Tooltip>
        <button
          onClick={goToDashboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rad-indigo-600 hover:bg-rad-indigo-700 text-white text-2xs font-medium transition flex-shrink-0"
        >
          <LayoutGrid size={12} />
          Tableau de bord
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
              <p className="text-2xs text-slate-500 truncate">{openDossier.note}</p>
            </div>
            <span
              className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                openDossier.status === 'Validated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {openDossier.status}
            </span>
            <button onClick={goToDetail} title="Ouvrir le dossier complet" className="p-1 rounded hover:bg-rad-indigo-50 transition flex-shrink-0">
              <ArrowUpRight size={14} className="text-rad-indigo-600" />
            </button>
          </div>

          <div className={`flex-1 overflow-y-auto ${pad} space-y-1.5`}>
            {openDossier.messages.length === 0 && (
              <p className="text-2xs text-slate-400 text-center pt-6">Aucun message pour l'instant — posez une question ci-dessous.</p>
            )}
            {openDossier.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-2xs leading-snug ${
                    msg.role === 'user' ? 'bg-rad-indigo-600 text-white' : 'bg-slate-100 text-slate-900'
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
                className="w-full h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-2xs focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500"
              />
              <button onClick={handleSend} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-rad-indigo-50 rounded transition">
                <Send size={14} className="text-rad-indigo-600" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Liste des dossiers traités */
        <div className={`flex-1 overflow-y-auto ${pad} space-y-2`}>
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-rad-indigo-300 text-rad-indigo-700 hover:bg-rad-indigo-50 transition text-2xs font-medium"
          >
            <Plus size={14} />
            Nouvelle conversation
          </button>

          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide pt-1">Dossiers traités</p>
          <div className="space-y-1.5">
            {dossiers.map((d) => (
              <div
                key={d.id}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-rad-indigo-300 hover:bg-rad-indigo-50/40 transition"
              >
                <button onClick={() => setOpenId(d.id)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    {d.updated && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" title="Mis à jour récemment" />}
                    <p className="text-2xs font-semibold text-slate-900 truncate">{d.client}</p>
                  </div>
                  <p className="text-2xs text-slate-500 truncate">{d.note}</p>
                </button>
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                    d.status === 'Validated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {d.status}
                </span>
                <button onClick={goToDetail} title="Ouvrir le dossier complet" className="p-1 rounded hover:bg-rad-indigo-100 transition flex-shrink-0">
                  <ArrowUpRight size={13} className="text-rad-indigo-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
