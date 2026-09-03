/* ──────────────────────────────────────────────────────────────
   Modèle de données du prototype. 100 % mocké — aucune API, aucun LLM.
   ────────────────────────────────────────────────────────────── */

export type SourceSystem =
  | 'C3'
  | 'Dealogic'
  | 'Baccarat'
  | 'Orbit'
  | 'Bloomberg'
  | 'ESG Hub'
  | 'Atlas'
  | 'Presse'

export interface SourceRef {
  system: SourceSystem
  /** Détail affiché au survol du badge. */
  detail: string
  /** Fraîcheur de la donnée. */
  asOf: string
}

export type AgentCategory =
  | 'Intelligence'
  | 'Origination'
  | 'Risque'
  | 'Production de documents'

export interface Agent {
  id: string
  name: string
  category: AgentCategory
  /** Icône lucide (nom du composant). */
  icon: string
  description: string
  /** Nombre d'items en attente — alimente les pastilles. */
  pending: number
  /** L'agent ouvre-t-il un document co-éditable dans le Workspace ? */
  producesDocument?: boolean
}

export type AlertSeverity = 'high' | 'medium' | 'low'

/** Écrans simulés de l'application hôte MyClientDev. */
export type HostRoute =
  | 'portfolio'
  | 'client'
  | 'client-edit'
  | 'pipeline'
  | 'credit'

export interface BriefingAlert {
  id: string
  agentId: string
  severity: AlertSeverity
  time: string
  title: string
  summary: string
  tags: string[]
  sources: SourceRef[]
  confidence: number
  /** Écrans hôtes où ce signal est le plus pertinent. */
  contexts: HostRoute[]
  /** Actions rapides proposées sous l'alerte. */
  actions: Array<{ label: string; target: 'cbs' | 'memo' | 'none' }>
}

export type BlockKind =
  | 'h1'
  | 'h2'
  | 'paragraph'
  | 'bullets'
  | 'kpi'
  | 'opportunity'
  | 'callout'

export interface KpiCell {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  sources?: SourceRef[]
  dataGap?: string
}

export interface DocBlock {
  id: string
  kind: BlockKind
  /** Texte principal, éditable à la main dans le Workspace. */
  text?: string
  items?: string[]
  cells?: KpiCell[]
  sources?: SourceRef[]
  /** Message affiché dans le badge "Data Gap" si la donnée est partielle. */
  dataGap?: string
  confidence?: number
  /** Bloc issu du chat IA (mise en évidence temporaire). */
  aiGenerated?: boolean
  /** Métadonnées d'un bloc "opportunity". */
  meta?: {
    product?: string
    revenue?: string
    horizon?: string
    owner?: string
    probability?: string
  }
}

export interface WorkspaceDoc {
  id: 'cbs' | 'memo'
  kind: string
  title: string
  subtitle: string
  reference: string
  updatedAt: string
  author: string
  confidence: number
  blocks: DocBlock[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  /** Blocs insérés dans le document par cette réponse. */
  insertedBlockIds?: string[]
  pending?: boolean
  /** Passage sélectionné auquel se rapporte le message. */
  quote?: string
  /**
   * Permet d'annuler une retouche. On conserve un instantané complet des blocs
   * plutôt que le texte d'un seul bloc : une retouche peut toucher plusieurs
   * blocs à la fois, en supprimer, ou vider des puces.
   */
  revert?: { blocks: DocBlock[] }
}
