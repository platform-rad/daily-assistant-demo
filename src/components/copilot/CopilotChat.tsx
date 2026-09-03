import { useState, useRef, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CopilotMessage, OrchestratedAction } from '@/data/orchestrator'
import { DEMO_SCENARIO } from '@/data/orchestrator'
import { ActionCard } from './ActionCard'
import { ToolPreview } from './ToolPreview'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Ajouter le message utilisateur
    const userMessage: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Simuler une réponse de l'IA avec les actions
    setTimeout(() => {
      const action: OrchestratedAction = {
        id: 'action-1',
        toolId: 'my-client-dev',
        analysis: DEMO_SCENARIO.aiAnalysis,
        summary: 'Créer client + facility de crédit',
        steps: DEMO_SCENARIO.steps,
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

    // Simuler l'exécution
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

      // Ajouter un message de confirmation
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

  return (
    <div className={`flex h-full flex-col bg-white ${mode === 'widget' ? 'rounded-lg shadow-lg' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-white">
        <div>
          <h1 className="text-lg font-bold">Daily Assistant</h1>
          <p className="text-xs text-blue-100">Copilot métier</p>
        </div>
        {mode === 'widget' && (
          <button className="rounded p-1 hover:bg-blue-500">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>

              {/* Actions */}
              {message.actions && (
                <div className="mt-4 space-y-3">
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

      {/* Input */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Décrivez ce que vous voulez faire..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send size={20} />
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
