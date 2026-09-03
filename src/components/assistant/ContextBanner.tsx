import { useEffect, useRef, useState } from 'react'
import { Crosshair, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AGENTS } from '@/data/agents'
import { ROUTES } from '@/data/hostRoutes'
import type { HostRoute } from '@/data/types'
import { cn } from '@/lib/utils'
import { AgentIcon } from './AgentIcon'

interface Props {
  route: HostRoute
  onRunContextAction: (target: 'cbs' | 'memo') => void
  busy: boolean
}

/**
 * Bandeau « contexte détecté ». Il indique sur quel écran de MyClientDev se
 * trouve l'utilisateur, quel agent l'assistant met en avant, et propose
 * l'action la plus pertinente pour cet écran.
 */
export function ContextBanner({ route, onRunContextAction, busy }: Props) {
  const meta = ROUTES[route]
  const agent = AGENTS.find((a) => a.id === meta.suggestedAgentId)

  // Courte phase « analyse du contexte » à chaque changement d'écran.
  const [scanning, setScanning] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setScanning(true)
    const timer = setTimeout(() => setScanning(false), 700)
    return () => clearTimeout(timer)
  }, [route])

  return (
    <div className="border-b border-slate-200 bg-rad-indigo-50/60 px-3 py-2">
      <div className="flex items-center gap-1.5">
        {scanning ? (
          <Loader2 className="size-3 shrink-0 animate-spin text-rad-indigo-600" />
        ) : (
          <Crosshair className="size-3 shrink-0 text-rad-indigo-600" />
        )}
        <span className="text-2xs font-semibold uppercase tracking-wider text-rad-indigo-700">
          {scanning ? 'Analyse du contexte…' : 'Contexte détecté'}
        </span>
        <span className="ml-auto flex min-w-0 items-center gap-1 text-2xs text-slate-500">
          {agent && <AgentIcon name={agent.icon} className="size-3 shrink-0" />}
          <span className="truncate">{agent?.name}</span>
        </span>
      </div>

      <div
        className={cn(
          'mt-1 transition-opacity duration-200',
          scanning ? 'opacity-40' : 'opacity-100'
        )}
      >
        <div className="text-xs font-medium text-slate-900">{meta.contextLabel}</div>
        <p className="mt-0.5 text-2xs leading-relaxed text-slate-600">{meta.contextHint}</p>

        {meta.contextAction && (
          <Button
            size="xs"
            variant="subtle"
            className="mt-1.5"
            disabled={busy || scanning}
            onClick={() => onRunContextAction(meta.contextAction!.target)}
          >
            {busy ? <Loader2 className="size-3 animate-spin" /> : null}
            {meta.contextAction.label}
          </Button>
        )}
      </div>
    </div>
  )
}
