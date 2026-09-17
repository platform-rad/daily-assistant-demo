import { useState, useRef } from 'react'
import { Mic, Square, Upload, Plus, Trash2, Users, CheckCircle2, FileText } from 'lucide-react'

interface MeetingNote {
  id: string
  title: string
  participants: string[]
  duration: string
  transcript: string
  actionItems: string[]
  summary: string
  createdAt: Date
  uploadedToCRM: boolean
}

export function MeenaApp() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [meetings, setMeetings] = useState<MeetingNote[]>([])
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null)
  const [newParticipant, setNewParticipant] = useState('')
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const activeMeeting = meetings.find(m => m.id === activeMeetingId)

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)

    // Créer une nouvelle meeting note
    const newMeeting: MeetingNote = {
      id: `meeting_${Date.now()}`,
      title: `Meeting ${new Date().toLocaleDateString()}`,
      participants: [],
      duration: '0:00',
      transcript: '[Recording in progress...]',
      actionItems: [],
      summary: '',
      createdAt: new Date(),
      uploadedToCRM: false,
    }
    setMeetings(prev => [newMeeting, ...prev])
    setActiveMeetingId(newMeeting.id)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
    }

    // Simuler la transcription et l'analyse
    if (activeMeeting) {
      const mockTranscript = `Discussion about Q4 budget planning and resource allocation. Team reviewed current spending and projected needs for upcoming quarters. Key topics: vendor negotiations, headcount expansion, technology investments.`

      setMeetings(prev => prev.map(m => m.id === activeMeetingId ? {
        ...m,
        transcript: mockTranscript,
        summary: 'Q4 Budget Planning & Resource Allocation Review',
        actionItems: [
          'Finalize vendor contracts by Friday',
          'Schedule headcount expansion meeting',
          'Review tech stack requirements'
        ],
        duration: formatTime(recordingTime)
      } : m))
    }
  }

  const addParticipant = () => {
    if (!newParticipant.trim() || !activeMeeting) return

    setMeetings(prev => prev.map(m => m.id === activeMeetingId ? {
      ...m,
      participants: [...new Set([...m.participants, newParticipant])]
    } : m))
    setNewParticipant('')
  }

  const updateTranscript = (text: string) => {
    if (!activeMeeting) return
    setMeetings(prev => prev.map(m => m.id === activeMeetingId ? {
      ...m,
      transcript: text
    } : m))
  }

  const updateTitle = (title: string) => {
    if (!activeMeeting) return
    setMeetings(prev => prev.map(m => m.id === activeMeetingId ? {
      ...m,
      title
    } : m))
  }

  const removeParticipant = (participant: string) => {
    if (!activeMeeting) return
    setMeetings(prev => prev.map(m => m.id === activeMeetingId ? {
      ...m,
      participants: m.participants.filter(p => p !== participant)
    } : m))
  }

  const uploadToCRM = () => {
    if (!activeMeeting) return

    setMeetings(prev => prev.map(m => m.id === activeMeetingId ? {
      ...m,
      uploadedToCRM: true
    } : m))

    // Simuler le succès d'upload
    setTimeout(() => {
      setMeetings(prev => prev.map(m => m.id === activeMeetingId ? {
        ...m,
        uploadedToCRM: true
      } : m))
    }, 1000)
  }

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id))
    if (activeMeetingId === id) {
      setActiveMeetingId(meetings.length > 1 ? meetings[0].id : null)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex h-full flex-col bg-white rounded-lg shadow-rad-lg overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-amber-50 to-transparent px-4 py-3">
        <h1 className="text-sm font-semibold text-slate-900">Daily Assistant Meena</h1>
        <p className="text-2xs mt-0.5 text-slate-600">🎙️ Meeting Notes & CRM Sync</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeMeeting ? (
          // Active Meeting Editor
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Recording Controls */}
            <div className="border-b border-slate-200 bg-slate-50 p-3 space-y-2">
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-slate-900">Recording...</span>
                      <span className="text-xs text-slate-600">{formatTime(recordingTime)}</span>
                    </div>
                  </div>
                  <button
                    onClick={stopRecording}
                    className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition"
                    title="Stop recording"
                  >
                    <Square size={16} className="text-red-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startRecording}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 transition text-white text-sm font-medium"
                >
                  <Mic size={16} />
                  Start Recording
                </button>
              )}
            </div>

            {/* Meeting Title */}
            <div className="border-b border-slate-200 bg-white p-3">
              <input
                type="text"
                value={activeMeeting.title}
                onChange={(e) => updateTitle(e.target.value)}
                className="w-full text-sm font-semibold text-slate-900 border-0 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded px-2 py-1"
              />
            </div>

            {/* Participants */}
            <div className="border-b border-slate-200 bg-white p-3 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-slate-600" />
                <span className="text-xs font-semibold text-slate-900">Participants</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeMeeting.participants.map((p) => (
                  <div key={p} className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 rounded text-xs text-slate-900">
                    {p}
                    <button
                      onClick={() => removeParticipant(p)}
                      className="hover:text-red-600 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder="Add participant..."
                  className="flex-1 px-2 py-1.5 text-xs rounded border border-slate-200 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  onClick={addParticipant}
                  className="p-1.5 rounded bg-amber-100 hover:bg-amber-200 transition"
                >
                  <Plus size={14} className="text-amber-600" />
                </button>
              </div>
            </div>

            {/* Transcript */}
            <div className="border-b border-slate-200 bg-white p-3 flex-1 min-h-0 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-slate-600" />
                <span className="text-xs font-semibold text-slate-900">Transcript</span>
              </div>
              <textarea
                value={activeMeeting.transcript}
                onChange={(e) => updateTranscript(e.target.value)}
                className="flex-1 w-full text-xs p-2 rounded border border-slate-200 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Action Items */}
            {activeMeeting.actionItems.length > 0 && (
              <div className="border-b border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={14} className="text-slate-600" />
                  <span className="text-xs font-semibold text-slate-900">Action Items</span>
                </div>
                <div className="space-y-1.5">
                  {activeMeeting.actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded border border-amber-300 bg-white flex-shrink-0 mt-0.5"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="border-t border-slate-200 bg-white p-2.5 flex gap-2 flex-wrap">
              <button
                onClick={() => uploadToCRM()}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium transition ${
                  activeMeeting.uploadedToCRM
                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <Upload size={14} />
                {activeMeeting.uploadedToCRM ? 'Uploaded ✓' : 'Upload to CRM+'}
              </button>
              <button
                onClick={() => deleteMeeting(activeMeeting.id)}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded border border-slate-200 text-slate-700 hover:bg-red-50 transition text-xs"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Mic className="text-amber-600" size={24} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">No Meeting Notes</h3>
            <p className="text-2xs text-slate-600 max-w-40">Start recording a meeting to create notes and sync with CRM+</p>
            <button
              onClick={startRecording}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 transition text-white text-xs font-medium mt-2"
            >
              <Mic size={14} />
              Start First Meeting
            </button>
          </div>
        )}
      </div>

      {/* Meetings List Sidebar (if space allows) */}
      {meetings.length > 1 && (
        <div className="border-t border-slate-200 bg-slate-50 max-h-32 overflow-y-auto">
          <div className="text-2xs font-semibold text-slate-600 px-3 py-2">Recent Meetings</div>
          <div className="space-y-1 px-2 pb-2">
            {meetings.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMeetingId(m.id)}
                className={`w-full text-left px-2 py-1.5 rounded text-2xs transition ${
                  activeMeetingId === m.id
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-medium truncate">{m.title}</div>
                <div className="text-2xs text-slate-500">
                  {m.uploadedToCRM && '✓ CRM+ '} {m.duration}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Placeholder X icon
function X({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
