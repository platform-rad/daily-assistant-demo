import { ClipboardList, Target, TrendingUp, ShieldCheck, Leaf, Network } from 'lucide-react'
import type { HostRoute } from '@/data/types'

interface CapCbsAgentPageProps {
  onNavigate?: (route: HostRoute) => void
  onOpenMyClientDev?: (route?: HostRoute) => void
  isCompact?: boolean
}

const AXES = [
  { icon: <Target size={13} />, label: 'Contexte' },
  { icon: <TrendingUp size={13} />, label: 'Revenus historiques & prévisions' },
  { icon: <ShieldCheck size={13} />, label: 'RWA / Profitabilité' },
  { icon: <Leaf size={13} />, label: 'ESG' },
  { icon: <Network size={13} />, label: 'Angle IB/TB/GM — opportunités & connectivité' },
]

/** Page dédiée dans le sidepanel assistant — ouvre le plan de travail CAP/CBS. */
export function CapCbsAgentPage({ onNavigate, onOpenMyClientDev, isCompact = true }: CapCbsAgentPageProps) {
  const titleSize = isCompact ? 'text-sm font-bold' : 'text-lg font-bold'

  const handleOpen = () => {
    if (onNavigate) onNavigate('cap-cbs')
    else onOpenMyClientDev?.('cap-cbs')
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className={`${isCompact ? 'px-3 py-3' : 'px-4 py-5'} space-y-4`}>
        <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50/60 to-transparent p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <ClipboardList size={16} className="text-purple-600" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className={`${titleSize} text-slate-900`}>CAP / CBS</h2>
              <span className="text-2xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">Draft</span>
            </div>
          </div>
          <p className="text-2xs text-slate-600 leading-relaxed">
            Le CBS consolide la vision client, l'ambition commerciale, les trajectoires de revenus
            et de rentabilité, les opportunités prioritaires et l'intensité relationnelle. Le CAP
            traduit cette stratégie en actions, contributions et suivis.
          </p>
        </div>

        <div>
          <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Les 5 axes du CBS</p>
          <div className="space-y-1.5">
            {AXES.map((axis, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-purple-600 flex-shrink-0">{axis.icon}</span>
                <span className="text-2xs text-slate-700">{axis.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleOpen}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition"
        >
          <ClipboardList size={16} />
          Ouvrir le CBS/CAP
        </button>
      </div>
    </div>
  )
}
