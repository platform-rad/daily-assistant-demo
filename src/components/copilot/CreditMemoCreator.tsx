import { useState } from 'react'
import { ChevronRight, Search, Upload, X, FileIcon } from 'lucide-react'

type Step = 'client-select' | 'data-review' | 'document-upload' | 'summary'

interface UploadedDocument {
  name: string
  size: string
}

export function CreditMemoCreator({
  onComplete,
  onCancel,
}: {
  onComplete: () => void
  onCancel: () => void
}) {
  const [currentStep, setCurrentStep] = useState<Step>('client-select')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState('Financial Services Inc')
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null)

  // Préchargé données pour Financial Services Inc
  const [clientData, setClientData] = useState({
    name: 'Financial Services Inc',
    sector: 'Finance',
    rating: 'A-',
    exposure: '€15.2M',
    status: 'Active',
  })

  const clients = [
    { name: 'TechCorp France', sector: 'Technology', rating: 'BBB+' },
    { name: 'Manufacturing Ltd', sector: 'Manufacturing', rating: 'BBB-' },
    { name: 'Financial Services Inc', sector: 'Finance', rating: 'A-' },
  ]

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNextStep = () => {
    const steps: Step[] = ['client-select', 'data-review', 'document-upload', 'summary']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handlePreviousStep = () => {
    const steps: Step[] = ['client-select', 'data-review', 'document-upload', 'summary']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSelectClient = (clientName: string) => {
    setSelectedClient(clientName)
    // Charger les données du client sélectionné
    if (clientName === 'Financial Services Inc') {
      setClientData({
        name: 'Financial Services Inc',
        sector: 'Finance',
        rating: 'A-',
        exposure: '€15.2M',
        status: 'Active',
      })
    } else if (clientName === 'TechCorp France') {
      setClientData({
        name: 'TechCorp France',
        sector: 'Technology',
        rating: 'BBB+',
        exposure: '€10.0M',
        status: 'Active',
      })
    } else {
      setClientData({
        name: 'Manufacturing Ltd',
        sector: 'Manufacturing',
        rating: 'BBB-',
        exposure: '€8.5M',
        status: 'Active',
      })
    }
  }

  const simulateDocUpload = () => {
    setUploadedDoc({
      name: 'Financial_Analysis_2026.pdf',
      size: '2.4 MB',
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-transparent">
        <h2 className="text-lg font-bold text-slate-900 mb-3">Créer un Credit Memo</h2>
        <div className="flex items-center gap-2 text-xs">
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'client-select' || ['data-review', 'document-upload', 'summary'].includes(currentStep) ? 'bg-purple-500' : 'bg-slate-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'data-review' || ['document-upload', 'summary'].includes(currentStep) ? 'bg-purple-500' : 'bg-slate-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'document-upload' || currentStep === 'summary' ? 'bg-purple-500' : 'bg-slate-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep === 'summary' ? 'bg-purple-500' : 'bg-slate-200'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Step 1: Client Selection */}
        {currentStep === 'client-select' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              {filteredClients.map((client) => (
                <button
                  key={client.name}
                  onClick={() => handleSelectClient(client.name)}
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

        {/* Step 2: Data Review & Edit */}
        {currentStep === 'data-review' && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-4">Données pour {selectedClient}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Nom du client</label>
                  <input
                    type="text"
                    value={clientData.name}
                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Secteur</label>
                    <input
                      type="text"
                      value={clientData.sector}
                      onChange={(e) => setClientData({ ...clientData, sector: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Rating</label>
                    <input
                      type="text"
                      value={clientData.rating}
                      onChange={(e) => setClientData({ ...clientData, rating: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Exposition</label>
                    <input
                      type="text"
                      value={clientData.exposure}
                      onChange={(e) => setClientData({ ...clientData, exposure: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Statut</label>
                    <input
                      type="text"
                      value={clientData.status}
                      onChange={(e) => setClientData({ ...clientData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 'document-upload' && (
          <div className="space-y-4">
            {!uploadedDoc ? (
              <>
                <p className="text-sm text-slate-600">
                  Ajoutez un document pour que l'IA l'analyse (optionnel):
                </p>
                <button
                  onClick={simulateDocUpload}
                  className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-purple-400 hover:bg-purple-50 transition flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload size={24} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Glissez-déposez ou cliquez</span>
                  <span className="text-xs text-slate-500">PDF, Word, Excel</span>
                </button>
              </>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FileIcon size={24} className="text-emerald-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 text-sm">{uploadedDoc.name}</p>
                    <p className="text-xs text-slate-500">{uploadedDoc.size}</p>
                  </div>
                  <button
                    onClick={() => setUploadedDoc(null)}
                    className="p-1 hover:bg-emerald-100 rounded transition flex-shrink-0"
                  >
                    <X size={18} className="text-emerald-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Summary */}
        {currentStep === 'summary' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-slate-900">Résumé du Credit Memo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Client:</span>
                  <span className="font-medium text-slate-900">{clientData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Secteur:</span>
                  <span className="font-medium text-slate-900">{clientData.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rating:</span>
                  <span className="font-medium text-slate-900">{clientData.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Exposition:</span>
                  <span className="font-medium text-slate-900">{clientData.exposure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Statut:</span>
                  <span className="font-medium text-slate-900">{clientData.status}</span>
                </div>
                {uploadedDoc && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Document:</span>
                    <span className="font-medium text-slate-900">{uploadedDoc.name}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600">
              ✓ Vous êtes prêt à créer le Credit Memo. L'IA analysera toutes les données et générera un document complet.
            </p>
          </div>
        )}
      </div>

      {/* Footer - Actions */}
      <div className="border-t border-slate-200 bg-white px-6 py-3 flex gap-2 flex-wrap">
        {currentStep !== 'client-select' && (
          <button
            onClick={handlePreviousStep}
            className="px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-sm"
          >
            Précédent
          </button>
        )}

        {currentStep !== 'summary' && (
          <button
            onClick={handleNextStep}
            className="px-3 py-1.5 rounded bg-purple-600 text-white hover:bg-purple-700 transition text-sm flex items-center gap-1"
          >
            Suivant
            <ChevronRight size={14} />
          </button>
        )}

        {currentStep === 'summary' && (
          <button
            onClick={onComplete}
            className="px-3 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition text-sm"
          >
            Créer le memo
          </button>
        )}

        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 transition text-sm ml-auto"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
