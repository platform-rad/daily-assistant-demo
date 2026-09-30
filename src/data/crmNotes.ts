/* Source unique des notes CRM+ — partagée entre l'agent CRM+ (droite) et l'onglet
   "Actions IA" de la fiche client (gauche). L'état vivant est porté par App.tsx ;
   ce fichier ne fournit que le type et les données initiales. */

import type { DossierMessage } from './capCbsDossiers'

export type { DossierMessage }

export type CrmNoteStatus = 'Draft' | 'Pending Review' | 'Synced'

export interface CrmNote {
  id: string
  client: string
  subject: string
  status: CrmNoteStatus
  updatedAt: string
  /** Conversation avec l'IA à propos de cette note — conservée pour reprendre le contexte. */
  messages: DossierMessage[]
}

export const INITIAL_CRM_NOTES: CrmNote[] = [
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
    status: 'Pending Review',
    updatedAt: 'Aug 12, 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Note transcribed and awaiting your approval before it syncs to CRM+.' },
    ],
  },
  {
    id: 'd3',
    client: 'Manufacturing Ltd',
    subject: 'Covenant follow-up Q2',
    status: 'Draft',
    updatedAt: 'Aug 5, 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'Draft note — not yet submitted for review.' },
    ],
  },
]
