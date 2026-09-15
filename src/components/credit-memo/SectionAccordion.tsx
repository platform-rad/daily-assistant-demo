import { ChevronDown, Brain, MoreVertical, CheckCircle, Trash2, Loader } from 'lucide-react'
import { useState } from 'react'
import type { Section } from './types'
import { SectionStatus } from './types'
import { StatusBadge } from './StatusBadge'
import { ContentBlockComponent } from './ContentBlockComponent'

interface SectionAccordionProps {
  section: Section
  isExpanded: boolean
  onToggle: () => void
  isEditing: boolean
  onApprove: () => void
  onClear: () => void
  onAskAI: () => void
  onUpdateBlock: (blockId: string, newData: any) => void
}

export function SectionAccordion({
  section,
  isExpanded,
  onToggle,
  isEditing,
  onApprove,
  onClear,
  onAskAI,
  onUpdateBlock,
}: SectionAccordionProps) {
  const [menuOpen, setMenuOpen] = useState(false)


  return (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ChevronDown
            size={20}
            className={`text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 text-left">{section.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={section.status} size="sm" />

          {/* Section Actions */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(!menuOpen)
              }}
              className="p-1.5 hover:bg-slate-100 rounded transition"
              title="Actions"
            >
              <MoreVertical size={16} className="text-slate-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAskAI()
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-200"
                >
                  <Brain size={14} /> Ask AI
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onApprove()
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-200"
                >
                  <CheckCircle size={14} /> Approuver
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClear()
                    setMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Nettoyer
                </button>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <>
          <div className="border-t border-slate-200 px-4 py-4 bg-slate-50 space-y-4">
            {/* AI Blocks (pending) */}
            {section.pendingAiBlocks && section.pendingAiBlocks.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-xs font-medium text-yellow-800 mb-2">Changements proposés par l'IA:</p>
                <div className="space-y-2">
                  {section.pendingAiBlocks.map((block) => (
                    <ContentBlockComponent
                      key={block.id}
                      block={block}
                      isEditing={false}
                    />
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                    Accepter
                  </button>
                  <button className="text-xs px-3 py-1 bg-slate-300 text-slate-700 rounded hover:bg-slate-400">
                    Rejeter
                  </button>
                </div>
              </div>
            )}

            {/* Generating state */}
            {section.status === SectionStatus.Generating && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader size={16} className="animate-spin" />
                <span className="text-sm">Génération en cours...</span>
              </div>
            )}

            {/* Current blocks */}
            {section.blocks.length > 0 ? (
              <div className="space-y-3">
                {section.blocks.map((block) => (
                  <ContentBlockComponent
                    key={block.id}
                    block={block}
                    isEditing={isEditing}
                    onUpdate={onUpdateBlock}
                  />
                ))}
              </div>
            ) : section.status === SectionStatus.WaitingGeneration ? (
              <div className="text-center text-slate-500 text-sm py-6">
                <p>Cette section est en attente de génération</p>
                <button
                  onClick={onAskAI}
                  className="mt-2 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Demander à l'IA
                </button>
              </div>
            ) : (
              <div className="text-center text-slate-400 text-sm py-4">Aucun contenu</div>
            )}
          </div>

          {/* Footer Info */}
          {section.lastUpdatedAt && (
            <div className="border-t border-slate-200 px-4 py-2 bg-white text-xs text-slate-500">
              {section.agentName && <span className="font-medium">{section.agentName}</span>} · Dernière mise à jour:{' '}
              {new Date(section.lastUpdatedAt).toLocaleString('fr-FR')}
            </div>
          )}
        </>
      )}
    </div>
  )
}
