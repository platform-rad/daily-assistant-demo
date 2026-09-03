import { ChevronDown, Columns2, Minus, PanelRight, Pin, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AGENTS, MAX_PINNED } from '@/data/agents'
import type { Agent, AgentCategory } from '@/data/types'
import { cn } from '@/lib/utils'
import { AgentIcon } from './AgentIcon'

const CATEGORIES: AgentCategory[] = [
  'Intelligence',
  'Origination',
  'Risque',
  'Production de documents',
]

interface Props {
  activeAgentId: string
  pinned: string[]
  mode: 'widget' | 'split'
  onSelectAgent: (id: string) => void
  onTogglePin: (id: string) => void
  onToggleMode: () => void
  onCollapse: () => void
}

export function AssistantHeader({
  activeAgentId,
  pinned,
  mode,
  onSelectAgent,
  onTogglePin,
  onToggleMode,
  onCollapse,
}: Props) {
  const activeAgent = AGENTS.find((a) => a.id === activeAgentId) ?? AGENTS[0]
  const pinnedAgents = pinned
    .map((id) => AGENTS.find((a) => a.id === id))
    .filter(Boolean) as Agent[]

  return (
    <div className="shrink-0 border-b border-slate-800 bg-rad-navy">
      {/* Ligne 1 — identité + contrôles de fenêtre */}
      <div className="flex h-12 items-center gap-2 px-3">
        <div className="flex size-6 shrink-0 items-center justify-center rounded bg-rad-indigo-600">
          <svg viewBox="0 0 16 16" className="size-3.5 fill-white">
            <path d="M8 0.5l1.9 4.4 4.6.5-3.4 3.1.9 4.5L8 10.7 4 12.9l.9-4.5L1.5 5.4l4.6-.5z" />
          </svg>
        </div>
        <span className="text-xs font-semibold tracking-tight text-white">Daily Assistant</span>
        <Badge variant="outline" className="border-slate-700 text-slate-400">
          v0
        </Badge>

        <div className="ml-auto flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleMode}
                className="flex size-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                {mode === 'widget' ? (
                  <Columns2 className="size-3.5" />
                ) : (
                  <PanelRight className="size-3.5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {mode === 'widget'
                ? 'Passer en Split View (50 % de l’écran)'
                : 'Revenir en mode Widget (380 px)'}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onCollapse}
                className="flex size-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <Minus className="size-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Réduire</TooltipContent>
          </Tooltip>

          <button
            onClick={onCollapse}
            className="flex size-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Ligne 2 — sélecteur d'agent */}
      <div className="px-3 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-md border border-slate-700 bg-slate-800/70 px-2.5 py-1.5 text-left transition-colors hover:border-slate-600 hover:bg-slate-800">
              <AgentIcon name={activeAgent.icon} className="size-4 shrink-0 text-rad-indigo-300" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-white">{activeAgent.name}</div>
                <div className="truncate text-2xs text-slate-400">{activeAgent.category}</div>
              </div>
              {activeAgent.pending > 0 && (
                <span className="shrink-0 rounded-full bg-rad-indigo-600 px-1.5 py-0.5 text-2xs font-semibold text-white">
                  {activeAgent.pending}
                </span>
              )}
              <ChevronDown className="size-3.5 shrink-0 text-slate-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="max-h-[70vh] w-[340px] overflow-y-auto">
            <DropdownMenuLabel>
              Agents de la banque · {AGENTS.length} disponibles
            </DropdownMenuLabel>
            <div className="px-2 pb-1.5 text-2xs text-slate-400">
              Épinglez jusqu’à {MAX_PINNED} agents pour les garder à portée de clic.
            </div>
            <DropdownMenuSeparator />
            {CATEGORIES.map((cat) => (
              <div key={cat}>
                <DropdownMenuLabel className="pt-2">{cat}</DropdownMenuLabel>
                {AGENTS.filter((a) => a.category === cat).map((agent) => {
                  const isPinned = pinned.includes(agent.id)
                  const isActive = agent.id === activeAgentId
                  return (
                    <div
                      key={agent.id}
                      className={cn(
                        'group flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-100',
                        isActive && 'bg-rad-indigo-50'
                      )}
                    >
                      <button
                        onClick={() => onSelectAgent(agent.id)}
                        className="flex min-w-0 flex-1 items-start gap-2 text-left"
                      >
                        <AgentIcon
                          name={agent.icon}
                          className={cn(
                            'mt-0.5 size-3.5 shrink-0',
                            isActive ? 'text-rad-indigo-600' : 'text-slate-400'
                          )}
                        />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              'block truncate text-xs font-medium',
                              isActive ? 'text-rad-indigo-700' : 'text-slate-800'
                            )}
                          >
                            {agent.name}
                          </span>
                          <span className="block truncate text-2xs text-slate-500">
                            {agent.description}
                          </span>
                        </span>
                      </button>
                      {agent.pending > 0 && (
                        <span className="mt-0.5 shrink-0 rounded-full bg-slate-200 px-1.5 text-2xs font-semibold text-slate-600">
                          {agent.pending}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          onTogglePin(agent.id)
                        }}
                        title={isPinned ? 'Retirer des favoris' : 'Épingler en favori'}
                        className={cn(
                          'mt-0.5 shrink-0 rounded p-0.5 transition-colors',
                          isPinned
                            ? 'text-rad-indigo-600'
                            : 'text-slate-300 opacity-0 hover:text-slate-600 group-hover:opacity-100'
                        )}
                      >
                        <Pin className={cn('size-3.5', isPinned && 'fill-rad-indigo-600')} />
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Ligne 3 — favoris épinglés (les 3 priorités) */}
      <div className="flex items-center gap-1 border-t border-slate-800/80 px-3 py-1.5">
        <Pin className="mr-0.5 size-3 shrink-0 fill-slate-500 text-slate-500" />
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {pinnedAgents.map((agent) => (
            <Tooltip key={agent.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelectAgent(agent.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-2xs font-medium transition-colors',
                    agent.id === activeAgentId
                      ? 'border-rad-indigo-500 bg-rad-indigo-500/20 text-rad-indigo-200'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  )}
                >
                  <AgentIcon name={agent.icon} className="size-3" />
                  <span className="max-w-[92px] truncate">{agent.name}</span>
                  {agent.pending > 0 && (
                    <span className="size-1.5 rounded-full bg-rad-indigo-400" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{agent.description}</TooltipContent>
            </Tooltip>
          ))}
          {pinnedAgents.length === 0 && (
            <span className="text-2xs text-slate-500">Aucun favori épinglé</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="xs"
          className="shrink-0 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
          onClick={() => onSelectAgent(activeAgentId)}
        >
          {pinnedAgents.length}/{MAX_PINNED}
        </Button>
      </div>
    </div>
  )
}
