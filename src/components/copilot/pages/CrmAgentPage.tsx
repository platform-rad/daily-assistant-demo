import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Pause, Play, Send, Clock, ArrowLeft, Plus, Info, Maximize2, Upload } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface CrmAgentPageProps {
  onOpenMeena?: () => void
  isCompact?: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Dossier {
  id: string
  client: string
  subject: string
  status: 'Synced' | 'Draft'
  updatedAt: string
  messages: ChatMessage[]
}

const INITIAL_DOSSIERS: Dossier[] = [
  {
    id: 'd1',
    client: 'AeroDynamics Group',
    subject: 'CFO call — 2027 refinancing',
    status: 'Synced',
    updatedAt: 'Aug 18, 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Note synced with CRM+. Key points: refinancing timeline agreed, sell-side mandate opportunity raised.' },
    ],
  },
  {
    id: 'd2',
    client: 'TechCorp France',
    subject: 'Monthly business review',
    status: 'Synced',
    updatedAt: 'Aug 12, 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Note synced with CRM+. No blocking action identified.' },
    ],
  },
  {
    id: 'd3',
    client: 'Manufacturing Ltd',
    subject: 'Covenant follow-up Q2',
    status: 'Draft',
    updatedAt: 'Aug 5, 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Draft note awaiting review before syncing to CRM+.' },
    ],
  },
]

const TRANSCRIPT_SCRIPT = [
  "Thanks everyone for joining today's call.",
  "Let's start with the Q3 refinancing timeline for the RCF facility.",
  'The client confirmed interest in extending the maturity to 5 years.',
  "They're also open to a sustainability-linked pricing structure.",
  'We should loop in the credit committee before the September 30th deadline.',
  'Any concerns on covenant headroom given the recent leverage increase?',
  "Let's schedule a follow-up with the CFO next week to finalize terms.",
]

const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped'

