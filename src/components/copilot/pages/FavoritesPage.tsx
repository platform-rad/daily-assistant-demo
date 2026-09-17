import { Star, Trash2, Copy, Plus } from 'lucide-react'

interface FavoritesPageProps {
  onSelectPrompt?: (prompt: string) => void
}

export function FavoritesPage({ onSelectPrompt }: FavoritesPageProps) {
  const favorites = [
    {
      id: 1,
      title: 'Analyse complète de client',
      prompt: 'Fais une analyse complète de l\'exposition de ce client',
      category: 'Analysis',
      saves: 12,
    },
    {
      id: 2,
      title: 'Credit Memo complet',
      prompt: 'Génère un Credit Memo complet pour ce client',
      category: 'Memo',
      saves: 8,
    },
    {
      id: 3,
      title: 'Risk Assessment détaillé',
      prompt: 'Quels risques identifiez-vous pour ce client?',
      category: 'Risk',
      saves: 5,
    },
    {
      id: 4,
      title: 'Portfolio par secteur',
      prompt: 'Fais une analyse du portefeuille par secteur',
      category: 'Portfolio',
      saves: 3,
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {/* Add New Favorite Button */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 transition font-medium">
          <Plus size={18} />
          Ajouter un nouveau prompt favoris
        </button>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md hover:border-orange-300 transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Star size={16} className="text-orange-500 fill-orange-500" />
                    {fav.title}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 mt-2 inline-block">
                    {fav.category}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{fav.saves} uses</span>
              </div>

              <p className="text-sm text-slate-600 mb-3 p-2.5 rounded bg-slate-50">{fav.prompt}</p>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => onSelectPrompt?.(fav.prompt)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition text-sm font-medium"
                >
                  Utiliser
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition">
                  <Copy size={16} className="text-slate-500" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 transition">
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
