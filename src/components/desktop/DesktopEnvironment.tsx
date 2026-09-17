import { useState, useEffect } from 'react'
import { MessageSquare, Mic } from 'lucide-react'
import { FloatingWindow } from './FloatingWindow'
import { Taskbar } from './Taskbar'
import { CopilotChat } from '@/components/copilot/CopilotChat'
import { MeenaInterface } from '@/components/meena/MeenaInterface'

interface DesktopEnvironmentProps {
  onOpenMyClientDev?: () => void
  onCreateCreditMemo?: () => void
}

export function DesktopEnvironment({ onOpenMyClientDev, onCreateCreditMemo }: DesktopEnvironmentProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const [meenaOpen, setMeenaOpen] = useState(false)
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
    } else if (appId === 'myclientdev') {
      onOpenMyClientDev?.()
    } else if (appId === 'meena') {
      setMeenaOpen(!meenaOpen)
    }
  }

  const handleOpenMyClientDev = () => {
    onOpenMyClientDev?.()
  }

  const taskbarApps = [
    {
      id: 'myclientdev',
      label: 'MyClientDev',
      icon: <span className="text-sm">📊</span>,
      isActive: false,
      isMinimized: false,
    },
    {
      id: 'daily-assistant',
      label: 'Daily Assistant',
      icon: <MessageSquare size={16} />,
      isActive: chatOpen,
      isMinimized: false,
    },
    {
      id: 'meena',
      label: 'Meena',
      icon: <Mic size={16} />,
      isActive: false,
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
          <div
            className="group cursor-pointer"
            onDoubleClick={handleOpenMyClientDev}
          >
            <div className="bg-black/20 hover:bg-black/30 rounded-lg p-4 transition flex flex-col items-center gap-2">
              <span className="text-4xl">📊</span>
              <span className="text-xs text-white text-center font-medium group-hover:bg-black/40 rounded px-2 py-1">
                MyClientDev
              </span>
            </div>
          </div>
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
            title="Copilot"
            icon="🧠"
            defaultWidth={900}
            defaultHeight={800}
            defaultX={Math.max(20, window.innerWidth - 920)}
            defaultY={Math.max(20, 40)}
            onClose={() => setChatOpen(false)}
          >
            <CopilotChatWrapper
              onOpenMyClientDev={() => {
                setChatOpen(false)
                handleOpenMyClientDev()
              }}
              onCreateCreditMemo={() => {
                setChatOpen(false)
                onCreateCreditMemo?.()
              }}
            />
          </FloatingWindow>
        )}

        {/* Meena Window */}
        {meenaOpen && (
          <FloatingWindow
            title="Meena"
            icon="🎙️"
            defaultWidth={900}
            defaultHeight={800}
            defaultX={Math.max(20, window.innerWidth - 1820)}
            defaultY={Math.max(20, 40)}
            onClose={() => setMeenaOpen(false)}
          >
            <MeenaInterface />
          </FloatingWindow>
        )}

        {/* Desktop context menu hint */}
        {!chatOpen && !meenaOpen && (
          <div className="fixed bottom-20 right-8 bg-black/40 text-white text-xs px-3 py-2 rounded pointer-events-none">
            💡 Double-cliquez MyClientDev ou utilisez la taskbar
          </div>
        )}
      </div>

      {/* Taskbar */}
      <Taskbar apps={taskbarApps} onAppClick={handleTaskbarClick} currentTime={currentTime} />
    </div>
  )
}

// Wrapper pour passer les callbacks au chat
function CopilotChatWrapper({
  onOpenMyClientDev,
  onCreateCreditMemo,
}: {
  onOpenMyClientDev: () => void
  onCreateCreditMemo?: () => void
}) {
  return (
    <CopilotChat
      mode="standalone"
      currentRoute="client"
      onValidateAndEdit={() => onOpenMyClientDev()}
      onCreateCreditMemo={onCreateCreditMemo}
    />
  )
}
