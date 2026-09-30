import { useState, useRef, useEffect } from 'react'
import { Search, X, Building2, ClipboardList, Mic } from 'lucide-react'
import { searchIndex, type SearchResult } from '@/data/searchIndex'
import type { NavView } from './SidebarNav'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  onGoToClient?: () => void
  onGoToCapCbs?: () => void
  onGoToCrmAgent?: () => void
  onViewChange: (view: NavView) => void
}

const TYPE_ICON: Record<SearchResult['type'], React.ReactNode> = {
  client: <Building2 size={14} />,
  'cap-cbs': <ClipboardList size={14} />,
  'crm-agent': <Mic size={14} />,
}

/** Full-panel search overlay — controlled by the parent (trigger lives in the header). */
export function GlobalSearch({ isOpen, onClose, onGoToClient, onGoToCapCbs, onGoToCrmAgent, onViewChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  const results = searchIndex(query)

  const handleSelect = (result: SearchResult) => {
    if (result.type === 'client') {
      onGoToClient?.()
    } else if (result.type === 'cap-cbs') {
      onViewChange('cap-cbs')
      onGoToCapCbs?.()
    } else if (result.type === 'crm-agent') {
      onViewChange('crm-agent')
      onGoToCrmAgent?.()
    }
    setQuery('')
    onClose()
  }

  return (
    <div className="absolute inset-0 z-20 bg-white flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 flex-shrink-0">
        <Search size={16} className="text-slate-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clients, CAP/CBS dossiers, CRM+ topics..."
          className="flex-1 text-sm outline-none placeholder:text-slate-400"
        />
        <button
          onClick={() => {
            setQuery('')
            onClose()
          }}
          className="p-1 hover:bg-slate-100 rounded transition flex-shrink-0"
        >
          <X size={16} className="text-slate-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {query.trim() === '' ? (
          <p className="text-2xs text-slate-400 text-center pt-8 px-4">
            Search across your portfolio clients, CAP/CBS dossiers and CRM+ Agent conversations.
          </p>
        ) : results.length === 0 ? (
          <p className="text-2xs text-slate-400 text-center pt-8">No results for "{query}"</p>
        ) : (
          <div className="space-y-1">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-rad-indigo-50 transition text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-rad-indigo-100 flex items-center justify-center text-rad-indigo-600 flex-shrink-0">
                  {TYPE_ICON[r.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{r.title}</p>
                  <p className="text-2xs text-slate-500 truncate">{r.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
