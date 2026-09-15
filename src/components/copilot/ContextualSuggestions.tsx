import { TrendingUp, AlertCircle, Zap } from 'lucide-react'

interface KPI {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
  status: 'good' | 'warning' | 'neutral'
}

interface Action {
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
}

interface ContextualSuggestionsProps {
  context: string
  onActionClick: (prompt: string) => void
  contextData?: {
    currentItem?: string
    itemType?: string
    data?: Record<string, any>
  }
}

const CONTEXT_DATA: Record<string, { kpis: KPI[]; actions: Action[] }> = {
  myClientDev: {
    kpis: [
      {
        label: 'Portfolio Exposure',
        value: '€847.3M',
        trend: 'up',
        status: 'warning',
      },
      {
        label: 'Average Rating',
        value: 'BBB+',
        status: 'good',
      },
      {
        label: 'At-Risk Clients',
        value: '12',
        trend: 'up',
        status: 'warning',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Portfolio Analysis',
        description: 'Analyze portfolio by sector and exposure',
        prompt: 'Fais une analyse complète du portefeuille par secteur et exposition',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Risk Assessment',
        description: 'Identify clients at risk',
        prompt: 'Quels clients sont identifiés comme étant à risque?',
      },
      {
        icon: <Zap size={16} />,
        title: 'Quick Actions',
        description: 'See recommended actions',
        prompt: 'Quelles sont les actions recommandées pour le portefeuille?',
      },
    ],
  },
  myCreditApp: {
    kpis: [
      {
        label: 'Total Facilities',
        value: '234',
        status: 'neutral',
      },
      {
        label: 'Utilization Rate',
        value: '67.8%',
        trend: 'up',
        status: 'warning',
      },
      {
        label: 'Arrears',
        value: '€12.5M',
        trend: 'up',
        status: 'warning',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Facility Analysis',
        description: 'Analyze by product and maturity',
        prompt: 'Analyse les facilities par produit et date de maturité',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Covenant Check',
        description: 'Review covenant compliance',
        prompt: 'Quels clients risquent de violer leurs covenants?',
      },
      {
        icon: <Zap size={16} />,
        title: 'Renewal Pipeline',
        description: 'See upcoming renewals',
        prompt: 'Quelles facilities arrivent à maturité dans les 90 jours?',
      },
    ],
  },
  dashboard: {
    kpis: [
      {
        label: 'Daily Activity',
        value: '47 transactions',
        status: 'good',
      },
      {
        label: 'Open Items',
        value: '8',
        status: 'neutral',
      },
      {
        label: 'Alerts',
        value: '3',
        trend: 'up',
        status: 'warning',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Daily Summary',
        description: 'Get key metrics overview',
        prompt: 'Résume les métriques clés du jour',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Pending Items',
        description: 'Review what needs attention',
        prompt: 'Montre-moi les items en attente',
      },
      {
        icon: <Zap size={16} />,
        title: 'Trends',
        description: 'Analyze recent trends',
        prompt: 'Quelles sont les tendances récentes?',
      },
    ],
  },
  reporting: {
    kpis: [
      {
        label: 'Last Report',
        value: '2 days ago',
        status: 'neutral',
      },
      {
        label: 'Data Quality',
        value: '98.5%',
        status: 'good',
      },
      {
        label: 'Exceptions',
        value: '5',
        status: 'warning',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Generate Report',
        description: 'Create fresh report',
        prompt: 'Génère un rapport mensuel complet',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Data Exceptions',
        description: 'Review data issues',
        prompt: 'Quelles sont les exceptions dans les données?',
      },
      {
        icon: <Zap size={16} />,
        title: 'Comparisons',
        description: 'Compare vs previous periods',
        prompt: 'Compare avec le mois précédent',
      },
    ],
  },
}

export function ContextualSuggestions({
  context,
  onActionClick,
  contextData,
}: ContextualSuggestionsProps) {
  const data = CONTEXT_DATA[context] || CONTEXT_DATA.myClientDev
  const { kpis, actions } = data
  const currentItem = contextData?.currentItem || 'ce contexte'

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '➡️'
  }

  const getStatusColor = (status: string) => {
    if (status === 'good') return 'text-emerald-600'
    if (status === 'warning') return 'text-orange-600'
    return 'text-slate-500'
  }

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div>
        <p className="text-2xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Indicateurs clés</p>
        <div className="grid grid-cols-3 gap-2">
          {kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="rounded border border-slate-200 bg-slate-50 p-2 text-center hover:bg-slate-100 transition"
            >
              <p className="text-2xs text-slate-600">{kpi.label}</p>
              <p className={`text-sm font-bold mt-1 ${getStatusColor(kpi.status)}`}>
                {kpi.trend ? getTrendIcon(kpi.trend) : ''} {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div>
        <p className="text-2xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Actions pour {currentItem}</p>
        <div className="space-y-2">
          {actions.map((action, idx) => {
            // Adapter le texte pour inclure le contexte actuel
            const adaptedTitle = currentItem && currentItem !== 'ce contexte'
              ? `${action.title} - ${currentItem}`
              : action.title
            const adaptedPrompt = currentItem && currentItem !== 'ce contexte'
              ? action.prompt.replace(/ce client|this client|de ce contexte/gi, `de ${currentItem}`)
              : action.prompt

            return (
              <button
                key={idx}
                onClick={() => onActionClick(adaptedPrompt)}
                className="w-full text-left rounded border border-slate-200 bg-white p-2 hover:bg-rad-indigo-50 hover:border-rad-indigo-300 transition group"
              >
                <div className="flex gap-2">
                  <div className="text-rad-indigo-600 group-hover:text-rad-indigo-700 flex-shrink-0">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xs font-semibold text-slate-900 group-hover:text-rad-indigo-700 truncate">
                      {adaptedTitle}
                    </p>
                    <p className="text-2xs text-slate-500 group-hover:text-rad-indigo-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
