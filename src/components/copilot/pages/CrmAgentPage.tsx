import { Mic, CheckCircle2, Upload, FileAudio } from 'lucide-react'

interface CrmAgentPageProps {
  onOpenMeena?: () => void
  isCompact?: boolean
}

const FEATURES = [
  { icon: <FileAudio size={14} />, text: 'Enregistrement vocal de la réunion' },
  { icon: <CheckCircle2 size={14} />, text: 'Transcription et extraction des actions' },
  { icon: <Upload size={14} />, text: 'Synchronisation automatique avec CRM+' },
]

/** Page dédiée dans le sidepanel assistant — lance l'agent Meena (notes de réunion). */
export function CrmAgentPage({ onOpenMeena, isCompact = true }: CrmAgentPageProps) {
  const titleSize = isCompact ? 'text-sm font-bold' : 'text-lg font-bold'

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className={`${isCompact ? 'px-3 py-3' : 'px-4 py-5'} space-y-4`}>
        <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50/60 to-transparent p-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Mic size={16} className="text-amber-600" />
            </div>
            <div>
              <h2 className={`${titleSize} text-slate-900`}>CRM+ Agent · Meena</h2>
            </div>
          </div>
          <p className="text-2xs text-slate-600 leading-relaxed">
            Rédigez vos notes de réunion à la voix : Meena transcrit, extrait les actions et
            synchronise le tout avec CRM+ automatiquement.
          </p>
        </div>

        <div className="space-y-1.5">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-amber-600 flex-shrink-0">{f.icon}</span>
              <span className="text-2xs text-slate-700">{f.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onOpenMeena?.()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition"
        >
          <Mic size={16} />
          Ouvrir Meena
        </button>
      </div>
    </div>
  )
}
