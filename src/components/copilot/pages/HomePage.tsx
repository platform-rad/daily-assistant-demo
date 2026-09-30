import { TrendingUp, AlertCircle, Target, Zap, Brain, FileText, BarChart3, ArrowRight, Send, Clock } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import React from 'react'
import type { HostRoute } from '@/data/types'

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: ConversationMessage[]
  createdAt: Date
  updatedAt: Date
}

interface HomePageProps {
  onSelectPrompt?: (prompt: string) => void
  onCreateCreditMemo?: () => void
  /** Callback pour ouvrir Daily Assistant avec le sidepanel assistant (cohérence de navigation) */
  onOpenMyClientDev?: (route?: HostRoute) => void
  /** Change de route SANS relancer le mode hôte (on est déjà dans Daily Assistant). */
  onNavigate?: (route: HostRoute) => void
  /** 'compact' for sidebar, 'full' for desktop standalone */
  layout?: 'compact' | 'full'
  /** Width of the sidebar in pixels (for responsive adjustments) */
  sidebarWidth?: number
  /** Current conversation being viewed */
  currentConversation?: Conversation | null
  /** Callback when user opens a conversation */
  onOpenConversation?: (conversation: Conversation) => void
  /** Callback when user creates a new conversation */
  onCreateConversation?: (conversation: Conversation) => void
}

