import { Edit2, X, Download, Printer } from 'lucide-react'
import { useState } from 'react'
import type { Section } from './types'
import { SectionStatus as SectionStatusEnum } from './types'
import { SectionAccordion } from './SectionAccordion'
import { ProgressBar } from './ProgressBar'

interface CreditMemoViewerProps {
  clientName: string
  onClose: () => void
  onAskAI?: (sectionId: string) => void
}

export function CreditMemoViewer({ clientName, onClose, onAskAI }: CreditMemoViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [sections, setSections] = useState<Section[]>(initializeSections())
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']))

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const approveSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, status: SectionStatusEnum.Approved } : s))
    )
  }

  const clearSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, blocks: [], status: SectionStatusEnum.WaitingGeneration } : s))
    )
  }

  const updateBlockContent = (sectionId: string, blockId: string, newData: any) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, data: newData } : b)),
              status: SectionStatusEnum.Altered,
            }
          : s
      )
    )
  }

  const completedCount = sections.filter((s) => s.status === SectionStatusEnum.Approved || s.status === SectionStatusEnum.Validated).length
  const overallProgress = (completedCount / sections.length) * 100

  const handleExportPDF = () => {
    console.log('Exporting to PDF...')
    // Dans une vraie implémentation, utiliser une librairie comme jsPDF
    alert('PDF export feature coming soon')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Credit Memo</h2>
            <p className="text-sm text-slate-500 mt-1">Pour {clientName}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg transition ${isEditing ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              title={isEditing ? 'Voir' : 'Éditer'}
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleExportPDF}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              title="Export PDF"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              title="Print"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
              title="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar completed={completedCount} total={sections.length} progress={overallProgress} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {sections.map((section) => (
          <SectionAccordion
            key={section.id}
            section={section}
            isExpanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            isEditing={isEditing}
            onApprove={() => approveSection(section.id)}
            onClear={() => clearSection(section.id)}
            onAskAI={() => onAskAI?.(section.id)}
            onUpdateBlock={(blockId, newData) => updateBlockContent(section.id, blockId, newData)}
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex gap-2">
        <button className="flex-1 px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition">
          Générer PDF
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
          Partager avec client
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
          Valider et sauvegarder
        </button>
      </div>
    </div>
  )
}

// Initialize sections with sample data
function initializeSections(): Section[] {
  return [
    {
      id: '1',
      parentId: null,
      title: 'Informations Générales',
      order: 1,
      status: SectionStatusEnum.Approved,
      blocks: [
        {
          id: 'b1-1',
          type: 'text',
          order: 1,
          data: {
            markdown:
              '**Client:** TechCorp France\n**Date:** 2026-09-15\n**Analyste:** Claude AI Assistant\n**Période de revue:** Q3 2026',
          },
        },
      ],
      aiBlocks: [],
      pendingAiBlocks: null,
      contentVersion: 1,
      lastUpdatedAt: '2026-09-15T10:00:00Z',
      agentName: 'CreditAnalysisAgent',
      subsections: [],
    },
    {
      id: '2',
      parentId: null,
      title: 'Executive Summary',
      order: 2,
      status: SectionStatusEnum.Preview,
      blocks: [
        {
          id: 'b2-1',
          type: 'text',
          order: 1,
          data: {
            markdown:
              'TechCorp France est un client corporate de qualité **BBB+** avec une exposition de **€10.0M**.\n\n**Faits clés:**\n- Rating stable depuis 24 mois\n- Leverage ratio sain à 2.1x\n- Facilities à 25% d\'utilisation\n- Aucune violation de covenant\n\n**Recommandation:** RENOUVELER les facilities existantes',
          },
        },
      ],
      aiBlocks: [],
      pendingAiBlocks: null,
      contentVersion: 1,
      lastUpdatedAt: '2026-09-15T10:05:00Z',
      agentName: 'ExecutiveSummaryAgent',
      subsections: [],
    },
    {
      id: '3',
      parentId: null,
      title: 'Analyse Financière',
      order: 3,
      status: SectionStatusEnum.Altered,
      blocks: [
        {
          id: 'b3-1',
          type: 'table',
          order: 1,
          data: {
            columns: ['Métrique', '2025', '2024', 'Variation'],
            rows: [
              { Métrique: 'Revenue', '2025': '€1.2B', '2024': '€1.16B', Variation: '+3.2%' },
              { Métrique: 'EBITDA', '2025': '€280M', '2024': '€272M', Variation: '+2.8%' },
              { Métrique: 'Leverage', '2025': '2.1x', '2024': '2.1x', Variation: 'Stable' },
              { Métrique: 'Interest Coverage', '2025': '4.5x', '2024': '4.3x', Variation: '+0.2x' },
            ],
            caption: 'Données financières consolidées',
          },
        },
      ],
      aiBlocks: [],
      pendingAiBlocks: null,
      contentVersion: 1,
      lastUpdatedAt: '2026-09-15T10:10:00Z',
      agentName: 'FinancialAnalysisAgent',
      subsections: [],
    },
    {
      id: '4',
      parentId: null,
      title: 'Analyse des Risques',
      order: 4,
      status: SectionStatusEnum.WaitingGeneration,
      blocks: [],
      aiBlocks: [],
      pendingAiBlocks: null,
      contentVersion: 0,
      lastUpdatedAt: null,
      agentName: 'RiskAnalysisAgent',
      subsections: [],
    },
    {
      id: '5',
      parentId: null,
      title: 'Recommandations',
      order: 5,
      status: SectionStatusEnum.Generating,
      blocks: [],
      aiBlocks: [],
      pendingAiBlocks: null,
      contentVersion: 0,
      lastUpdatedAt: null,
      agentName: 'RecommendationAgent',
      subsections: [],
    },
  ]
}
