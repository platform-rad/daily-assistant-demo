import { useState, useRef, useEffect } from 'react'
import { ClipboardList, Send, ArrowLeft, ArrowUpRight, Plus, Info, LayoutGrid, AlertTriangle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { HostRoute } from '@/data/types'
import type { CapCbsDossier, CapCbsStatus, DossierMessage } from '@/data/capCbsDossiers'

interface CapCbsAgentPageProps {
  onNavigate?: (route: HostRoute) => void
  onOpenMyClientDev?: (route?: HostRoute) => void
  /** Source unique — la même que le tableau de bord et la fiche client à gauche. */
  dossiers: CapCbsDossier[]
  onAddDossier: (dossier: CapCbsDossier) => void
  onAddMessage: (id: string, message: DossierMessage) => void
  isCompact?: boolean
}

const STATUS_STYLE: Record<CapCbsStatus, string> = {
  Validated: 'bg-emerald-100 text-emerald-700',
  'Pending Review': 'bg-rad-indigo-100 text-rad-indigo-700',
  Draft: 'bg-amber-100 text-amber-700',
}

/** Dedicated sidepanel work plan for CAP/CBS — pointeur + mémoire de conversation,
 *  la validation elle-même se fait toujours sur le dossier complet, à gauche. */
export function CapCbsAgentPage({ onNavigate, onOpenMyClientDev, dossiers, onAddDossier, onAddMessage, isCompact = true }: CapCbsAgentPageProps) {
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
    const newDossier: CapCbsDossier = {
      id: Date.now().toString(),
      client: 'New topic',
      sector: '—',
      status: 'Draft',
      createdAt: 'just now',
      updatedAt: 'just now',
      pilotBanker: '—',
      nextReview: '—',
      note: 'Unclassified conversation',
      messages: [],
    }
    onAddDossier(newDossier)
    setOpenId(newDossier.id)
  }

  const handleSend = () => {
    if (!input.trim() || !openId) return
    const question = input.trim()
    setInput('')
    onAddMessage(openId, { id: Date.now().toString(), role: 'user', content: question })
    setTimeout(() => {
      onAddMessage(openId, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I can dig into this on the CBS/CAP ("${question}"). Open the full dossier to edit the relevant axes directly.`,
      })
    }, 500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Compact header: title + info tooltip */}
      <div className={`flex items-center gap-2 ${pad} pb-2 border-b border-slate-200 flex-shrink-0`}>
        <div className="w-7 h-7 rounded-lg bg-rad-indigo-100 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={14} className="text-rad-indigo-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-900 flex-1 truncate">CAP / CBS</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 rounded hover:bg-slate-100 transition flex-shrink-0" title="Learn more">
              <Info size={14} className="text-slate-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="font-semibold text-white mb-1">Client strategy & action plan</p>
            <p className="text-slate-300 mb-1.5">
              The CBS consolidates the client vision, commercial ambition and priority
              opportunities. The CAP translates that strategy into actions and follow-ups.
            </p>
            <ul className="space-y-0.5 text-slate-300">
              <li>• Context</li>
              <li>• Historical revenue & forecasts</li>
              <li>• RWA / Profitability</li>
              <li>• ESG</li>
              <li>• IB/TB/GM angle — opportunities & connectivity</li>
            </ul>
          </TooltipContent>
        </Tooltip>
        <button
          onClick={goToDashboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rad-indigo-600 hover:bg-rad-indigo-700 text-white text-2xs font-medium transition flex-shrink-0"
        >
          <LayoutGrid size={12} />
          Dashboard
        </button>
      </div>

      {openDossier ? (
        /* Dossier detail: conversation history + composer — mémoire conservée pour reprendre le contexte */
        <>
          <div className={`flex items-center gap-2 ${pad} py-2 border-b border-slate-200 flex-shrink-0`}>
            <button onClick={() => setOpenId(null)} className="p-1 rounded hover:bg-slate-100 transition">
              <ArrowLeft size={14} className="text-slate-600" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{openDossier.client}</p>
              <p className="text-2xs text-slate-500 truncate">{openDossier.note}</p>
            </div>
            <span className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${STATUS_STYLE[openDossier.status]}`}>
              {openDossier.status}
            </span>
            <button onClick={goToDetail} title="Open the full dossier" className="p-1 rounded hover:bg-rad-indigo-50 transition flex-shrink-0">
              <ArrowUpRight size={14} className="text-rad-indigo-600" />
            </button>
          </div>

          <div className={`flex-1 overflow-y-auto ${pad} space-y-1.5`}>
            {openDossier.messages.length === 0 && (
              <p className="text-2xs text-slate-400 text-center pt-6">No messages yet — ask a question below.</p>
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
            <p className="flex items-start gap-1 text-2xs text-slate-400 pt-1">
              <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
              AI-drafted content — human validation required before status can change. Open the full dossier to submit or validate.
            </p>
            <div ref={endRef} />
          </div>

          <div className={`border-t border-slate-200 bg-white ${isCompact ? 'p-2' : 'p-3'} flex-shrink-0`}>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Continue the conversation..."
                className="w-full h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-2xs focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500"
              />
              <button onClick={handleSend} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-rad-indigo-50 rounded transition">
                <Send size={14} className="text-rad-indigo-600" />
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Recent dossiers list */
        <div className={`flex-1 overflow-y-auto ${pad} space-y-2`}>
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-rad-indigo-300 text-rad-indigo-700 hover:bg-rad-indigo-50 transition text-2xs font-medium"
          >
            <Plus size={14} />
            New conversation
          </button>

          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide pt-1">Recent dossiers</p>
          <div className="space-y-1.5">
            {dossiers.map((d) => (
              <div
                key={d.id}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-rad-indigo-300 hover:bg-rad-indigo-50/40 transition"
              >
                <button onClick={() => setOpenId(d.id)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    {d.updatedAt.startsWith('il y a') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" title="Recently updated" />
                    )}
                    <p className="text-2xs font-semibold text-slate-900 truncate">{d.client}</p>
                  </div>
                  <p className="text-2xs text-slate-500 truncate">{d.note}</p>
                </button>
                <span className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${STATUS_STYLE[d.status]}`}>
                  {d.status}
                </span>
                <button onClick={goToDetail} title="Open the full dossier" className="p-1 rounded hover:bg-rad-indigo-100 transition flex-shrink-0">
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
