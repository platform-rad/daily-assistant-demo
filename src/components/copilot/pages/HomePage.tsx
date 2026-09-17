import { TrendingUp, AlertCircle, Target, Zap, Brain, FileText, BarChart3, ArrowRight, Send, Clock } from 'lucide-react'
import { useState } from 'react'

interface HomePageProps {
  onSelectPrompt?: (prompt: string) => void
}

export function HomePage({ onSelectPrompt }: HomePageProps) {
  const [chatInput, setChatInput] = useState('')
  const [selectedDate, setSelectedDate] = useState('today')

  const dateOptions = [
    { id: 'today', label: "Aujourd'hui", date: new Date() },
    { id: 'yesterday', label: 'Hier', date: new Date(Date.now() - 86400000) },
    { id: '3days', label: 'Il y a 3j', date: new Date(Date.now() - 3 * 86400000) },
    { id: 'week', label: 'Semaine', date: new Date(Date.now() - 7 * 86400000) },
  ]

  const handleSendChat = () => {
    if (chatInput.trim()) {
      onSelectPrompt?.(chatInput)
      setChatInput('')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto px-3 py-4 space-y-4">
        {/* What's New - KPIs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">📊 What's New</h2>

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

          <div className="grid grid-cols-1 gap-3">
            {/* KPI Card 1 - Portfolio Exposure */}
            <div className="relative p-4 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50/40 to-transparent backdrop-blur-sm hover:shadow-md transition flex flex-col h-full">
              {/* Colored Stroke Accent */}
              <div className="absolute top-0 left-0 w-1 h-8 bg-purple-500 rounded-br-lg" />

              <div className="flex items-start justify-between flex-1">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Exposition Portefeuille</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">€847.3M</p>
                  <p className="text-xs text-purple-600 font-medium mt-1">↑ +5.2% vs hier</p>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-100/60">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
              </div>
              <button className="w-full text-xs px-2.5 py-1.5 rounded border hover:bg-purple-50 transition mt-4" style={{ borderColor: '#7D4FFE', color: '#7D4FFE' }}>
                Voir détails
              </button>
            </div>

            {/* KPI Card 2 - At-Risk Clients */}
            <div className="relative p-4 rounded-lg border border-red-200 bg-gradient-to-br from-red-50/40 to-transparent backdrop-blur-sm hover:shadow-md transition flex flex-col h-full">
              <div className="absolute top-0 left-0 w-1 h-8 bg-red-500 rounded-br-lg" />

              <div className="flex items-start justify-between flex-1">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Clients À Risque</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">12</p>
                  <p className="text-xs text-red-600 font-medium mt-1">↑ +2 vs semaine passée</p>
                </div>
                <div className="p-2.5 rounded-lg bg-red-100/60">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
              </div>
              <button className="w-full text-xs px-2.5 py-1.5 rounded border hover:bg-red-50 transition mt-4" style={{ borderColor: '#DC2626', color: '#DC2626' }}>
                Voir détails
              </button>
            </div>

            {/* KPI Card 3 - Avg Rating */}
            <div className="relative p-4 rounded-lg border border-green-200 bg-gradient-to-br from-green-50/40 to-transparent backdrop-blur-sm hover:shadow-md transition flex flex-col h-full">
              <div className="absolute top-0 left-0 w-1 h-8 bg-green-500 rounded-br-lg" />

              <div className="flex items-start justify-between flex-1">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Rating Moyen</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">BBB+</p>
                  <p className="text-xs text-green-600 font-medium mt-1">Stable</p>
                </div>
                <div className="p-2.5 rounded-lg bg-green-100/60">
                  <Target size={20} className="text-green-600" />
                </div>
              </div>
              <button className="w-full text-xs px-2.5 py-1.5 rounded border hover:bg-green-50 transition mt-4" style={{ borderColor: '#16A34A', color: '#16A34A' }}>
                Voir détails
              </button>
            </div>
          </div>
        </section>

        {/* Top Recommendations */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">⭐ Top Recommandations pour vous</h2>

          <div className="relative p-5 rounded-lg border-2" style={{ borderColor: '#7D4FFE', background: 'linear-gradient(135deg, rgba(125, 79, 254, 0.08) 0%, transparent 100%)' }} >
            {/* Accent stripe */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5 rounded-full blur-3xl" style={{ background: '#7D4FFE' }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">Analyse complète du client Manufacturing Ltd</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Ce client BBB- montre des signes de détérioration. Une analyse détaillée pourrait révéler les
                    opportunités de restructuration.
                  </p>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(125, 79, 254, 0.1)' }}>
                  <Zap size={18} style={{ color: '#7D4FFE' }} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3" style={{ borderTopColor: '#7D4FFE', borderTopWidth: '1px' }}>
                <button
                  onClick={() => onSelectPrompt?.("Fais une analyse complète de l'exposition de ce client: Manufacturing Ltd")}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white hover:opacity-90 transition font-medium text-sm"
                  style={{ background: 'linear-gradient(135deg, #7D4FFE 0%, #6D3BF0 100%)' }}
                >
                  <Brain size={16} />
                  Lancer l'analyse
                </button>
                <button className="px-3 py-2 rounded-lg border transition font-medium text-sm" style={{ borderColor: '#7D4FFE', color: '#7D4FFE' }}>
                  Détails
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Start From Scratch - Action Categories */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">🚀 Commencer une nouvelle action</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Action Card 1 */}
            <ActionCard
              title="Analyser un Client"
              description="Analyse complète d'un client : exposition, risques, recommandations"
              icon={<Brain size={20} />}
              prompt="Fais une analyse complète de l'exposition de ce client"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 2 */}
            <ActionCard
              title="Créer un Credit Memo"
              description="Génère un memo de crédit détaillé avec tous les éléments"
              icon={<FileText size={20} />}
              prompt="Génère un Credit Memo complet pour ce client"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 3 */}
            <ActionCard
              title="Portefeuille Overview"
              description="Vue d'ensemble du portefeuille et des tendances"
              icon={<BarChart3 size={20} />}
              prompt="Fais une analyse du portefeuille par secteur"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 4 */}
            <ActionCard
              title="Risk Assessment"
              description="Évaluation détaillée des risques pour un client"
              icon={<AlertCircle size={20} />}
              prompt="Quels risques identifiez-vous pour ce client?"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 5 */}
            <ActionCard
              title="Pipeline Status"
              description="État du pipeline et forecast des deals"
              icon={<TrendingUp size={20} />}
              prompt="Résume l'état du pipeline"
              onSelect={onSelectPrompt}
            />

            {/* Action Card 6 */}
            <ActionCard
              title="Covenant Review"
              description="Vérification des covenants et compliance"
              icon={<Target size={20} />}
              prompt="Vérifie les covenants de cette facility"
              onSelect={onSelectPrompt}
            />
          </div>
        </section>

        {/* Pinned Conversations */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4">📌 Conversations Épinglées</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConversationCard
              title="TechCorp France - Q3 Review"
              date="Il y a 2 jours"
              snippet="Analyse de l'exposition et des risques pour Q3..."
            />
            <ConversationCard
              title="Portfolio Rebalancing Options"
              date="Il y a 5 jours"
              snippet="Stratégies d'optimisation du portefeuille..."
            />
          </div>
        </section>
        </div>
      </div>

      {/* Chat Input Footer */}
      <div className="border-t border-slate-200 bg-white p-4 flex-shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Posez votre question ou utilisez une action..."
              className="w-full h-10 rounded-lg border border-slate-200 bg-white pl-3 pr-10 text-sm focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={handleSendChat}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-purple-50 rounded transition"
            >
              <Send size={18} className="text-purple-600" />
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
}

function ActionCard({ title, description, icon, prompt, onSelect }: ActionCardProps) {
  return (
    <button
      onClick={() => onSelect?.(prompt)}
      className="p-4 rounded-lg border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md hover:bg-purple-50/30 transition group text-left"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-purple-100 transition">{icon}</div>
        <ArrowRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition" />
      </div>
      <h3 className="font-semibold text-slate-900 group-hover:text-purple-700 transition">{title}</h3>
      <p className="text-xs text-slate-600 mt-1">{description}</p>
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
    <button className="p-4 rounded-lg border border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition text-left group">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-slate-900 group-hover:text-purple-700 transition flex-1">{title}</h3>
        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{date}</span>
      </div>
      <p className="text-sm text-slate-600 mt-2 line-clamp-2">{snippet}</p>
    </button>
  )
}
