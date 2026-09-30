import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Pause, Play, Send, Clock, ArrowLeft, ArrowUpRight, Plus, Info, Maximize2, Upload, Pencil, FileDown, ShieldCheck, AlertTriangle, Building2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { PORTFOLIO_CLIENTS } from '@/data/portfolio'
import type { CrmNote, CrmNoteStatus } from '@/data/crmNotes'
import type { DossierMessage } from '@/data/capCbsDossiers'

interface CrmAgentPageProps {
  onOpenMeena?: () => void
  /** Ouvre la fiche du client donné (route hôte 'client') — chaque note a son propre client,
   *  contrairement à une simple navigation de route sans paramètre. */
  onReviewOnClientPage?: (clientName: string) => void
  /** Active client from the left panel, used to pre-fill a new recording's subject. */
  currentClientName?: string
  /** Source unique — partagée avec l'onglet "Actions IA" de la fiche client, à gauche. */
  notes: CrmNote[]
  onAddNote: (note: CrmNote) => void
  onUpdateNote: (id: string, patch: Partial<CrmNote>) => void
  onAddMessage: (id: string, message: DossierMessage) => void
  isCompact?: boolean
}

const STATUS_STYLE: Record<CrmNoteStatus, string> = {
  Synced: 'bg-emerald-100 text-emerald-700',
  'Pending Review': 'bg-amber-100 text-amber-700',
  Draft: 'bg-slate-100 text-slate-600',
}

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

/** Dedicated sidepanel work plan for the CRM+ Agent (Meena) — record, transcribe, ask, and keep the
 *  conversation as memory. The final approval that syncs a note to CRM+ always happens on the
 *  client's page, to the left — this panel only points there. */
