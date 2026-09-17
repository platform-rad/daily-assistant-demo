import { useState, useEffect } from 'react'
import { MessageSquare, Mic } from 'lucide-react'
import { FloatingWindow } from './FloatingWindow'
import { Taskbar } from './Taskbar'
import { CopilotChat } from '@/components/copilot/CopilotChat'
import { MeenaApp } from '@/components/meena/MeenaApp'

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
      if (meenaOpen) setMeenaOpen(false)
    } else if (appId === 'meena') {
      setMeenaOpen(!meenaOpen)
      if (chatOpen) setChatOpen(false)
    } else if (appId === 'myclientdev') {
      onOpenMyClientDev?.()
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
      isActive: meenaOpen,
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

        {/* Desktop context menu hint */}
        {!chatOpen && !meenaOpen && (
          <div className="fixed bottom-20 right-8 bg-black/40 text-white text-xs px-3 py-2 rounded pointer-events-none">
            💡 Double-cliquez MyClientDev ou utilisez la taskbar
          </div>
        )}

        {/* Bottom Assistant Panel */}
        <div className="fixed bottom-12 right-0 left-0 px-2 py-2 bg-gradient-to-t from-gray-800/20 to-transparent flex gap-2 pointer-events-none">
          {/* Daily Assistant */}
          {chatOpen && (
            <div className="flex-1 max-w-sm h-40 pointer-events-auto rounded-t-lg overflow-hidden bg-white shadow-2xl border border-slate-200">
              <CopilotChatWrapper
                onOpenMyClientDev={() => {
                  setChatOpen(false)
                  onOpenMyClientDev?.()
                }}
                onCreateCreditMemo={() => {
                  setChatOpen(false)
                  onCreateCreditMemo?.()
                }}
              />
            </div>
          )}

          {/* Meena - Meeting Notes */}
          {meenaOpen && (
            <div className="flex-1 max-w-sm h-40 pointer-events-auto rounded-t-lg overflow-hidden bg-white shadow-2xl border border-slate-200">
              <MeenaApp />
            </div>
          )}
        </div>
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
