import { ChevronRight } from 'lucide-react'
import { TopNav } from './TopNav'
import { ClientEditPage } from './pages/ClientEditPage'
import { ClientOverviewPage } from './pages/ClientOverviewPage'
import { CreditPage } from './pages/CreditPage'
import { PipelinePage } from './pages/PipelinePage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ROUTES } from '@/data/hostRoutes'
import type { HostRoute } from '@/data/types'

interface Props {
  route: HostRoute
  onNavigate: (route: HostRoute) => void
  /** Vrai quand l'assistant est en Split View : la page se resserre. */
  compact?: boolean
}

/**
 * Application hôte simulée. Elle change d'écran sans jamais remonter
 * l'assistant, qui vit à côté d'elle dans l'arbre React.
 */
export function MyClientDev({ route, onNavigate, compact = false }: Props) {
  const meta = ROUTES[route]

  return (
    <div className="flex h-full flex-col bg-background">
      <TopNav route={route} onNavigate={onNavigate} compact={compact} />

      <div className="rad-scroll flex-1 overflow-y-auto">
        {/* Fil d'Ariane */}
        <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3 pt-3 text-2xs text-slate-400">
          {meta.breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3" />}
              <span className={i === meta.breadcrumb.length - 1 ? 'font-medium text-slate-600' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </div>

        <div className="px-5 pb-16">
          {route === 'portfolio' && <PortfolioPage onOpenClient={() => onNavigate('client')} />}
          {route === 'client' && (
            <ClientOverviewPage compact={compact} onEdit={() => onNavigate('client-edit')} />
          )}
          {route === 'client-edit' && <ClientEditPage onCancel={() => onNavigate('client')} />}
          {route === 'pipeline' && <PipelinePage />}
          {route === 'credit' && <CreditPage />}
        </div>
      </div>
    </div>
  )
}
