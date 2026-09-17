import { Trash2 } from 'lucide-react'
import type { ContentBlock, TextBlockData, TableBlockData, ChartBlockData } from './types'
import ReactMarkdown from 'react-markdown'

interface ContentBlockComponentProps {
  block: ContentBlock
  isEditing: boolean
  onDelete?: (blockId: string) => void
  onUpdate?: (blockId: string, newData: any) => void
}

export function ContentBlockComponent({ block, isEditing, onDelete, onUpdate }: ContentBlockComponentProps) {
  const handleTextChange = (newMarkdown: string) => {
    onUpdate?.(block.id, { markdown: newMarkdown })
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white relative group">
      {/* Delete button */}
      {isEditing && (
        <button
          onClick={() => onDelete?.(block.id)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-100 rounded"
          title="Supprimer"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      )}

      {/* Text Block */}
      {block.type === 'text' && (
        <div className="space-y-2">
          {isEditing ? (
            <textarea
              value={(block.data as TextBlockData).markdown}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full h-32 p-3 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-vertical"
            />
          ) : (
            <div className="prose prose-sm max-w-none text-slate-700">
              <ReactMarkdown>{(block.data as TextBlockData).markdown}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {/* Table Block */}
      {block.type === 'table' && (
        <div className="space-y-2">
          {(block.data as TableBlockData).caption && (
            <p className="text-sm font-medium text-slate-600">{(block.data as TableBlockData).caption}</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  {(block.data as TableBlockData).columns.map((col, idx) => (
                    <th key={idx} className="text-left p-2 font-semibold text-slate-900">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(block.data as TableBlockData).rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    {(block.data as TableBlockData).columns.map((col, colIdx) => (
                      <td key={colIdx} className="p-2 text-slate-700">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chart Block */}
      {block.type === 'chart' && (
        <div className="space-y-2">
          {(block.data as ChartBlockData).title && (
            <p className="text-sm font-medium text-slate-600">{(block.data as ChartBlockData).title}</p>
          )}
          <div className="bg-slate-100 rounded p-4 text-center text-slate-600 text-sm h-48 flex items-center justify-center">
            📊 Chart: {(block.data as ChartBlockData).chartType} - {(block.data as ChartBlockData).series.length} series
          </div>
        </div>
      )}
    </div>
  )
}
