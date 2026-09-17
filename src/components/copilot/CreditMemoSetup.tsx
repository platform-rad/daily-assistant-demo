import { useState } from 'react'
import { ChevronRight, FileUp, AlertCircle, CheckCircle } from 'lucide-react'

interface CreditMemoSetupProps {
  onComplete: () => void
  onCancel: () => void
}

type SetupStep = 'client-select' | 'data-review' | 'document-upload' | 'confirmation'

export function CreditMemoSetup({ onComplete, onCancel }: CreditMemoSetupProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>('client-select')
  const [selectedClient, setSelectedClient] = useState('TechCorp France')
  const [documentUploaded, setDocumentUploaded] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const clients = [
    { id: 'techcorp', name: 'TechCorp France', sector: 'Technology', rating: 'BBB+' },
    { id: 'manufacturing', name: 'Manufacturing Ltd', sector: 'Manufacturing', rating: 'BBB-' },
    { id: 'financial', name: 'Financial Services Inc', sector: 'Finance', rating: 'A-' },
  ]

  const handleNextStep = () => {
    const steps: SetupStep[] = ['client-select', 'data-review', 'document-upload', 'confirmation']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handlePreviousStep = () => {
    const steps: SetupStep[] = ['client-select', 'data-review', 'document-upload', 'confirmation']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Progress Bar */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-transparent">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">
          Créer un Credit Memo
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'client-select' || ['data-review', 'document-upload', 'confirmation'].includes(currentStep) ? 'bg-purple-500' : 'bg-slate-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'data-review' || ['document-upload', 'confirmation'].includes(currentStep) ? 'bg-purple-500' : 'bg-slate-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'document-upload' || currentStep === 'confirmation' ? 'bg-purple-500' : 'bg-slate-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'confirmation' ? 'bg-purple-500' : 'bg-slate-200'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {currentStep === 'client-select' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 mb-4">Sélectionnez le client pour lequel créer le memo:</p>
            <div className="space-y-2">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.name)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition ${
                    selectedClient === client.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="font-medium text-slate-900">{client.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{client.sector} • Rating: {client.rating}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'data-review' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Données préchargées pour {selectedClient}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Informations financières</p>
                    <p className="text-xs text-slate-600">Revenue, EBITDA, ratios financiers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Profil de risque</p>
                    <p className="text-xs text-slate-600">Rating, covenants, historique</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Exposition de crédit</p>
                    <p className="text-xs text-slate-600">Facilities, montants, conditions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'document-upload' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Vous pouvez ajouter un document pour que l'IA l'analyse dans le mémo (optionnel):
            </p>
            <button className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 transition flex flex-col items-center gap-2 cursor-pointer">
              <FileUp size={24} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Glissez-déposez ou cliquez pour ajouter</span>
              <span className="text-xs text-slate-500">PDF, Word, Excel</span>
            </button>

            {documentUploaded && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" />
                <span className="text-sm text-emerald-900">Document chargé avec succès</span>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={documentUploaded}
                onChange={(e) => setDocumentUploaded(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-600">J'ai ajouté un document à analyser</span>
            </label>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-slate-900">Résumé</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-600">Client:</p>
                  <p className="font-medium text-slate-900">{selectedClient}</p>
                </div>
                {documentUploaded && (
                  <div>
                    <p className="text-slate-600">Document analysé:</p>
                    <p className="font-medium text-slate-900">Document_credit_analysis.pdf</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-slate-900">Prochaine étape</p>
                  <p className="text-slate-600 mt-1">
                    L'IA va analyser les données et générer un Credit Memo complet avec recommandations.
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-600">Je confirme et accepte de créer le memo</span>
            </label>
          </div>
        )}
      </div>

      {/* Footer - Actions */}
      <div className="border-t border-slate-200 bg-white p-4 flex gap-2">
        {currentStep !== 'client-select' && (
          <button
            onClick={handlePreviousStep}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium text-sm"
          >
            Précédent
          </button>
        )}

        {currentStep !== 'confirmation' && (
          <button
            onClick={handleNextStep}
            className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            Suivant
            <ChevronRight size={16} />
          </button>
        )}

        {currentStep === 'confirmation' && (
          <button
            onClick={onComplete}
            disabled={!confirmed}
            className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Créer le memo
          </button>
        )}

        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition font-medium text-sm"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
