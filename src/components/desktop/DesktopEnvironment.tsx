import { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { FloatingWindow } from './FloatingWindow'
import { Taskbar } from './Taskbar'
import { CopilotChat } from '@/components/copilot/CopilotChat'

export function DesktopEnvironment() {
  const [chatOpen, setChatOpen] = useState(true)
  const [chatMinimized, setChatMinimized] = useState(false)
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
      if (chatMinimized) {
        setChatMinimized(false)
      } else {
        setChatMinimized(!chatMinimized)
      }
    }
  }

  const taskbarApps = [
    {
      id: 'daily-assistant',
      label: 'Daily Assistant',
      icon: <MessageSquare size={16} />,
      isActive: chatOpen && !chatMinimized,
      isMinimized: chatMinimized,
    },
  ]

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
      {/* Desktop Background */}
      <div className="w-full h-[calc(100%-48px)] bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white opacity-20">
          <div className="text-6xl mb-4">💼</div>
          <p className="text-2xl font-light">Daily Assistant</p>
        </div>

        {/* Floating Windows */}
        {chatOpen && !chatMinimized && (
          <FloatingWindow
            title="Daily Assistant"
            icon="💬"
            defaultWidth={500}
            defaultHeight={700}
            defaultX={200}
            defaultY={80}
            onClose={() => {
              setChatOpen(false)
              setChatMinimized(true)
            }}
          >
            <CopilotChat mode="standalone" />
          </FloatingWindow>
        )}
      </div>

      {/* Taskbar */}
      <Taskbar apps={taskbarApps} onAppClick={handleTaskbarClick} currentTime={currentTime} />
    </div>
  )
}
