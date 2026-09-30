import { Clock, Trash2, MessageSquare, Mic, ClipboardList } from 'lucide-react'

const RECENT_CONVERSATIONS = [
  {
    id: 'c1',
    source: 'CRM+ Agent',
    icon: <Mic size={14} className="text-rad-indigo-600" />,
    title: 'AeroDynamics Group · CFO call',
    time: 'Aug 18, 2026',
    messages: 2,
  },
  {
    id: 'c2',
    source: 'CAP / CBS',
    icon: <ClipboardList size={14} className="text-rad-indigo-600" />,
    title: 'Manufacturing Ltd · EMEA contribution',
    time: '6h ago',
    messages: 3,
  },
  {
    id: 'c3',
    source: 'Home',
    icon: <MessageSquare size={14} className="text-slate-500" />,
    title: 'Question on portfolio exposure',
    time: 'today',
    messages: 1,
  },
]

export function HistoryPage() {
  const historyItems = [
    {
      id: 1,
      title: 'TechCorp France Analysis',
      time: 'Today, 2:32 PM',
      type: 'Analysis',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Credit Memo - Manufacturing Ltd',
      time: 'Today, 11:45 AM',
      type: 'Memo',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Portfolio Risk Overview',
      time: 'Yesterday, 9:20 AM',
      type: 'Risk Assessment',
      status: 'completed',
    },
    {
      id: 4,
      title: 'Covenant Review - Facility XYZ',
      time: 'Yesterday, 3:10 PM',
      type: 'Review',
      status: 'completed',
    },
    {
      id: 5,
      title: 'Pipeline Forecast',
      time: '2 days ago',
      type: 'Forecast',
      status: 'completed',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Recent conversations — across all work plans */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Recent Conversations</h2>
          <div className="space-y-2">
            {RECENT_CONVERSATIONS.map((c) => (
              <button
                key={c.id}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-rad-indigo-300 hover:shadow-sm transition text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">{c.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium flex-shrink-0">{c.source}</span>
                    <p className="text-sm font-medium text-slate-900 truncate">{c.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{c.messages} message{c.messages > 1 ? 's' : ''} · {c.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Activity history */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Activity</h2>
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-slate-200 bg-white hover:shadow-md hover:border-rad-indigo-300 transition flex items-center justify-between group"
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
    </div>
  )
}
