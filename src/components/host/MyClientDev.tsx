import { ChevronRight } from 'lucide-react'
import { TopNav } from './TopNav'
import { CapCbsDashboardPage } from './pages/CapCbsDashboardPage'
import { CapCbsPage } from './pages/CapCbsPage'
import { ClientEditPage } from './pages/ClientEditPage'
import { ClientOverviewPage } from './pages/ClientOverviewPage'
import { CreditPage } from './pages/CreditPage'
import { PipelinePage } from './pages/PipelinePage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ROUTES } from '@/data/hostRoutes'
import type { HostRoute } from '@/data/types'
import type { CapCbsDossier } from '@/data/capCbsDossiers'
import type { CrmNote } from '@/data/crmNotes'

interface Props {
  route: HostRoute
  onNavigate: (route: HostRoute) => void
  /** Vrai quand l'assistant est en Split View : la page se resserre. */
  compact?: boolean
  /** Ouvre Meena (agent CRM+) — utilisé depuis l'onglet "Actions IA" de la fiche client. */
  onOpenMeena?: () => void
  /** Source unique CAP/CBS + CRM+ — partagée avec le panneau assistant. */
  capCbsDossiers: CapCbsDossier[]
  onUpdateCapCbsDossier: (id: string, patch: Partial<CapCbsDossier>) => void
  crmNotes: CrmNote[]
  onApproveCrmNote: (id: string) => void
  /** Quel client la fiche 'client' affiche actuellement — porté par App.tsx pour que les
   *  deep-links (portefeuille, CAP/CBS, CRM+) pointent tous vers le bon client. */
  activeClientName: string
  onSelectClient: (name: string) => void
}

/**
 * Application hôte simulée. Elle change d'écran sans jamais remonter
 * l'assistant, qui vit à côté d'elle dans l'arbre React.
 */
export function MyClientDev({
  route,
  onNavigate,
  compact = false,
  onOpenMeena,
  capCbsDossiers,
  onUpdateCapCbsDossier,
  crmNotes,
  onApproveCrmNote,
  activeClientName,
  onSelectClient,
}: Props) {
  const meta = ROUTES[route]
  const clientCapCbsDossier = capCbsDossiers.find((d) => d.client === activeClientName)
  const clientCrmNotes = crmNotes.filter((n) => n.client === activeClientName)

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
          {route === 'portfolio' && (
            <PortfolioPage
              onOpenClient={(name) => {
                onSelectClient(name)
                onNavigate('client')
              }}
            />
          )}
          {route === 'client' && (
            <ClientOverviewPage
              compact={compact}
              clientName={activeClientName}
              onEdit={() => onNavigate('client-edit')}
              onOpenCapCbs={() => onNavigate('cap-cbs-detail')}
              onOpenMeena={onOpenMeena}
              capCbsDossier={clientCapCbsDossier}
              crmNotes={clientCrmNotes}
              onApproveCrmNote={onApproveCrmNote}
            />
          )}
          {route === 'client-edit' && <ClientEditPage onCancel={() => onNavigate('client')} />}
          {route === 'cap-cbs' && (
            <CapCbsDashboardPage
              dossiers={capCbsDossiers}
              onOpenDetail={(client) => {
                onSelectClient(client)
                onNavigate('cap-cbs-detail')
              }}
            />
          )}
          {route === 'cap-cbs-detail' && clientCapCbsDossier && (
            <CapCbsPage
              dossier={clientCapCbsDossier}
              onSubmitForReview={() => onUpdateCapCbsDossier(clientCapCbsDossier.id, { status: 'Pending Review', updatedAt: 'just now' })}
              onValidate={() => onUpdateCapCbsDossier(clientCapCbsDossier.id, { status: 'Validated', updatedAt: 'just now' })}
            />
          )}
          {route === 'pipeline' && <PipelinePage />}
          {route === 'credit' && <CreditPage />}
        </div>
      </div>
    </div>
  )
}
