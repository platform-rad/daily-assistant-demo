import { useState } from 'react'
import { SideNavigation } from '../copilot/sidebar/SideNavigation'
import { Clock } from 'lucide-react'

type ViewType = 'home' | 'history' | 'favorites' | 'active-actions'

export function MeenaApp() {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar */}
      <SideNavigation
        isOpen={sidebarOpen}
        currentView={currentView}
        onViewChange={setCurrentView}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            {currentView === 'home' && '🎙️ Meeting Notes'}
            {currentView === 'history' && 'Meeting History'}
            {currentView === 'favorites' && 'Saved Meetings'}
            {currentView === 'active-actions' && 'Action Items'}
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentView === 'home' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <span className="text-xl">🎙️</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Start Recording Meeting</h2>
                    <p className="text-sm text-slate-600">Record, transcribe, and sync to CRM+</p>
                  </div>
                </div>
                <button className="w-full px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition">
                  Start Recording
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="text-3xl font-bold text-slate-900">0</div>
                  <p className="text-sm text-slate-600 mt-1">Meetings Today</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="text-3xl font-bold text-slate-900">0</div>
                  <p className="text-sm text-slate-600 mt-1">Pending Actions</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'history' && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
              <Clock size={32} className="text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600">No past meetings yet</p>
            </div>
          )}

          {currentView === 'favorites' && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
              <p className="text-slate-600">No saved meetings yet</p>
            </div>
          )}

          {currentView === 'active-actions' && (
            <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
              <p className="text-slate-600">No action items yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
