import { useState } from 'react'
import { ChevronRight, Search, Upload, X, FileIcon, Focus, RotateCcw, Plus, Trash2 } from 'lucide-react'

type Step = 'client-select' | 'data-review' | 'document-upload' | 'summary'

interface UploadedDocument {
  name: string
  size: string
}

interface DataField {
  id: string
  label: string
  value: string
  originalValue: string
  isModified: boolean
  sourceDocument?: string
}

const AVAILABLE_FIELDS = [
  { id: 'contact_person', label: 'Personne Contact' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'address', label: 'Adresse' },
  { id: 'ceo', label: 'PDG' },
  { id: 'employees', label: 'Nombre d\'employés' },
  { id: 'revenue_2025', label: 'Revenue 2025' },
  { id: 'ebitda_2025', label: 'EBITDA 2025' },
  { id: 'debt_level', label: 'Niveau de dette' },
  { id: 'currency', label: 'Devise' },
]

export function CreditMemoCreator({
  onComplete,
  onCancel,
  onSelectField,
  onViewSourceDocument,
}: {
  onComplete: () => void
  onCancel: () => void
  onSelectField?: (fieldName: string | null) => void
  onViewSourceDocument?: (fieldName: string, source: string) => void
}) {
  const [currentStep, setCurrentStep] = useState<Step>('client-select')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState('Financial Services Inc')
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null)
  const [showAddFieldDropdown, setShowAddFieldDropdown] = useState(false)

  // Préchargé données pour Financial Services Inc avec tracking AI
  const [dataFields, setDataFields] = useState<DataField[]>([
    {
      id: 'name',
      label: 'Nom du client',
      value: 'Financial Services Inc',
      originalValue: 'Financial Services Inc',
      isModified: false,
      sourceDocument: 'D2024-FS-001.pdf - Section Company Overview',
    },
    {
      id: 'sector',
      label: 'Secteur',
      value: 'Finance',
      originalValue: 'Finance',
      isModified: false,
      sourceDocument: 'Classification_Master.xlsx - Sector Mapping',
    },
    {
      id: 'rating',
      label: 'Rating',
      value: 'A-',
      originalValue: 'A-',
      isModified: false,
      sourceDocument: 'S&P_Rating_Report_2026.pdf - Page 12',
    },
    {
      id: 'exposure',
      label: 'Exposition',
      value: '€15.2M',
      originalValue: '€15.2M',
      isModified: false,
      sourceDocument: 'Portfolio_Extract_Q3_2026.xlsx - Client Exposure',
    },
    {
      id: 'status',
      label: 'Statut',
      value: 'Active',
      originalValue: 'Active',
      isModified: false,
      sourceDocument: 'Client_Master_Data.db - Status Table',
    },
  ])

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
    const clientDataMap: { [key: string]: DataField[] } = {
      'Financial Services Inc': [
        {
          id: 'name',
          label: 'Nom du client',
          value: 'Financial Services Inc',
          originalValue: 'Financial Services Inc',
          isModified: false,
          sourceDocument: 'D2024-FS-001.pdf - Section Company Overview',
        },
        {
          id: 'sector',
          label: 'Secteur',
          value: 'Finance',
          originalValue: 'Finance',
          isModified: false,
          sourceDocument: 'Classification_Master.xlsx - Sector Mapping',
        },
        {
          id: 'rating',
          label: 'Rating',
          value: 'A-',
          originalValue: 'A-',
          isModified: false,
          sourceDocument: 'S&P_Rating_Report_2026.pdf - Page 12',
        },
        {
          id: 'exposure',
          label: 'Exposition',
          value: '€15.2M',
          originalValue: '€15.2M',
          isModified: false,
          sourceDocument: 'Portfolio_Extract_Q3_2026.xlsx - Client Exposure',
        },
        {
          id: 'status',
          label: 'Statut',
          value: 'Active',
          originalValue: 'Active',
          isModified: false,
          sourceDocument: 'Client_Master_Data.db - Status Table',
        },
      ],
      'TechCorp France': [
        {
          id: 'name',
          label: 'Nom du client',
          value: 'TechCorp France',
          originalValue: 'TechCorp France',
          isModified: false,
          sourceDocument: 'D2024-TC-042.pdf - Company Info',
        },
        {
          id: 'sector',
          label: 'Secteur',
          value: 'Technology',
          originalValue: 'Technology',
          isModified: false,
          sourceDocument: 'Sector_Classification.xlsx',
        },
        {
          id: 'rating',
          label: 'Rating',
          value: 'BBB+',
          originalValue: 'BBB+',
          isModified: false,
          sourceDocument: 'Moody_Rating_Report_2026.pdf',
        },
        {
          id: 'exposure',
          label: 'Exposition',
          value: '€10.0M',
          originalValue: '€10.0M',
          isModified: false,
          sourceDocument: 'Portfolio_Extract_Q3_2026.xlsx',
        },
        {
          id: 'status',
          label: 'Statut',
          value: 'Active',
          originalValue: 'Active',
          isModified: false,
          sourceDocument: 'Master_Data_Table.db',
        },
      ],
      'Manufacturing Ltd': [
        {
          id: 'name',
          label: 'Nom du client',
          value: 'Manufacturing Ltd',
          originalValue: 'Manufacturing Ltd',
          isModified: false,
          sourceDocument: 'D2024-MF-015.pdf',
        },
        {
          id: 'sector',
          label: 'Secteur',
          value: 'Manufacturing',
          originalValue: 'Manufacturing',
          isModified: false,
          sourceDocument: 'Sector_Classification.xlsx',
        },
        {
          id: 'rating',
          label: 'Rating',
          value: 'BBB-',
          originalValue: 'BBB-',
          isModified: false,
          sourceDocument: 'Fitch_Rating_Report_2026.pdf',
        },
        {
          id: 'exposure',
          label: 'Exposition',
          value: '€8.5M',
          originalValue: '€8.5M',
          isModified: false,
          sourceDocument: 'Portfolio_Extract_Q3_2026.xlsx',
        },
        {
          id: 'status',
          label: 'Statut',
          value: 'Active',
          originalValue: 'Active',
          isModified: false,
          sourceDocument: 'Master_Data_Table.db',
        },
      ],
    }
    setDataFields(clientDataMap[clientName] || clientDataMap['Financial Services Inc'])
  }

  const handleFieldChange = (fieldId: string, newValue: string) => {
    setDataFields(
      dataFields.map(field =>
        field.id === fieldId
          ? { ...field, value: newValue, isModified: newValue !== field.originalValue }
          : field
      )
    )
  }

  const handleResetField = (fieldId: string) => {
    setDataFields(
      dataFields.map(field =>
        field.id === fieldId
          ? { ...field, value: field.originalValue, isModified: false }
          : field
      )
    )
  }

  const handleAddField = (fieldTemplate: typeof AVAILABLE_FIELDS[0]) => {
    // Check if field already exists
    if (dataFields.some(f => f.id === fieldTemplate.id)) {
      return
    }
    const newId = fieldTemplate.id
    setDataFields([
      ...dataFields,
      {
        id: newId,
        label: fieldTemplate.label,
        value: '',
        originalValue: '',
        isModified: true,
        sourceDocument: undefined,
      },
    ])
    setShowAddFieldDropdown(false)
  }

  const getAvailableFields = () => {
    const existingIds = dataFields.map(f => f.id)
    return AVAILABLE_FIELDS.filter(f => !existingIds.includes(f.id))
  }

  const handleDeleteField = (fieldId: string) => {
    setDataFields(dataFields.filter(field => field.id !== fieldId))
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
          <div className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h3 className="font-semibold text-slate-900 mb-2.5 text-sm">Données pour {selectedClient}</h3>
              <div className="space-y-2">
                {dataFields.map((field) => (
                  <div
                    key={field.id}
                    className="relative p-2.5 rounded border border-transparent hover:border-purple-300 hover:bg-white transition cursor-pointer group"
                    onMouseEnter={() => onSelectField?.(field.label)}
                    onMouseLeave={() => onSelectField?.(null)}
                  >
                    <label className="text-xs font-medium text-slate-600 block mb-1 group-hover:text-purple-600 transition">{field.label}</label>
                    <div className="flex items-center gap-1.5">
                      {/* AI Source Indicator or Restart Button */}
                      {!field.isModified && field.sourceDocument ? (
                        <button
                          onClick={() => onViewSourceDocument?.(field.label, field.sourceDocument!)}
                          className="flex-shrink-0 p-1.5 rounded hover:bg-purple-200 transition"
                          title="Cliquez pour voir la source"
                        >
                          <Focus size={14} className="text-purple-600" />
                        </button>
                      ) : field.isModified ? (
                        <button
                          onClick={() => handleResetField(field.id)}
                          className="flex-shrink-0 p-1.5 rounded hover:bg-slate-300 transition"
                          title="Remettre la valeur d'origine"
                        >
                          <RotateCcw size={14} className="text-slate-600" />
                        </button>
                      ) : (
                        <div className="w-7" />
                      )}

                      {/* Input Field */}
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded border border-slate-200 text-xs focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500 group-hover:bg-purple-50 transition"
                      />

                      {/* Delete Button for Custom Fields */}
                      {!['name', 'sector', 'rating', 'exposure', 'status'].includes(field.id) && (
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="flex-shrink-0 p-1.5 rounded hover:bg-red-100 transition"
                          title="Supprimer le champ"
                        >
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Field Button with Dropdown */}
              <div className="mt-2.5 relative">
                <button
                  onClick={() => setShowAddFieldDropdown(!showAddFieldDropdown)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded border border-dashed border-purple-300 text-purple-600 hover:bg-purple-100 transition text-xs font-medium"
                >
                  <Plus size={14} />
                  Ajouter un champ
                </button>

                {/* Dropdown List */}
                {showAddFieldDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {getAvailableFields().length > 0 ? (
                      getAvailableFields().map((field) => (
                        <button
                          key={field.id}
                          onClick={() => handleAddField(field)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 transition border-b border-slate-100 last:border-b-0"
                        >
                          {field.label}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-500">Tous les champs sont ajoutés</div>
                    )}
                  </div>
                )}
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
                {dataFields.map((field) => (
                  <div key={field.id} className="flex justify-between">
                    <span className="text-slate-600">{field.label}:</span>
                    <span className="font-medium text-slate-900">{field.value}</span>
                  </div>
                ))}
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
