import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
    <Card className="border border-blue-200 bg-blue-50 p-3">
      {/* En-tête */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{action.summary}</p>
          <p className="mt-1 text-xs text-gray-600">{tool?.name}</p>
        </div>
        {action.status === 'pending' && (
          <Lock size={16} className="text-yellow-600" />
        )}
        {action.status === 'authorized' && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
        )}
        {action.status === 'executed' && (
          <CheckCircle size={16} className="text-green-600" />
        )}
        {action.status === 'failed' && (
          <AlertCircle size={16} className="text-red-600" />
        )}
      </div>

      {/* Étapes */}
      {action.steps && (
        <div className="mb-3 space-y-1">
          {action.steps.map((step, idx) => (
            <div key={idx} className="flex gap-2 text-xs text-gray-700">
              <span className="font-semibold text-blue-600">{idx + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Résultats */}
      {action.results && (
        <div className="mb-3 rounded bg-green-50 p-2 text-xs text-green-800">
          {action.results.split('\n').map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      {/* Actions */}
      {action.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            onClick={onAuthorize}
            size="sm"
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            Autoriser
          </Button>
          <Button
            onClick={() => onOpenTool(action.toolId)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Aperçu
          </Button>
        </div>
      )}

      {action.status === 'executed' && (
        <div className="flex gap-2">
          <Button
            onClick={() => onOpenTool(action.toolId)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Ouvrir {tool?.name}
          </Button>
          <Button size="sm" disabled className="flex-1 bg-gray-100 text-gray-600">
            Éditer
          </Button>
        </div>
      )}
    </Card>
  )
}