export function HomePage({
  onSelectPrompt,
  onCreateCreditMemo,
  onOpenMyClientDev,
  onNavigate,
  layout = 'compact',
  sidebarWidth = 320,
  currentConversation: _currentConversation,
  onOpenConversation: _onOpenConversation,
  onCreateConversation: _onCreateConversation,
}: HomePageProps) {
  const [chatInput, setChatInput] = useState('')
  const [selectedDate, setSelectedDate] = useState('today')
  const [suggestedPlaceholder, setSuggestedPlaceholder] = useState('')
  const [chatMessages, setChatMessages] = useState<ConversationMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  /** Navigue vers un plan de travail : en place si on est déjà dans Daily Assistant, sinon on l'ouvre. */
  const openWorkPlan = (route: HostRoute) => {
    if (onNavigate) onNavigate(route)
    else onOpenMyClientDev?.(route)
  }

  // Detect keywords for placeholder suggestions
  const keywords = {
    'exposure': '€847.3M',
    'risk': 'Moderate',
    'rating': 'BBB+',
    'clients': '12',
    'portfolio': '€847.3M',
  }

  const detectKeyword = (text: string) => {
    const lowerText = text.toLowerCase().trim()
    for (const [key, value] of Object.entries(keywords)) {
      if (lowerText.startsWith(key) && !lowerText.includes(value)) {
        return `${key} ${value}`
      }
    }
    return ''
  }

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setChatInput(value)
    setSuggestedPlaceholder(detectKeyword(value))
  }

  // Responsive breakpoints based on actual width
  const isVeryNarrow = sidebarWidth < 280
  const isNarrow = sidebarWidth < 350
  const isMedium = sidebarWidth >= 350 && sidebarWidth < 500

  const dateOptions = [
    { id: 'today', label: 'Today', date: new Date() },
    { id: 'yesterday', label: 'Yesterday', date: new Date(Date.now() - 86400000) },
    { id: '3days', label: '3 days ago', date: new Date(Date.now() - 3 * 86400000) },
    { id: 'week', label: 'This week', date: new Date(Date.now() - 7 * 86400000) },
  ]

  /** Simulated contextual reply — good enough for a credible conversational prototype. */
  const generateAssistantReply = (question: string): string => {
    const q = question.toLowerCase()
    if (q.includes('credit memo')) {
      return 'I can generate a full Credit Memo. Click the "Create a Credit Memo" card below to get started — I\'ll pre-fill the available data.'
    }
    if (q.includes('cbs') || q.includes('cap')) {
      return 'This client\'s CBS/CAP is in progress. Open the "CAP / CBS" work plan below to edit the 5 strategic axes or follow up on action items.'
    }
    if (q.includes('digest') || q.includes('news')) {
      return "Today's digest covers JP Morgan, Goldman Sachs, Morgan Stanley and Macquarie. Expand the sections above for the detail by theme."
    }
    if (q.includes('exposure') || q.includes('risk') || q.includes('rating') || q.includes('portfolio')) {
      return "Based on the latest KPIs: exposure €847.3M (+5.2%), 12 at-risk clients, average rating BBB+. Would you like me to run a detailed analysis on a specific client?"
    }
    if (q.includes('meena') || q.includes('meeting') || q.includes('notes')) {
      return 'Meena can record your meeting notes by voice and sync them with CRM+. Open it from the "CRM+ Agent" work plan below.'
    }
    return `Got it: "${question}". I can analyze a client, generate a Credit Memo, open the CBS/CAP, or sync your meeting notes via Meena — let me know what you need.`
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    const messageContent = suggestedPlaceholder || chatInput

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput('')
    setSuggestedPlaceholder('')

    setTimeout(() => {
      const assistantMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAssistantReply(messageContent),
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, assistantMessage])
    }, 500)
  }

  const isCompact = layout === 'compact'

  // Dynamic sizing based on width - aggressively compact for sidebar
  const px = isCompact ? (isVeryNarrow ? 'px-1.5' : isNarrow ? 'px-2' : 'px-2') : 'px-3'
  const py = isCompact ? (isVeryNarrow ? 'py-1' : isNarrow ? 'py-1.5' : 'py-2') : 'py-4'
  const gap = isCompact ? (isVeryNarrow ? 'gap-1' : isNarrow ? 'gap-1.5' : 'gap-2') : 'gap-3'
  const spacing = isCompact ? (isVeryNarrow ? 'space-y-1' : isNarrow ? 'space-y-1.5' : 'space-y-2') : 'space-y-4'

  // Cohérent avec ContextualSuggestions pour sidebar
  // Desktop: normal, Sidebar: compact and consistent
  const valueSize = isCompact ? 'text-sm font-bold' : 'text-2xl'
  const labelSize = isCompact ? 'text-2xs' : 'text-sm'
  const sectionTitleSize = isCompact ? 'text-2xs font-semibold' : 'text-lg'
  const descriptionSize = isCompact ? 'text-2xs' : 'text-xs'
  const actionCardIconSize = isCompact ? 16 : 20

  // Grid columns based on width - responsive for cards
  // KPI cards: 1 col if narrow, 2+ cols if wider
  const kpiGridCols = isCompact
    ? (isVeryNarrow ? 'grid-cols-1' : isNarrow ? 'grid-cols-1' : isMedium ? 'grid-cols-2' : 'grid-cols-3')
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  // Action cards: responsive layout
  // Narrow: 1 col, Medium: 2 cols, Wide: 3 cols
  const actionGridCols = isCompact
    ? (isVeryNarrow ? 'grid-cols-1' : isNarrow ? 'grid-cols-1' : isMedium ? 'grid-cols-2' : 'grid-cols-3')
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className={`mx-auto ${px} ${py} ${spacing}`}>
        {/* What's New - KPIs */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`${sectionTitleSize} font-bold text-slate-900`}>📊 What's New</h2>

            {/* Date Selector */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {dateOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedDate(option.id)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      selectedDate === option.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <Clock size={16} className="text-slate-400" />
            </div>
          </div>

          <div className={`grid ${kpiGridCols} ${gap}`}>
            {/* KPI Card 1 - Portfolio Exposure */}
            <div className={`relative ${isCompact ? (isNarrow ? 'p-2' : 'p-2.5') : 'p-4'} rounded-lg border border-rad-indigo-200 bg-gradient-to-br from-rad-indigo-50/40 to-transparent backdrop-blur-sm hover:shadow-md transition flex flex-col h-full`}>
              {/* Colored Stroke Accent */}
              <div className={`absolute top-0 left-0 w-1 ${isCompact ? 'h-6' : 'h-8'} bg-rad-indigo-500 rounded-br-lg`} />

              <div className="flex items-start justify-between flex-1">
                <div className="flex-1">
                  <p className={`${labelSize} text-slate-600 uppercase tracking-wide`}>Exposure</p>
                  <p className={`${valueSize} text-slate-900 ${isCompact ? 'mt-0.5' : 'mt-2'}`}>€847.3M</p>
                  <p className={`${descriptionSize} text-rad-indigo-600 ${isCompact ? 'mt-0.5' : 'mt-1'}`}>↑ +5.2%</p>
                </div>
                <div className={`${isCompact ? (isNarrow ? 'p-1.5' : 'p-2') : 'p-2.5'} rounded-lg bg-rad-indigo-100/60`}>
                  <TrendingUp size={isCompact ? (isNarrow ? 14 : 16) : 20} className="text-rad-indigo-600" />
                </div>
              </div>
              <button className={`w-full ${labelSize} px-2 py-0.5 rounded border hover:bg-rad-indigo-50 transition ${isCompact ? 'mt-1.5' : 'mt-4'}`} style={{ borderColor: '#4F46E5', color: '#4F46E5' }}>
                {isCompact ? 'Details' : 'View details'}
              </button>
            </div>

            {/* KPI Card 2 - At-Risk Clients */}
            <div className={`relative ${isCompact ? (isNarrow ? 'p-2' : 'p-2.5') : 'p-4'} rounded-lg border border-red-200 bg-gradient-to-br from-red-50/40 to-transparent backdrop-blur-sm hover:shadow-md transition flex flex-col h-full`}>
              <div className={`absolute top-0 left-0 w-1 ${isCompact ? 'h-6' : 'h-8'} bg-red-500 rounded-br-lg`} />

              <div className="flex items-start justify-between flex-1">
                <div className="flex-1">
                  <p className={`${labelSize} font-semibold text-slate-600 uppercase tracking-wide`}>At-Risk Clients</p>
                  <p className={`${valueSize} font-bold text-slate-900 ${isCompact ? 'mt-1' : 'mt-2'}`}>12</p>
                  <p className={`${labelSize} text-red-600 font-medium ${isCompact ? 'mt-0.5' : 'mt-1'}`}>↑ +2 vs last week</p>
                </div>
                <div className={`${isCompact ? (isNarrow ? 'p-1.5' : 'p-2') : 'p-2.5'} rounded-lg bg-red-100/60`}>
                  <AlertCircle size={isCompact ? (isNarrow ? 14 : 16) : 20} className="text-red-600" />
                </div>
              </div>
              <button className={`w-full ${labelSize} px-2.5 py-1 rounded border hover:bg-red-50 transition ${isCompact ? 'mt-2' : 'mt-4'}`} style={{ borderColor: '#DC2626', color: '#DC2626' }}>
                View details
              </button>
            </div>

            {/* KPI Card 3 - Avg Rating */}
            <div className={`relative ${isCompact ? (isNarrow ? 'p-2' : 'p-2.5') : 'p-4'} rounded-lg border border-green-200 bg-gradient-to-br from-green-50/40 to-transparent backdrop-blur-sm hover:shadow-md transition flex flex-col h-full`}>
              <div className={`absolute top-0 left-0 w-1 ${isCompact ? 'h-6' : 'h-8'} bg-green-500 rounded-br-lg`} />

              <div className="flex items-start justify-between flex-1">
                <div className="flex-1">
                  <p className={`${labelSize} font-semibold text-slate-600 uppercase tracking-wide`}>Average Rating</p>
                  <p className={`${valueSize} font-bold text-slate-900 ${isCompact ? 'mt-1' : 'mt-2'}`}>BBB+</p>
                  <p className={`${labelSize} text-green-600 font-medium ${isCompact ? 'mt-0.5' : 'mt-1'}`}>Stable</p>
                </div>
                <div className={`${isCompact ? (isNarrow ? 'p-1.5' : 'p-2') : 'p-2.5'} rounded-lg bg-green-100/60`}>
                  <Target size={isCompact ? (isNarrow ? 14 : 16) : 20} className="text-green-600" />
                </div>
              </div>
              <button className={`w-full ${labelSize} px-2.5 py-1 rounded border hover:bg-green-50 transition ${isCompact ? 'mt-2' : 'mt-4'}`} style={{ borderColor: '#16A34A', color: '#16A34A' }}>
                View details
              </button>
            </div>
          </div>
        </section>

        {/* Top Recommendations */}
        {!isCompact && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">⭐ Top Recommendations for You</h2>

          <div className="relative p-5 rounded-lg border-2" style={{ borderColor: '#4F46E5', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, transparent 100%)' }} >
            {/* Accent stripe */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5 rounded-full blur-3xl" style={{ background: '#4F46E5' }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">Full analysis of Manufacturing Ltd</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    This BBB- client shows signs of deterioration. A detailed analysis could reveal
                    restructuring opportunities.
                  </p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
                  <Zap size={18} style={{ color: '#4F46E5' }} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3" style={{ borderTopColor: '#4F46E5', borderTopWidth: '1px' }}>
                <button
                  onClick={() => onSelectPrompt?.("Run a full exposure analysis for this client: Manufacturing Ltd")}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white hover:opacity-90 transition font-medium text-sm"
                  style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #0B1220 100%)' }}
                >
                  <Brain size={16} />
                  Run analysis
                </button>
                <button className="px-3 py-2 rounded-lg border transition font-medium text-sm" style={{ borderColor: '#4F46E5', color: '#4F46E5' }}>
                  Details
                </button>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Start From Scratch - Action Categories */}
        <section>
          <h2 className={`${sectionTitleSize} font-bold text-slate-900 ${isCompact ? 'mb-1.5' : 'mb-4'}`}>
            {isCompact ? '🚀 Actions' : '🚀 Start a New Action'}
          </h2>

          <div className={`grid ${layout === 'full' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : actionGridCols} ${gap}`}>
            {/* Action Card 1 */}
            <ActionCard
              title="Analyze a Client"
              description="Opens Daily Assistant with the assistant side panel to analyze exposure, risks and recommendations"
              icon={<Brain size={actionCardIconSize} />}
              prompt="Run a full exposure analysis for this client"
              onSelect={onSelectPrompt}
              onOpenMyClientDev={() => openWorkPlan('client')}
              isCompact={isCompact}
            />

            {/* Action Card 2 */}
            <ActionCard
              title="Create a Credit Memo"
              description="Generates a detailed credit memo with all elements"
              icon={<FileText size={actionCardIconSize} />}
              prompt="Generate a complete Credit Memo for this client"
              onSelect={onSelectPrompt}
              onCreateCreditMemo={onCreateCreditMemo}
              isCompact={isCompact}
            />

            {/* Action Card 3 */}
            <ActionCard
              title="Portfolio Overview"
              description="Portfolio overview and trends"
              icon={<BarChart3 size={20} />}
              prompt="Analyze the portfolio by sector"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 4 */}
            <ActionCard
              title="Risk Assessment"
              description="Detailed risk evaluation for a client"
              icon={<AlertCircle size={20} />}
              prompt="What risks do you identify for this client?"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 5 */}
            <ActionCard
              title="Pipeline Status"
              description="Pipeline status and deal forecast"
              icon={<TrendingUp size={20} />}
              prompt="Summarize the pipeline status"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 6 */}
            <ActionCard
              title="Covenant Review"
              description="Covenant compliance check"
              icon={<Target size={20} />}
              prompt="Check the covenants for this facility"
              onSelect={onSelectPrompt}
            />
          </div>
        </section>

        {/* Pinned Conversations */}
        {!isCompact && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">📌 Pinned Conversations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConversationCard
              title="TechCorp France - Q3 Review"
              date="2 days ago"
              snippet="Exposure and risk analysis for Q3..."
            />
            <ConversationCard
              title="Portfolio Rebalancing Options"
              date="5 days ago"
              snippet="Portfolio optimization strategies..."
            />
          </div>
        </section>
        )}
        </div>
      </div>

      {/* Fil de conversation — n'apparaît qu'une fois la discussion démarrée */}
      {chatMessages.length > 0 && (
        <div className={`border-t border-slate-200 bg-slate-50 overflow-y-auto flex-shrink-0 ${isCompact ? 'max-h-40' : 'max-h-56'}`}>
          <div className={`space-y-1.5 ${isCompact ? 'p-2' : 'p-3'}`}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-2xs leading-snug ${
                    msg.role === 'user' ? 'bg-rad-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Chat Input Footer */}
      <div className={`border-t border-slate-200 bg-white ${isCompact ? 'p-2' : 'p-4'} flex-shrink-0`}>
        <div className="flex flex-col gap-2">
          {suggestedPlaceholder && chatInput && (
            <div className="px-3 py-1.5 rounded-lg bg-rad-indigo-50 border border-rad-indigo-200">
              <p className="text-2xs text-slate-600">Suggestion: <span className="text-rad-indigo-700 font-semibold">{suggestedPlaceholder}</span></p>
            </div>
          )}
          <div className="relative flex-1">
            <input
              type="text"
              value={chatInput}
              onChange={handleChatInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder={isCompact ? "Ask a question..." : "Ask a question or use an action..."}
              className={`w-full ${isCompact ? 'h-8' : 'h-10'} rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500`}
            />
            <button
              onClick={handleSendChat}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-rad-indigo-50 rounded transition"
            >
              <Send size={isCompact ? 14 : 18} className="text-rad-indigo-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  prompt: string
  onSelect?: (prompt: string) => void
  onCreateCreditMemo?: () => void
  onOpenMyClientDev?: () => void
  isCompact?: boolean
}

function ActionCard({ title, description, icon, prompt, onSelect, onCreateCreditMemo, onOpenMyClientDev, isCompact = false }: ActionCardProps) {
  const handleClick = () => {
    if (title.includes('Credit Memo') && onCreateCreditMemo) {
      onCreateCreditMemo()
    } else if (title.includes('Analyze a Client') && onOpenMyClientDev) {
      onOpenMyClientDev()
    } else if (onSelect) {
      // Send the prompt to the chat
      onSelect(prompt)
    }
  }

  // Cohérent avec ContextualSuggestions
  const cardPadding = isCompact ? 'p-2' : 'p-4'
  const iconPadding = isCompact ? 'p-1' : 'p-2'
  const titleSize = isCompact ? 'text-2xs font-semibold' : 'text-sm font-semibold'
  const descSize = isCompact ? 'text-2xs' : 'text-xs'
  const arrowSize = isCompact ? 14 : 16

  return (
    <button
      onClick={handleClick}
      className={`${cardPadding} rounded-lg border border-slate-200 bg-white hover:border-rad-indigo-300 hover:shadow-md hover:bg-rad-indigo-50/30 transition group text-left`}
    >
      <div className="flex items-start justify-between mb-0.5">
        <div className={`${iconPadding} rounded-lg bg-slate-100 group-hover:bg-rad-indigo-100 transition flex-shrink-0`}>{icon}</div>
        <ArrowRight size={arrowSize} className="text-slate-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0 ml-1" />
      </div>
      <h3 className={`${titleSize} text-slate-900 group-hover:text-rad-indigo-700 transition`}>{title}</h3>
      <p className={`${descSize} text-slate-600 ${isCompact ? 'mt-0.5' : 'mt-1'} line-clamp-2`}>{description}</p>
    </button>
  )
}

interface ConversationCardProps {
  title: string
  date: string
  snippet: string
}

function ConversationCard({ title, date, snippet }: ConversationCardProps) {
  return (
    <button className="p-3 rounded-lg border border-slate-200 bg-white hover:border-rad-indigo-300 hover:shadow-md transition text-left group">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm text-slate-900 group-hover:text-rad-indigo-700 transition flex-1">{title}</h3>
        <span className="text-2xs text-slate-400 flex-shrink-0 ml-2">{date}</span>
      </div>
      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{snippet}</p>
    </button>
  )
}