/** Dedicated sidepanel work plan for the CRM+ Agent (Meena) — record, transcribe, ask, sync. */
export function CrmAgentPage({ onOpenMeena, isCompact = true }: CrmAgentPageProps) {
  const [dossiers, setDossiers] = useState<Dossier[]>(INITIAL_DOSSIERS)
  const [openId, setOpenId] = useState<string | null>(null)
  const [input, setInput] = useState('')

  // Recording session state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [transcriptLines, setTranscriptLines] = useState<string[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([])
  const [liveInput, setLiveInput] = useState('')
  const [sentConfirmation, setSentConfirmation] = useState(false)

  const endRef = useRef<HTMLDivElement>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)
  const pad = isCompact ? 'px-3 py-3' : 'px-4 py-4'

  const openDossier = dossiers.find((d) => d.id === openId) || null
  const isSessionActive = recordingState !== 'idle'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [openDossier?.messages.length])

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcriptLines.length, liveMessages.length])

  // Timer — runs only while actively recording (not paused)
  useEffect(() => {
    if (recordingState !== 'recording') return
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [recordingState])

  // Simulated live transcript — reveals the next line every ~2.5s while recording
  useEffect(() => {
    if (recordingState !== 'recording') return
    if (scriptIndex >= TRANSCRIPT_SCRIPT.length) return
    const timeout = setTimeout(() => {
      setTranscriptLines((prev) => [...prev, TRANSCRIPT_SCRIPT[scriptIndex]])
      setScriptIndex((i) => i + 1)
    }, 2500)
    return () => clearTimeout(timeout)
  }, [recordingState, scriptIndex])

  const startRecording = () => {
    setSeconds(0)
    setTranscriptLines([])
    setScriptIndex(0)
    setLiveMessages([])
    setSentConfirmation(false)
    setRecordingState('recording')
  }

  const pauseRecording = () => setRecordingState('paused')
  const resumeRecording = () => setRecordingState('recording')
  const stopRecording = () => setRecordingState('stopped')
  const discardRecording = () => setRecordingState('idle')

  const handleAskLive = () => {
    if (!liveInput.trim()) return
    const question = liveInput.trim()
    setLiveInput('')
    setLiveMessages((prev) => [...prev, { id: Date.now().toString(), role: 'user', content: question }])
    setTimeout(() => {
      const lastLine = transcriptLines[transcriptLines.length - 1]
      setLiveMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: lastLine
            ? `Based on the discussion so far ("${lastLine}"), I'd flag this as an action item once the note is synced.`
            : "I'm listening in — ask me anything once the transcript picks up.",
        },
      ])
    }, 500)
  }

  const handleSendToCrm = () => {
    const summaryMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🎙️ Voice note transcribed (${formatTime(seconds)}). Transcript: "${transcriptLines.join(' ')}"`,
    }
    if (openId) {
      setDossiers((prev) =>
        prev.map((d) =>
          d.id === openId
            ? { ...d, status: 'Synced', updatedAt: 'just now', messages: [...d.messages, summaryMessage, ...liveMessages] }
            : d
        )
      )
    } else {
      const newDossier: Dossier = {
        id: Date.now().toString(),
        client: 'New recording',
        subject: `Voice note — ${formatTime(seconds)}`,
        status: 'Synced',
        updatedAt: 'just now',
        messages: [summaryMessage, ...liveMessages],
      }
      setDossiers((prev) => [newDossier, ...prev])
      setOpenId(newDossier.id)
    }
    setSentConfirmation(true)
    setTimeout(() => {
      setRecordingState('idle')
    }, 1200)
  }

  const handleNewConversation = () => {
    const newDossier: Dossier = {
      id: Date.now().toString(),
      client: 'New topic',
      subject: 'Unclassified conversation',
      status: 'Draft',
      updatedAt: 'just now',
      messages: [],
    }
    setDossiers((prev) => [newDossier, ...prev])
    setOpenId(newDossier.id)
  }

  const handleSend = () => {
    if (!input.trim() || !openId) return
    const question = input.trim()
    setInput('')
    setDossiers((prev) =>
      prev.map((d) => (d.id === openId ? { ...d, messages: [...d.messages, { id: Date.now().toString(), role: 'user', content: question }] } : d))
    )
    setTimeout(() => {
      setDossiers((prev) =>
        prev.map((d) =>
          d.id === openId
            ? {
                ...d,
                messages: [
                  ...d.messages,
                  {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `I can draft a meeting note on this ("${question}"). Use the mic below to start recording.`,
                  },
                ],
              }
            : d
        )
      )
    }, 500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header: title + info tooltip + expand */}
      <div className={`flex items-center gap-2 ${pad} pb-2 border-b border-slate-200 flex-shrink-0`}>
        <div className="w-7 h-7 rounded-lg bg-rad-indigo-100 flex items-center justify-center flex-shrink-0">
          <Mic size={14} className="text-rad-indigo-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-900 flex-1 truncate">CRM+ Agent · Meena</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1 rounded hover:bg-slate-100 transition flex-shrink-0" title="Learn more">
              <Info size={14} className="text-slate-400" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p className="font-semibold text-white mb-1">Draft meeting notes by voice</p>
            <ul className="space-y-0.5 text-slate-300">
              <li>• Voice recording with live transcript</li>
              <li>• Ask the AI questions while recording</li>
              <li>• Automatic sync with CRM+</li>
            </ul>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onOpenMeena?.()}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition flex-shrink-0"
            >
              <Maximize2 size={14} className="text-slate-500" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">Expand into a window</TooltipContent>
        </Tooltip>
      </div>

      {isSessionActive ? (
        /* Recording session — controls, live transcript, ask-AI, send to CRM+ */
        <div className="flex h-full flex-col overflow-hidden">
          {/* Controls bar */}
          <div className={`${pad} py-2 border-b border-slate-200 flex-shrink-0`}>
            {recordingState === 'stopped' ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
                <span className="text-2xs font-medium text-slate-700 flex-1">Recording stopped — {formatTime(seconds)}</span>
                {sentConfirmation ? (
                  <span className="text-2xs font-medium text-emerald-600">Sent to CRM+ ✓</span>
                ) : (
                  <>
                    <button onClick={discardRecording} className="px-2 py-1 rounded text-2xs font-medium text-slate-500 hover:bg-slate-200 transition">
                      Discard
                    </button>
                    <button
                      onClick={handleSendToCrm}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-rad-indigo-600 hover:bg-rad-indigo-700 text-white text-2xs font-medium transition"
                    >
                      <Upload size={11} />
                      Send to CRM+
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${recordingState === 'recording' ? 'bg-red-50 border-red-200' : 'bg-slate-100 border-slate-300'}`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${recordingState === 'recording' ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className={`text-2xs font-medium flex-1 ${recordingState === 'recording' ? 'text-red-700' : 'text-slate-700'}`}>
                  {recordingState === 'recording' ? 'Recording…' : 'Paused'} {formatTime(seconds)}
                </span>
                {recordingState === 'recording' ? (
                  <button onClick={pauseRecording} className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 text-2xs font-medium text-slate-700 transition">
                    <Pause size={11} />
                    Pause
                  </button>
                ) : (
                  <button onClick={resumeRecording} className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-50 text-2xs font-medium text-slate-700 transition">
                    <Play size={11} />
                    Resume
                  </button>
                )}
                <button onClick={stopRecording} className="flex items-center gap-1 px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-2xs font-medium transition">
                  <Square size={11} />
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Live transcript + ask-AI thread, scrollable */}
          <div className={`flex-1 overflow-y-auto ${pad} space-y-3`}>
            <div>
              <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Live transcript</p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-1 min-h-[60px]">
                {transcriptLines.length === 0 ? (
                  <p className="text-2xs text-slate-400 italic">Listening…</p>
                ) : (
                  transcriptLines.map((line, i) => (
                    <p key={i} className="text-2xs text-slate-700 leading-relaxed">{line}</p>
                  ))
                )}
                {recordingState === 'recording' && scriptIndex < TRANSCRIPT_SCRIPT.length && (
                  <p className="text-2xs text-slate-400 italic">Transcribing…</p>
                )}
              </div>
            </div>

            {liveMessages.length > 0 && (
              <div>
                <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Questions to the AI</p>
                <div className="space-y-1.5">
                  {liveMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-2xs leading-snug ${
                          msg.role === 'user' ? 'bg-rad-indigo-600 text-white' : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Ask AI while recording */}
          {recordingState !== 'stopped' && (
            <div className={`border-t border-slate-200 bg-white ${isCompact ? 'p-2' : 'p-3'} flex-shrink-0`}>
              <div className="relative">
                <input
                  type="text"
                  value={liveInput}
                  onChange={(e) => setLiveInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskLive()}
                  placeholder="Ask the AI about this meeting..."
                  className="w-full h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-2xs focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500"
                />
                <button onClick={handleAskLive} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-rad-indigo-50 rounded transition">
                  <Send size={14} className="text-rad-indigo-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Idle: start recording (topic detail only — list view pairs it with "New conversation" below) */}
          {openDossier && (
            <div className={`${pad} py-2 border-b border-slate-200 flex-shrink-0`}>
              <button
                onClick={startRecording}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rad-indigo-600 hover:bg-rad-indigo-700 text-white text-2xs font-medium transition"
              >
                <Mic size={13} />
                Record a note for this topic
              </button>
            </div>
          )}

          {openDossier ? (
            /* Topic detail: message history + composer */
            <>
              <div className={`flex items-center gap-2 ${pad} py-2 border-b border-slate-200 flex-shrink-0`}>
                <button onClick={() => setOpenId(null)} className="p-1 rounded hover:bg-slate-100 transition">
                  <ArrowLeft size={14} className="text-slate-600" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{openDossier.client}</p>
                  <p className="text-2xs text-slate-500 truncate">{openDossier.subject}</p>
                </div>
                <span
                  className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                    openDossier.status === 'Synced' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {openDossier.status}
                </span>
              </div>

              <div className={`flex-1 overflow-y-auto ${pad} space-y-1.5`}>
                {openDossier.messages.length === 0 && (
                  <p className="text-2xs text-slate-400 text-center pt-6">No messages yet — ask a question or record a note above.</p>
                )}
                {openDossier.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-2xs leading-snug ${
                        msg.role === 'user' ? 'bg-rad-indigo-600 text-white' : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className={`border-t border-slate-200 bg-white ${isCompact ? 'p-2' : 'p-3'} flex-shrink-0`}>
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Continue the conversation..."
                    className="w-full h-8 rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-2xs focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500"
                  />
                  <button onClick={handleSend} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 hover:bg-rad-indigo-50 rounded transition">
                    <Send size={14} className="text-rad-indigo-600" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Topics list */
            <div className={`flex-1 overflow-y-auto ${pad} space-y-2`}>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={startRecording}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rad-indigo-600 hover:bg-rad-indigo-700 text-white text-2xs font-medium transition"
                >
                  <Mic size={14} />
                  Start recording
                </button>
                <button
                  onClick={handleNewConversation}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-rad-indigo-300 text-rad-indigo-700 hover:bg-rad-indigo-50 transition text-2xs font-medium"
                >
                  <Plus size={14} />
                  New conversation
                </button>
              </div>

              <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide pt-1">Recent topics</p>
              <div className="space-y-1.5">
                {dossiers.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setOpenId(d.id)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-rad-indigo-300 hover:bg-rad-indigo-50/40 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-2xs font-semibold text-slate-900 truncate">{d.client}</p>
                      <p className="text-2xs text-slate-500 truncate">{d.subject}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className={`text-2xs px-1.5 py-0.5 rounded font-medium ${
                          d.status === 'Synced' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d.status}
                      </span>
                      <span className="text-2xs text-slate-400 flex items-center gap-0.5">
                        <Clock size={10} />
                        {d.updatedAt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
