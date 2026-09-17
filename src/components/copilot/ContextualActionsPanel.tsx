import { useState } from 'react'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { ContextualSuggestions } from './ContextualSuggestions'

interface ContextualActionsPanelProps {
  context: string
  onActionClick: (action: string) => void
  initialExpanded?: boolean
}

export function ContextualActionsPanel({
  context,
  onActionClick,
  initialExpanded = true
}: ContextualActionsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  return (
    <div className="border-b border-slate-200 bg-slate-50">
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-100 transition"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-600 flex-shrink-0" />
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Suggestions pour le contexte
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-slate-500" />
        ) : (
          <ChevronDown size={16} className="text-slate-500" />
        )}
      </button>

      {/* Content - Collapsible */}
      {isExpanded && (
        <div className="px-2 py-2 space-y-1">
          <ContextualSuggestions
            context={context}
            onActionClick={onActionClick}
            contextData={{}}
          />
        </div>
      )}
    </div>
  )
}
