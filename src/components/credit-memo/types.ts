// Credit Memo Data Models - Aligned with platform-rad repository

export enum SectionStatus {
  WaitingGeneration = 'waiting_generation',
  Generating = 'generating',
  Preview = 'preview',
  Altered = 'altered',
  Approved = 'approved',
  Validated = 'validated',
  Error = 'error',
}

// Content Block Data Types
export interface TextBlockData {
  markdown: string
}

export interface TableBlockData {
  columns: string[]
  rows: Record<string, string | number>[]
  caption?: string
}

export interface ChartSeries {
  name: string
  data: number[]
  labels?: string[]
}

export interface ChartBlockData {
  chartType: 'bar' | 'line' | 'pie' | 'area'
  series: ChartSeries[]
  title?: string
}

// Content Block
export interface ContentBlock {
  id: string
  type: 'text' | 'table' | 'chart'
  order: number
  data: TextBlockData | TableBlockData | ChartBlockData
}

// Section
export interface Section {
  id: string
  parentId: string | null
  title: string
  order: number
  status: SectionStatus
  blocks: ContentBlock[]
  aiBlocks: ContentBlock[]
  pendingAiBlocks: ContentBlock[] | null
  contentVersion: number
  lastUpdatedAt: string | null
  agentName: string
  subsections: Section[]
}

// Chat Message
export interface ChatMessage {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  timestamp: string
  agentName?: string
  eventType?: string
  sectionId?: string
  taggedSectionId?: string
  embeddedBlocks?: ContentBlock[]
  actionable?: boolean
  actionTaken?: boolean
}

// Annual Review State
export interface AnnualReviewState {
  sessionId: string | null
  companyName: string | null
  reviewPeriod: string | null
  sections: Section[]
  chatMessages: ChatMessage[]
  isConnected: boolean
  taggedSectionId: string | null
  loading: boolean
  error: string | null
  highlightedSectionId: string | null
  pendingEmbeddedBlocks: ContentBlock[]
  pendingAiBlockId: string | null
}
