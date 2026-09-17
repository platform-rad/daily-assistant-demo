import { Clock, Trash2 } from 'lucide-react'

export function HistoryPage() {
  const historyItems = [
    {
      id: 1,
      title: 'Analyse TechCorp France',
      time: 'Aujourd\'hui, 14:32',
      type: 'Analysis',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Credit Memo - Manufacturing Ltd',
      time: 'Aujourd\'hui, 11:45',
      type: 'Memo',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Portfolio Risk Overview',
      time: 'Hier, 09:20',
      type: 'Risk Assessment',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Covenant Review - Facility XYZ',
      time: 'Hier, 15:10',
      type: 'Review',
      status: 'completed',
    },
    {
      id: 5,
      title: 'Pipeline Forecast',
      time: '2 jours ago',
      type: 'Forecast',
      status: 'completed',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md hover:border-orange-300 transition flex items-center justify-between group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-slate-400" />
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{item.type}</span>
                </div>
                <p className="text-sm text-slate-500">{item.time}</p>
              </div>

              <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition">
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
