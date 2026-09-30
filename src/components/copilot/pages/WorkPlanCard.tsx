export interface WorkPlanCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onSelect: () => void
  isCompact?: boolean
  accent: 'purple' | 'amber'
}

export const WORK_PLAN_ACCENTS = {
  purple: {
    border: 'hover:border-purple-300',
    bg: 'hover:bg-purple-50/30',
    iconBg: 'bg-purple-100 group-hover:bg-purple-200',
    iconColor: 'text-purple-600',
    title: 'group-hover:text-purple-700',
  },
  amber: {
    border: 'hover:border-amber-300',
    bg: 'hover:bg-amber-50/30',
    iconBg: 'bg-amber-100 group-hover:bg-amber-200',
    iconColor: 'text-amber-600',
    title: 'group-hover:text-amber-700',
  },
} as const

export function WorkPlanCard({ title, description, icon, onSelect, isCompact = false, accent }: WorkPlanCardProps) {
  const cardPadding = isCompact ? 'p-2' : 'p-4'
  const iconPadding = isCompact ? 'p-1' : 'p-2'
  const titleSize = isCompact ? 'text-2xs font-semibold' : 'text-sm font-semibold'
  const descSize = isCompact ? 'text-2xs' : 'text-xs'
  const tone = WORK_PLAN_ACCENTS[accent]

  return (
    <button
      onClick={onSelect}
      className={`${cardPadding} rounded-lg border border-slate-200 bg-white ${tone.border} hover:shadow-md ${tone.bg} transition group text-left`}
    >
      <div className={`${iconPadding} rounded-lg ${tone.iconBg} transition flex-shrink-0 inline-flex mb-0.5`}>
        <span className={tone.iconColor}>{icon}</span>
      </div>
      <h3 className={`${titleSize} text-slate-900 ${tone.title} transition`}>{title}</h3>
      <p className={`${descSize} text-slate-600 ${isCompact ? 'mt-0.5' : 'mt-1'} line-clamp-2`}>{description}</p>
    </button>
  )
}
