import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import type { OrchestratedAction, ToolId } from '@/data/orchestrator'
import { TOOLS } from '@/data/orchestrator'

interface ActionCardProps {
  action: OrchestratedAction
  onAuthorize: () => void
  onOpenTool: (toolId: ToolId) => void
}

export function ActionCard({ action, onAuthorize, onOpenTool }: ActionCardProps) {
  const tool = TOOLS.find((t) => t.id === action.toolId)

  return (
    <div className="border border-rad-indigo-200 bg-rad-indigo-50 rounded p-2">
      {/* En-tête */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-2xs font-semibold text-slate-900">{action.summary}</p>
          <p className="mt-0.5 text-2xs text-slate-600">{tool?.name}</p>
        </div>
        {action.status === 'pending' && (
          <Lock size={14} className="text-slate-500 flex-shrink-0" />
        )}
        {action.status === 'authorized' && (
          <div className="h-4 w-4 animate-spin rounded-full border border-rad-indigo-300 border-t-rad-indigo-600 flex-shrink-0" />
        )}
        {action.status === 'executed' && (
          <CheckCircle size={14} className="text-emerald-600 flex-shrink-0" />
        )}
        {action.status === 'failed' && (
          <AlertCircle size={14} className="text-red-600 flex-shrink-0" />
        )}
      </div>

      {/* Étapes */}
      {action.steps && (
        <div className="mb-2 space-y-0.5">
          {action.steps.map((step, idx) => (
            <div key={idx} className="flex gap-1.5 text-2xs text-slate-700">
              <span className="font-semibold text-rad-indigo-600 flex-shrink-0">{idx + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Résultats */}
      {action.results && (
        <div className="mb-2 rounded bg-emerald-50 px-2 py-1.5 text-2xs text-emerald-800">
          {action.results.split('\n').map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      {/* Actions */}
      {action.status === 'pending' && (
        <div className="flex gap-1.5">
          <button
            onClick={onAuthorize}
            className="flex-1 rounded px-2 py-1 text-2xs font-medium bg-rad-indigo-600 text-white hover:bg-rad-indigo-700 transition"
          >
            Autoriser
          </button>
          <button
            onClick={() => onOpenTool(action.toolId)}
            className="flex-1 rounded px-2 py-1 text-2xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            Aperçu
          </button>
        </div>
      )}

      {action.status === 'executed' && (
        <div className="flex gap-1.5">
          <button
            onClick={() => onOpenTool(action.toolId)}
            className="flex-1 rounded px-2 py-1 text-2xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
          >
            Ouvrir {tool?.name}
          </button>
          <button disabled className="flex-1 rounded px-2 py-1 text-2xs font-medium bg-slate-100 text-slate-500">
            Éditer
          </button>
        </div>
      )}
    </div>
  )
}
