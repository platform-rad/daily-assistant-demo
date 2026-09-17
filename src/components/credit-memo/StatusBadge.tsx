import type { SectionStatus } from './types'
import { SectionStatus as SectionStatusEnum } from './types'

interface StatusBadgeProps {
  status: SectionStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusColor = (status: SectionStatus) => {
    switch (status) {
      case SectionStatusEnum.WaitingGeneration:
        return 'bg-gray-100 text-gray-700 border border-gray-300'
      case SectionStatusEnum.Generating:
        return 'bg-blue-100 text-blue-700 border border-blue-300 animate-pulse'
      case SectionStatusEnum.Preview:
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300'
      case SectionStatusEnum.Altered:
        return 'bg-orange-100 text-orange-700 border border-orange-300'
      case SectionStatusEnum.Approved:
        return 'bg-green-100 text-green-700 border border-green-300'
      case SectionStatusEnum.Validated:
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300'
      case SectionStatusEnum.Error:
        return 'bg-red-100 text-red-700 border border-red-300'
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-300'
    }
  }

  const getStatusLabel = (status: SectionStatus) => {
    switch (status) {
      case SectionStatusEnum.WaitingGeneration:
        return 'En attente'
      case SectionStatusEnum.Generating:
        return 'Génération...'
      case SectionStatusEnum.Preview:
        return 'Aperçu'
      case SectionStatusEnum.Altered:
        return 'Modifié'
      case SectionStatusEnum.Approved:
        return 'Approuvé'
      case SectionStatusEnum.Validated:
        return 'Validé'
      case SectionStatusEnum.Error:
        return 'Erreur'
      default:
        return 'Inconnu'
    }
  }

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'

  return <span className={`rounded-full font-medium ${getStatusColor(status)} ${sizeClass}`}>{getStatusLabel(status)}</span>
}
