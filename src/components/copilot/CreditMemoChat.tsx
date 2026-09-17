import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CopilotMessage } from '@/data/orchestrator'

interface CreditMemoChatProps {
  selectedContent?: string
}

export function CreditMemoChat({ selectedContent }: CreditMemoChatProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Bonjour! Je suis votre assistant pour la création du Credit Memo. Je peux vous aider à compléter les données et analyser les documents. Comment puis-je vous assister?',
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState('')
  const [selectedField, setSelectedField] = useState<string | null>(selectedContent || null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (selectedContent) {
      setSelectedField(selectedContent)
    }
  }, [selectedContent])

  const creditMemoSuggestions = [
    '💼 Analyser les risques du client',
    '📊 Extraire les données financières',
    '🔍 Vérifier la cohérence des données',
    '📄 Générer les recommandations',
    '✅ Valider les informations',
    '🎯 Suggérer les termes du facility',
  ]

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    setTimeout(() => {
      const responses: { [key: string]: string } = {
        'risques': 'Basé sur l\'analyse du client Financial Services Inc (Rating A-, Exposure €15.2M), les risques identifiés sont: (1) Exposition sectorielle élevée au secteur Finance, (2) Volatilité des taux, (3) Concentration géographique. Les mitigation measures recommandées incluent des covenants stricts et un suivi mensuel.',
        'données': 'Les données financières extraites du document source sont: Revenue €450M (2025), EBITDA €125M, Leverage Ratio 2.8x, Interest Coverage 5.2x. Ces métriques positionnent le client en catégorie investment-grade.',
        'cohérence': '✓ Les données sont cohérentes. Rating A- align avec les métriques financières. Exposition de €15.2M est proportionnée par rapport à la taille du groupe. Aucune incohérence détectée.',
        'recommandations': 'Recommendations: (1) Facility amount €12M, (2) Tenor 3 years, (3) Security: first ranking pledge, (4) Covenants: Financial (Leverage <3.5x, Interest Coverage >4x), (5) Pricing: SOFR + 175bps.',
        'valider': '✓ Tous les champs obligatoires sont complétés et validés. Données approuvées pour la création du Credit Memo final.',
        'termes': 'Termes suggérés du facility: Revolving Facility de €12M, Secured, 3-year tenor, SOFR + 175bps, avec covenants financiers et operationnels standards.',
      }

      let response = 'Je peux vous aider avec ça. Pouvez-vous être plus spécifique?'
      for (const [key, value] of Object.entries(responses)) {
        if (input.toLowerCase().includes(key)) {
          response = value
          break
        }
      }

      const assistantMessage: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-lg shadow-rad-lg">
      {/* Header - Focused on Credit Memo */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-purple-50 to-transparent px-4 py-3">
        <h1 className="text-sm font-semibold text-slate-900">Création Credit Memo</h1>
        <p className="text-2xs mt-1 text-slate-600">Assistez-vous avec l'IA pour compléter les données</p>
        {selectedField && (
          <div className="mt-2 inline-block px-2 py-1 bg-purple-100 rounded text-2xs text-purple-700">
            Champ sélectionné: <span className="font-semibold">{selectedField}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length <= 1 ? (
          <div className="flex flex-col items-start justify-start h-full space-y-4 pb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Suggestions pour le Credit Memo</h2>
              <p className="text-2xs text-slate-500 mt-0.5">Cliquez sur une suggestion ou tapez votre question</p>
            </div>
            <div className="space-y-2 w-full">
              {creditMemoSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2.5 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition text-xs text-slate-700 hover:text-slate-900 font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-sm rounded-lg px-3 py-2 text-xs ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input - Composer style */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-2.5 py-2.5">
        <div className="flex gap-1.5">
          <div className="relative flex-1">
            <Sparkles className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-purple-600" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Demandez à l'IA..."
              className="h-9 w-full rounded border border-slate-200 bg-white pl-8 pr-2.5 text-xs focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            size="sm"
            className="h-9 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