export function CrmAgentPage({ onOpenMeena, onReviewOnClientPage, currentClientName, notes, onAddNote, onUpdateNote, onAddMessage, isCompact = true }: CrmAgentPageProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  // Which client a new recording/conversation should be filed under. Pre-filled from the
  // left panel when a client fiche is open; otherwise the user picks one explicitly —
  // there's no implicit "New recording" bucket anymore.
  const [selectedClient, setSelectedClient] = useState(currentClientName || '')

  useEffect(() => {
    if (currentClientName) setSelectedClient(currentClientName)
  }, [currentClientName])

  // Recording session state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [transcriptLines, setTranscriptLines] = useState<string[]>([])
  const [scriptIndex, setScriptIndex] = useState(0)
  const [liveMessages, setLiveMessages] = useState<DossierMessage[]>([])
  const [liveInput, setLiveInput] = useState('')
  const [sentConfirmation, setSentConfirmation] = useState(false)
  const [editedTranscript, setEditedTranscript] = useState('')

  const endRef = useRef<HTMLDivElement>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)
  const pad = isCompact ? 'px-3 py-3' : 'px-4 py-4'

  const openNote = notes.find((n) => n.id === openId) || null
  const isSessionActive = recordingState !== 'idle'

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [openNote?.messages.length])

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
  const stopRecording = () => {
    setEditedTranscript(transcriptLines.join(' '))
    setRecordingState('stopped')
  }
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
    const summaryMessage: DossierMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🎙️ Voice note transcribed (${formatTime(seconds)}). Transcript: "${editedTranscript}"`,
    }
    if (openId) {
      onUpdateNote(openId, { status: 'Pending Review', updatedAt: 'just now' })
      onAddMessage(openId, summaryMessage)
      liveMessages.forEach((m) => onAddMessage(openId, m))
    } else {
      const newNote: CrmNote = {
        id: Date.now().toString(),
        client: selectedClient || 'Unclassified',
        subject: `Voice note — ${formatTime(seconds)}`,
        status: 'Pending Review',
        updatedAt: 'just now',
        messages: [summaryMessage, ...liveMessages],
      }
      onAddNote(newNote)
      setOpenId(newNote.id)
    }
    setSentConfirmation(true)
    setTimeout(() => {
      setRecordingState('idle')
    }, 1200)
  }

  const handleNewConversation = () => {
    const newNote: CrmNote = {
      id: Date.now().toString(),
      client: selectedClient || 'Unclassified',
      subject: 'New conversation',
      status: 'Draft',
      updatedAt: 'just now',
      messages: [],
    }
    onAddNote(newNote)
    setOpenId(newNote.id)
  }

  const handleSend = () => {
    if (!input.trim() || !openId) return
    const question = input.trim()
    setInput('')
    onAddMessage(openId, { id: Date.now().toString(), role: 'user', content: question })
    setTimeout(() => {
      onAddMessage(openId, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I can draft a meeting note on this ("${question}"). Use the mic below to start recording.`,
      })
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
                  <span className="text-2xs font-medium text-amber-600">Submitted for review ✓</span>
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
                      Submit for Review
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
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide">Transcript</p>
                  <span className="text-2xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">Source: voice, auto-transcribed</span>
                </div>
                {recordingState === 'stopped' && (
                  <span className="flex items-center gap-1 text-2xs text-slate-400">
                    <Pencil size={10} />
                    Editable
                  </span>
                )}
              </div>
              {recordingState === 'stopped' ? (
                <textarea
                  value={editedTranscript}
                  onChange={(e) => setEditedTranscript(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white p-2.5 text-2xs text-slate-700 leading-relaxed focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500"
                />
              ) : (
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
              )}
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
            <p className="flex items-start gap-1 text-2xs text-slate-400 pt-1">
              <AlertTriangle size={11} className="mt-0.5 flex-shrink-0" />
              AI-generated transcript — review for accuracy before sending to CRM+.
            </p>
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
          {openNote && (
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

          {openNote ? (
            /* Topic detail: message history (kept as memory/context) + composer */
            <>
              <div className={`flex items-center gap-2 ${pad} py-2 border-b border-slate-200 flex-shrink-0`}>
                <button onClick={() => setOpenId(null)} className="p-1 rounded hover:bg-slate-100 transition">
                  <ArrowLeft size={14} className="text-slate-600" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{openNote.client}</p>
                  <p className="text-2xs text-slate-500 truncate">{openNote.subject}</p>
                </div>
                <span className={`text-2xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${STATUS_STYLE[openNote.status]}`}>
                  {openNote.status}
                </span>
                <button
                  onClick={() => alert('Exported as PDF (mock).')}
                  title="Export as PDF"
                  className="p-1 rounded hover:bg-rad-indigo-50 transition flex-shrink-0"
                >
                  <FileDown size={14} className="text-rad-indigo-600" />
                </button>
              </div>

              {openNote.status === 'Pending Review' && (
                <div className={`flex items-center gap-2 ${pad} py-2 bg-amber-50 border-b border-amber-200 flex-shrink-0`}>
                  <ShieldCheck size={14} className="text-amber-600 flex-shrink-0" />
                  <span className="text-2xs text-amber-800 flex-1">Awaiting human review before syncing to CRM+.</span>
                  <button
                    onClick={() => onReviewOnClientPage?.(openNote.client)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-2xs font-medium transition flex-shrink-0"
                  >
                    Review on {openNote.client}'s page
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              )}

              <div className={`flex-1 overflow-y-auto ${pad} space-y-1.5`}>
                {openNote.messages.length === 0 && (
                  <p className="text-2xs text-slate-400 text-center pt-6">No messages yet — ask a question or record a note above.</p>
                )}
                {openNote.messages.map((msg) => (
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
              {/* Which client is this for? Pre-filled from the left panel, editable otherwise. */}
              <div>
                <label className="flex items-center gap-1 text-2xs font-medium text-slate-500 mb-1">
                  <Building2 size={11} />
                  Client
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 bg-white px-2 text-2xs focus:border-rad-indigo-300 focus:outline-none focus:ring-1 focus:ring-rad-indigo-500"
                >
                  <option value="">No client selected</option>
                  {PORTFOLIO_CLIENTS.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

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

              {/* Rend explicite ce que compte le badge de la barre d'onglets — pas de notif sans preuve visible */}
              {notes.some((n) => n.status === 'Pending Review') && (
                <div>
                  <p className="text-2xs font-semibold text-amber-700 uppercase tracking-wide pt-1 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    Needs your review ({notes.filter((n) => n.status === 'Pending Review').length})
                  </p>
                  <div className="space-y-1.5 mt-1">
                    {notes.filter((n) => n.status === 'Pending Review').map((n) => (
                      <div
                        key={n.id}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200"
                      >
                        <button onClick={() => setOpenId(n.id)} className="min-w-0 flex-1 text-left">
                          <p className="text-2xs font-semibold text-slate-900 truncate">{n.client}</p>
                          <p className="text-2xs text-slate-500 truncate">{n.subject}</p>
                        </button>
                        <button
                          onClick={() => onReviewOnClientPage?.(n.client)}
                          title={`Review on ${n.client}'s page`}
                          className="flex items-center gap-0.5 px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-2xs font-medium transition flex-shrink-0"
                        >
                          Review
                          <ArrowUpRight size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wide pt-1">Recent topics</p>
              <div className="space-y-1.5">
                {notes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setOpenId(n.id)}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-rad-indigo-300 hover:bg-rad-indigo-50/40 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-2xs font-semibold text-slate-900 truncate">{n.client}</p>
                      <p className="text-2xs text-slate-500 truncate">{n.subject}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-2xs px-1.5 py-0.5 rounded font-medium ${STATUS_STYLE[n.status]}`}>
                        {n.status}
                      </span>
                      <span className="text-2xs text-slate-400 flex items-center gap-0.5">
                        <Clock size={10} />
                        {n.updatedAt}
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
