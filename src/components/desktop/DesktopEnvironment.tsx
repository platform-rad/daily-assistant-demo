import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { FloatingWindow } from './FloatingWindow'
import { Taskbar } from './Taskbar'
import { CopilotChat } from '@/components/copilot/CopilotChat'

export function DesktopEnvironment() {
  const [chatOpen, setChatOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleTaskbarClick = (appId: string) => {
    if (appId === 'daily-assistant') {
      setChatOpen(!chatOpen)
    }
  }

  const taskbarApps = [
    {
      id: 'daily-assistant',
      label: 'Daily Assistant',
      icon: <MessageSquare size={16} />,
      isActive: chatOpen,
      isMinimized: false,
    },
  ]

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden">
      {/* Desktop Background - Windows 11 style */}
      <div
        className="w-full h-[calc(100%-48px)] relative"
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7aa8da 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Desktop Icons */}
        <div className="p-4 space-y-4 w-24">
          <div className="group cursor-pointer">
            <div className="bg-black/20 hover:bg-black/30 rounded-lg p-4 transition flex flex-col items-center gap-2">
              <span className="text-4xl">📁</span>
              <span className="text-xs text-white text-center font-medium group-hover:bg-black/40 rounded px-2 py-1">
                This PC
              </span>
            </div>
          </div>
          <div className="group cursor-pointer">
            <div className="bg-black/20 hover:bg-black/30 rounded-lg p-4 transition flex flex-col items-center gap-2">
              <span className="text-4xl">🗑️</span>
              <span className="text-xs text-white text-center font-medium group-hover:bg-black/40 rounded px-2 py-1">
                Recycle Bin
              </span>
            </div>
          </div>
        </div>

        {/* Floating Windows */}
        {chatOpen && (
          <FloatingWindow
            title="Daily Assistant"
            icon="💬"
            defaultWidth={500}
            defaultHeight={700}
            defaultX={300}
            defaultY={100}
            onClose={() => setChatOpen(false)}
          >
            <CopilotChat mode="standalone" />
          </FloatingWindow>
        )}

        {/* Desktop context menu hint */}
        {!chatOpen && (
          <div className="fixed bottom-20 right-8 bg-black/40 text-white text-xs px-3 py-2 rounded pointer-events-none">
            💡 Cliquez sur Daily Assistant dans la taskbar pour ouvrir
          </div>
        )}
      </div>

      {/* Taskbar */}
      <Taskbar apps={taskbarApps} onAppClick={handleTaskbarClick} currentTime={currentTime} />
    </div>
  )
}
