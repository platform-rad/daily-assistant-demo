import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CopilotMessage, OrchestratedAction } from '@/data/orchestrator'
import { ActionCard } from './ActionCard'
import { ToolPreview } from './ToolPreview'
import { SkillSuggestions } from './SkillSuggestions'
import { ContextualSuggestions } from './ContextualSuggestions'
import { CONTEXTUAL_RESPONSES } from '@/data/contextualResponses'

export interface CopilotChatProps {
  /** Mode d'affichage: standalone ou widget */
  mode?: 'standalone' | 'widget'
}

export function CopilotChat({ mode = 'standalone' }: CopilotChatProps) {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        'Bonjour! Je suis votre Copilot métier. Je peux vous aider à naviguer entre les systèmes et automatiser les tâches. Comment puis-je vous assister?',
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState('')
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null)
  const [detectedContext, setDetectedContext] = useState('myClientDev')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simuler la détection contextuelle
  useEffect(() => {
    const contexts = ['myClientDev', 'myCreditApp', 'dashboard', 'reporting']
    const interval = setInterval(() => {
      setDetectedContext(contexts[Math.floor(Math.random() * contexts.length)])
    }, 30000) // Changer tous les 30 secondes
    return () => clearInterval(interval)
  }, [])

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
      // Trouver la réponse contextuelle qui match le prompt
      const contextData = CONTEXTUAL_RESPONSES[detectedContext] || {}
      let contextualResponse = null

      // Chercher une réponse exacte ou approximative
      for (const [key, response] of Object.entries(contextData)) {
        if (key.toLowerCase().includes(input.toLowerCase().substring(0, 20)) ||
            input.toLowerCase().includes(key.toLowerCase().substring(0, 15))) {
          contextualResponse = response
          break
        }
      }

      // Si pas trouvée, utiliser la première réponse du contexte
      if (!contextualResponse) {
        const responses = Object.values(contextData)
        contextualResponse = responses.length > 0 ? responses[0] : null
      }

      if (contextualResponse) {
        const action: OrchestratedAction = {
          id: 'action-1',
          toolId: contextualResponse.toolsNeeded[0] === 'my-credit-app' ? 'my-credit-app' : 'my-client-dev',
          analysis: contextualResponse.analysis,
          summary: contextualResponse.summary,
          steps: contextualResponse.steps,
          status: 'pending',
        }

        const assistantMessage: CopilotMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: action.analysis,
          timestamp: new Date(),
          actions: [action],
        }

        setMessages((prev) => [...prev, assistantMessage])
      }
    }, 500)
  }

  const handleAuthorizeAction = (messageId: string, actionId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.actions) {
          return {
            ...msg,
            actions: msg.actions.map((a) =>
              a.id === actionId ? { ...a, status: 'authorized' as const } : a
            ),
          }
        }
        return msg
      })
    )

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId && msg.actions) {
            return {
              ...msg,
              actions: msg.actions.map((a) =>
                a.id === actionId
                  ? {
                      ...a,
                      status: 'executed' as const,
                      results: `✓ Opération complétée\n\nClient "TechCorp France" créé\nFacility de 10M EUR ajoutée\nLiaison effectuée`,
                    }
                  : a
              ),
            }
          }
          return msg
        })
      )

      const confirmMessage: CopilotMessage = {
        id: (Date.now() + 100).toString(),
        role: 'assistant',
        content:
          'Les opérations ont été complétées avec succès! Vous pouvez maintenant consulter les détails dans les systèmes ou éditer les informations.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, confirmMessage])
    }, 2000)
  }

  const handleOpenTool = (toolId: string) => {
    setSelectedToolId(toolId)
  }

  const handleSkillClick = (skill: string) => {
    setInput(skill)
    inputRef.current?.focus()
  }

  return (
    <div className={`flex h-full flex-col bg-white ${mode === 'widget' ? 'rounded-lg shadow-rad-lg' : ''}`}>
      {/* Header - RAD Indigo */}
      <div className={`border-b px-4 py-3 ${
        mode === 'widget'
          ? 'bg-gradient-to-r from-rad-indigo-600 to-rad-indigo-700 text-white border-rad-indigo-700'
          : 'bg-white border-slate-200'
      }`}>
        <h1 className={`text-sm font-semibold ${mode === 'widget' ? 'text-white' : 'text-slate-900'}`}>Daily Assistant</h1>
        <p className={`text-2xs mt-0.5 ${mode === 'widget' ? 'text-rad-indigo-100' : 'text-slate-500'}`}>
          {detectedContext === 'myClientDev' && '📊 MyClientDev'}
          {detectedContext === 'myCreditApp' && '💳 MyCreditApp'}
          {detectedContext === 'dashboard' && '📈 Dashboard'}
          {detectedContext === 'reporting' && '📑 Reporting'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length <= 1 ? (
          <div className="flex flex-col items-start justify-start h-full space-y-4 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Qu'y a-t-il pour vous?</h2>
              <p className="text-2xs text-slate-500 mt-1">Basé sur votre contexte actuel</p>
            </div>
            {mode === 'widget' ? (
              <ContextualSuggestions context={detectedContext} onActionClick={handleSkillClick} />
            ) : (
              <SkillSuggestions context={detectedContext} onSkillClick={handleSkillClick} />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-sm rounded-lg px-3 py-2 text-xs ${
                    message.role === 'user'
                      ? 'bg-rad-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>

                  {message.actions && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action) => (
                        <ActionCard
                          key={action.id}
                          action={action}
                          onAuthorize={() => handleAuthorizeAction(message.id, action.id)}
                          onOpenTool={handleOpenTool}
                        />
                      ))}
                    </div>
                  )}
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
            <Sparkles className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-rad-indigo-500" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Décrivez ce que vous voulez faire…"
              className="h-9 w-full rounded border border-slate-200 bg-white pl-8 pr-2.5 text-xs focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            size="sm"
            className="h-9 bg-rad-indigo-600 hover:bg-rad-indigo-700 text-white"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>

      {/* Tool Preview Modal */}
      {selectedToolId && (
        <ToolPreview
          toolId={selectedToolId as any}
          onClose={() => setSelectedToolId(null)}
        />
      )}
    </div>
  )
}
