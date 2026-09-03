import { Bell, ChevronDown, Grid3x3, HelpCircle, Search, Settings } from 'lucide-react'
import { NAV_ORDER, ROUTES } from '@/data/hostRoutes'
import type { HostRoute } from '@/data/types'
import { cn } from '@/lib/utils'

interface Props {
  route: HostRoute
  onNavigate: (route: HostRoute) => void
  compact?: boolean
}

export function TopNav({ route, onNavigate, compact = false }: Props) {
  // L'écran d'édition reste rattaché à l'onglet « Clients ».
  const activeTab: HostRoute = route === 'client-edit' ? 'client' : route
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-rad-navy">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Marque — logotype neutralisé (charte alternative Slate/Indigo) */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-rad-indigo-600 text-xs font-bold text-white">
            M
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight text-white">MyClientDev</div>
            {!compact && (
              <div className="text-2xs text-slate-400">Corporate Coverage — EMEA</div>
            )}
          </div>
        </div>

        <nav className={cn('flex items-center gap-1', compact ? 'pl-1' : 'pl-4')}>
          {NAV_ORDER.map((id) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                compact && 'px-2',
                activeTab === id
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              )}
            >
              {ROUTES[id].navLabel}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-500" />
            <input
              readOnly
              placeholder="Rechercher un client, un deal…"
              className="h-8 w-52 rounded-md border border-slate-700 bg-slate-800/60 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          {[Grid3x3, HelpCircle, Settings].map((Icon, i) => (
            <button
              key={i}
              className="flex size-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Icon className="size-4" />
            </button>
          ))}
          <button className="relative flex size-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
            <Bell className="size-4" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-rad-indigo-400" />
          </button>
          <div className="ml-1 flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-slate-800">
            <div className="flex size-7 items-center justify-center rounded-full bg-rad-indigo-500/20 text-2xs font-semibold text-rad-indigo-200">
              EM
            </div>
            {!compact && <span className="text-xs text-slate-200">É. Mercier</span>}
            <ChevronDown className="size-3 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  )
}
