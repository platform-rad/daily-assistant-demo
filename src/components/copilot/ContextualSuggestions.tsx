import { TrendingUp, AlertCircle, Zap, AlertTriangle } from 'lucide-react'

// Provenance heuristique par mot-clé — discret, sans indicateur de confiance.
const SOURCE_BY_KEYWORD: Array<[RegExp, string]> = [
  [/exposure/i, 'C3'],
  [/rating/i, "S&P / Moody's"],
  [/risk/i, 'Risk Engine'],
  [/facility|utilization|maturity/i, 'Atlas'],
  [/activity|transactions/i, 'Baccarat'],
  [/alert/i, 'Monitoring'],
  [/report|quality|exception/i, 'Data Quality Hub'],
  [/deal|volume|forecast/i, 'Dealogic'],
  [/dossier|updated|status|axes|review/i, 'CBS/CAP Engine'],
]
function getSource(label: string): string {
  for (const [re, src] of SOURCE_BY_KEYWORD) {
    if (re.test(label)) return src
  }
  return 'C3'
}

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
        label: 'Client Exposure',
        value: '€10.0M',
        status: 'good',
      },
      {
        label: 'Rating',
        value: 'BBB+',
        status: 'good',
      },
      {
        label: 'Risk Level',
        value: 'Moderate',
        status: 'neutral',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Client Analysis',
        description: 'Analyze exposure and structure',
        prompt: 'Run a full exposure analysis for this client',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Risk Assessment',
        description: 'Identify specific risks',
        prompt: 'What risks do you identify for this client?',
      },
      {
        icon: <Zap size={16} />,
        title: 'Create Credit Memo',
        description: 'Generate analysis memo',
        prompt: 'Generate a complete Credit Memo for this client',
      },
    ],
  },
  myCreditApp: {
    kpis: [
      {
        label: 'Facility Amount',
        value: '€10.0M',
        status: 'good',
      },
      {
        label: 'Utilization',
        value: '25%',
        status: 'good',
      },
      {
        label: 'Maturity',
        value: '2025-09-03',
        status: 'neutral',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Facility Details',
        description: 'View detailed structure',
        prompt: 'Show me the details of this facility',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Covenant Status',
        description: 'Check covenant compliance',
        prompt: 'Check the covenants for this facility',
      },
      {
        icon: <Zap size={16} />,
        title: 'Renewal Planning',
        description: 'Plan for maturity',
        prompt: 'Prepare the renewal for this facility',
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
        prompt: "Summarize today's key metrics",
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Pending Items',
        description: 'Review what needs attention',
        prompt: 'Show me the pending items',
      },
      {
        icon: <Zap size={16} />,
        title: 'Trends',
        description: 'Analyze recent trends',
        prompt: 'What are the recent trends?',
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
        prompt: 'Generate a complete monthly report',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Data Exceptions',
        description: 'Review data issues',
        prompt: 'What are the exceptions in the data?',
      },
      {
        icon: <Zap size={16} />,
        title: 'Comparisons',
        description: 'Compare vs previous periods',
        prompt: 'Compare with the previous month',
      },
    ],
  },
  portfolio: {
    kpis: [
      {
        label: 'Total Exposure',
        value: '€847.3M',
        trend: 'up',
        status: 'warning',
      },
      {
        label: 'Avg Rating',
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
        title: 'Portfolio Composition',
        description: 'Analyze by sector and size',
        prompt: 'Analyze the portfolio by sector',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Risk Overview',
        description: 'Identify portfolio risks',
        prompt: "What is the portfolio's risk profile?",
      },
      {
        icon: <Zap size={16} />,
        title: 'Optimization',
        description: 'Rebalancing opportunities',
        prompt: 'What optimizations do you recommend?',
      },
    ],
  },
  'cap-cbs': {
    kpis: [
      {
        label: 'Active dossiers',
        value: '5',
        status: 'neutral',
      },
      {
        label: 'To validate',
        value: '3',
        status: 'warning',
      },
      {
        label: 'Updated (24h)',
        value: '3',
        trend: 'up',
        status: 'warning',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'View dashboard',
        description: 'All CBS/CAP in progress',
        prompt: 'Open the CBS/CAP for this client',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Recently updated',
        description: 'See recently modified CBS/CAP',
        prompt: 'Which CBS/CAP dossiers were updated recently?',
      },
      {
        icon: <Zap size={16} />,
        title: 'Summarize strategy',
        description: 'A 1-minute summary of the 5 axes',
        prompt: 'Summarize the CBS/CAP strategy for this client',
      },
    ],
  },
  'cap-cbs-detail': {
    kpis: [
      {
        label: 'Status',
        value: 'Draft',
        status: 'warning',
      },
      {
        label: 'Axes completed',
        value: '3/5',
        status: 'neutral',
      },
      {
        label: 'Next review',
        value: 'Mar 2027',
        status: 'neutral',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Complete remaining axes',
        description: 'ESG and IB/TB/GM angle still open',
        prompt: 'Help me complete the remaining CBS/CAP axes',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'Check consistency',
        description: 'Review the strategy before validation',
        prompt: 'Check the consistency of this CBS/CAP before validation',
      },
      {
        icon: <Zap size={16} />,
        title: 'Summarize strategy',
        description: 'A 1-minute summary of the 5 axes',
        prompt: 'Summarize the CBS/CAP strategy for this client',
      },
    ],
  },
  pipeline: {
    kpis: [
      {
        label: 'Active Deals',
        value: '23',
        status: 'good',
      },
      {
        label: 'Total Volume',
        value: '€2.3B',
        status: 'good',
      },
      {
        label: 'Q3 Forecast',
        value: '€850M',
        status: 'neutral',
      },
    ],
    actions: [
      {
        icon: <TrendingUp size={16} />,
        title: 'Pipeline Status',
        description: 'View deal stages',
        prompt: 'Summarize the pipeline status',
      },
      {
        icon: <AlertCircle size={16} />,
        title: 'At-Risk Deals',
        description: 'Deals needing attention',
        prompt: 'Which deals are at risk?',
      },
      {
        icon: <Zap size={16} />,
        title: 'Forecast',
        description: 'Quarter projection',
        prompt: 'What is the Q3 projection?',
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
  const currentItem = contextData?.currentItem || 'this context'

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
        <p className="text-2xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Key Indicators</p>
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
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{getSource(kpi.label)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div>
        <p className="text-2xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Actions for {currentItem}</p>
        <div className="space-y-2">
          {actions.map((action, idx) => {
            // Adapt the text to include the current context
            const adaptedTitle = currentItem && currentItem !== 'this context'
              ? `${action.title} - ${currentItem}`
              : action.title
            const adaptedPrompt = currentItem && currentItem !== 'this context'
              ? action.prompt.replace(/this client|this context/gi, currentItem)
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

      <p className="flex items-start gap-1 text-[10px] text-slate-400 leading-relaxed">
        <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" />
        AI-assisted suggestions — verify before acting.
      </p>
    </div>
  )
}
