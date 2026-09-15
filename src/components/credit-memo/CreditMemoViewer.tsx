import { Edit2, Save, X } from 'lucide-react'
import { useState } from 'react'

interface CreditMemoViewerProps {
  clientName: string
  onClose: () => void
}

interface MemoSection {
  id: string
  title: string
  content: string
  editable: boolean
}

export function CreditMemoViewer({ clientName, onClose }: CreditMemoViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [sections, setSections] = useState<MemoSection[]>([
    {
      id: 'header',
      title: 'En-tête',
      content: `CRÉDIT MEMO - ${clientName}
Date: 2026-09-15
Période de revue: Q3 2026
Analyste: Claude AI Assistant`,
      editable: true,
    },
    {
      id: 'executive',
      title: 'Executive Summary',
      content: `${clientName} est un client corporate de qualité BBB+ avec une exposition de €10.0M.

Points clés:
• Rating stable depuis 24 mois
• Leverage ratio sain à 2.1x
• Facilities à 25% d'utilisation
• Aucune violation de covenant

Recommandation: RENOUVELER les facilities existantes`,
      editable: true,
    },
    {
      id: 'analysis',
      title: 'Analyse Financière',
      content: `Données financières (2025):
• Revenue: €1.2B
• EBITDA: €280M
• Leverage: 2.1x (bien-géré)
• Interest Coverage: 4.5x (sain)
• Liquidity: Sufficient

Évolution vs 2024:
• Revenue: +3.2%
• EBITDA: +2.8%
• Leverage: Stable`,
      editable: true,
    },
    {
      id: 'risks',
      title: 'Analyse des Risques',
      content: `Risques identifiés:
1. Exposition au secteur Technology (volatilité)
2. Taille d'exposition acceptable (€10M)
3. Rating stable (BBB+)

Mitigations:
• Monitoring mensuel
• Covenants stricts
• Diversification secteur`,
      editable: true,
    },
    {
      id: 'recommendation',
      title: 'Recommandation',
      content: `RENOUVELER - Excellent client de qualité investment-grade

Actions:
1. Reconduire les facilities actuelles
2. Revoir pricing annuellement
3. Maintenir monitoring mensuel
4. Prévoir review annuelle

Statut: À discuter avec le client`,
      editable: true,
    },
  ])

  const handleSectionChange = (id: string, newContent: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content: newContent } : s))
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Credit Memo Builder</h2>
          <p className="text-sm text-slate-500 mt-1">Pour {clientName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg transition ${
              isEditing
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={isEditing ? 'Voir' : 'Éditer'}
          >
            <Edit2 size={18} />
          </button>
          {isEditing && (
            <button
              onClick={() => console.log('Sauvegarder le memo')}
              className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
              title="Sauvegarder"
            >
              <Save size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {sections.map((section) => (
          <section key={section.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
              {section.title}
            </h3>
            {isEditing && section.editable ? (
              <textarea
                value={section.content}
                onChange={(e) => handleSectionChange(section.id, e.target.value)}
                className="w-full h-24 p-3 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
              />
            ) : (
              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {section.content}
              </div>
            )}
          </section>
        ))}

        {/* Actions */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-sm font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition">
              Générer PDF
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
              Partager avec client
            </button>
            <button className="w-full px-4 py-2 text-sm font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
              Valider et sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
