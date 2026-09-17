import { Loader, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react'

export function ActiveActionsPage() {
  const activeActions = [
    {
      id: 1,
      title: 'Analyse TechCorp France',
      startedAt: 'Il y a 15 min',
      status: 'completed',
      progress: 100,
    },
    {
      id: 2,
      title: 'Génération Credit Memo - Manufacturing Ltd',
      startedAt: 'Il y a 8 min',
      status: 'generating',
      progress: 65,
    },
    {
      id: 3,
      title: 'Risk Assessment Portfolio',
      startedAt: 'Il y a 3 min',
      status: 'processing',
      progress: 35,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} className="text-green-600" />
      case 'generating':
        return <Loader size={18} className="text-blue-600 animate-spin" />
      case 'processing':
        return <Loader size={18} className="text-blue-600 animate-spin" />
      case 'error':
        return <AlertCircle size={18} className="text-red-600" />
      default:
        return <CheckCircle size={18} className="text-slate-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété'
      case 'generating':
        return 'En génération'
      case 'processing':
        return 'En traitement'
      case 'error':
        return 'Erreur'
      default:
        return 'Inconnu'
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
        {activeActions.map((action) => (
          <div key={action.id} className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(action.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{action.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{action.startedAt}</p>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  action.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : action.status === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {getStatusLabel(action.status)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-500"
                  style={{ width: `${action.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{action.progress}% complété</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              {action.status === 'completed' && (
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-sm font-medium">
                  <Eye size={16} />
                  Voir le résultat
                </button>
              )}
              <button className="p-1.5 rounded-lg hover:bg-red-50 transition">
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
