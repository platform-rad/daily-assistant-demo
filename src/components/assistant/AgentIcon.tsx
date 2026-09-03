import {
  AlertTriangle,
  CalendarClock,
  Compass,
  Copy,
  Crosshair,
  FileSpreadsheet,
  FileText,
  PhoneCall,
  Presentation,
  Radar,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = {
  Radar,
  PhoneCall,
  AlertTriangle,
  Crosshair,
  Search,
  Copy,
  CalendarClock,
  FileSpreadsheet,
  Compass,
  FileText,
  Presentation,
  Sparkles,
}

export function AgentIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles
  return <Icon className={cn('size-4', className)} />
}
