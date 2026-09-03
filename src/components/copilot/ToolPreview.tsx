import { X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ToolId } from '@/data/orchestrator'
import { MyClientDevPreview } from './previews/MyClientDevPreview'
import { MyCreditAppPreview } from './previews/MyCreditAppPreview'

interface ToolPreviewProps {
  toolId: ToolId
  onClose: () => void
}

export function ToolPreview({ toolId, onClose }: ToolPreviewProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-4xl w-full h-[90vh] mx-4 rounded-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold">
            {toolId === 'my-client-dev' ? 'MyClientDev' : 'MyCreditApp'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {toolId === 'my-client-dev' && <MyClientDevPreview />}
          {toolId === 'my-credit-app' && <MyCreditAppPreview />}
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <ExternalLink size={16} />
            Ouvrir dans une nouvelle fenêtre
          </Button>
        </div>
      </div>
    </div>
  )
}
