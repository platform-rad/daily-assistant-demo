import { Home, Mic, ClipboardList } from 'lucide-react'
import type { HostRoute } from '@/data/types'
import { WorkPlanCard } from './WorkPlanCard'

interface WorkPlansPageProps {
  onGoHome: () => void
  onOpenMeena?: () => void
  onNavigate?: (route: HostRoute) => void
  onOpenMyClientDev?: (route?: HostRoute) => void
  isCompact?: boolean
}

/**
 * Page dédiée listant les différents "plans de travail" accessibles via l'IA :
 * chacun est un espace distinct (homepage, agent vocal, stratégie client...).
 * D'autres viendront s'y ajouter au fil des besoins.
 */
export function WorkPlansPage({ onGoHome, onOpenMeena, onNavigate, onOpenMyClientDev, isCompact = true }: WorkPlansPageProps) {
  const openWorkPlan = (route: HostRoute) => {
    if (onNavigate) onNavigate(route)
    else onOpenMyClientDev?.(route)
  }

  const titleSize = isCompact ? 'text-sm font-bold' : 'text-lg font-bold'

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className={`${isCompact ? 'px-2 py-2' : 'px-3 py-4'} space-y-3`}>
        <div>
          <h2 className={`${titleSize} text-slate-900`}>🗂️ Plans de travail</h2>
          <p className="text-2xs text-slate-500 mt-0.5">
            Choisissez un espace de travail. D'autres seront ajoutés prochainement.
          </p>
        </div>

        <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-2`}>
          <WorkPlanCard
            title="Accueil"
            description="Digest personnalisé, KPIs, actions recommandées et chat avec l'assistant"
            icon={<Home size={isCompact ? 16 : 20} />}
            onSelect={onGoHome}
            isCompact={isCompact}
            accent="purple"
          />
          <WorkPlanCard
            title="CRM+ Agent · Meena"
            description="Rédigez vos notes de réunion à la voix et synchronisez-les avec CRM+"
            icon={<Mic size={isCompact ? 16 : 20} />}
            onSelect={() => onOpenMeena?.()}
            isCompact={isCompact}
            accent="amber"
          />
          <WorkPlanCard
            title="CAP / CBS"
            description="Stratégie commerciale client : 5 axes CBS, plan d'action CAP et validation"
            icon={<ClipboardList size={isCompact ? 16 : 20} />}
            onSelect={() => openWorkPlan('cap-cbs')}
            isCompact={isCompact}
            accent="purple"
          />
        </div>
      </div>
    </div>
  )
}
