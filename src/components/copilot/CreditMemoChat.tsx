import { useState, useEffect } from 'react'
import { FileText, ArrowLeft } from 'lucide-react'

interface CreditMemoChatProps {
  selectedContent?: string
  sourceDocument?: {
    fieldName: string
    documentName: string
  } | null
  onCloseSourceDocument?: () => void
}

export function CreditMemoChat({ selectedContent, sourceDocument, onCloseSourceDocument }: CreditMemoChatProps) {
  const [selectedField, setSelectedField] = useState<string | null>(selectedContent || null)

  useEffect(() => {
    if (selectedContent) {
      setSelectedField(selectedContent)
    }
  }, [selectedContent])

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-transparent px-4 py-3 flex-shrink-0">
        <h1 className="text-sm font-semibold text-slate-900">Création Credit Memo</h1>
        <p className="text-2xs mt-1 text-slate-600">Visualisez les sources des données</p>
        {selectedField && (
          <div className="mt-2 inline-block px-2 py-1 bg-purple-100 rounded text-2xs text-purple-700">
            Champ sélectionné: <span className="font-semibold">{selectedField}</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {sourceDocument ? (
          // Document View
          <div className="space-y-3">
            <button
              onClick={onCloseSourceDocument}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-purple-600 hover:bg-purple-50 rounded transition mb-2"
            >
              <ArrowLeft size={14} />
              Retour
            </button>

            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-purple-600" />
              <div>
                <p className="text-xs font-semibold text-slate-900">{sourceDocument.fieldName}</p>
                <p className="text-2xs text-slate-600">{sourceDocument.documentName}</p>
              </div>
            </div>

            {/* Fake Document Preview */}
            <div className="bg-slate-100 rounded-lg overflow-hidden border border-slate-200 aspect-[3/4]">
              <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-4 space-y-2">
                {/* Document Header */}
                <div className="border-b border-slate-300 pb-2">
                  <p className="text-2xs font-bold text-slate-700">FINANCIAL SERVICES INC.</p>
                  <p className="text-2xs text-slate-600">Client Report - Q3 2026</p>
                </div>

                {/* Document Content Simulation */}
                <div className="space-y-1.5">
                  <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-300 rounded w-full"></div>
                  <div className="h-2 bg-slate-300 rounded w-5/6"></div>

                  <div className="pt-2 space-y-1">
                    <div className="h-2 bg-slate-400 rounded w-1/2"></div>
                    <div className="h-2 bg-slate-300 rounded w-2/3"></div>
                    <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <div className="h-2 bg-slate-300 rounded w-full"></div>
                    <div className="h-2 bg-slate-300 rounded w-5/6"></div>
                    <div className="h-2 bg-slate-400 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-2xs text-slate-500 text-center">Page 1 de 5</p>
                </div>
              </div>
            </div>

            <p className="text-2xs text-slate-600 mt-3">Cliquez sur les autres champs pour voir leurs sources</p>
          </div>
        ) : (
          // Default View - Suggestions
          <div className="flex flex-col items-start justify-start h-full space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Remplissez les champs</h2>
              <p className="text-2xs text-slate-600 mt-0.5">Cliquez sur le Focus icon pour voir les sources documentaires</p>
            </div>
            <div className="space-y-2 w-full text-2xs">
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <p className="font-medium text-slate-900">💡 Astuce</p>
                <p className="text-slate-700 mt-1">Survolez les champs à gauche pour les sélectionner</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-medium text-slate-900">👁️ Voir la source</p>
                <p className="text-slate-700 mt-1">Cliquez sur l'icon Focus (bleu violet) pour voir le document source</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <p className="font-medium text-slate-900">✏️ Éditer</p>
                <p className="text-slate-700 mt-1">Modifiez les valeurs. Un button Restart apparaîtra pour les restaurer</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
