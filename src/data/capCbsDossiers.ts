/* Source unique des dossiers CAP/CBS — partagée entre le tableau de bord (gauche),
   la page de détail (gauche) et le mini-panel assistant (droite). L'état vivant est
   porté par App.tsx ; ce fichier ne fournit que le type et les données initiales. */

export interface DossierMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type CapCbsStatus = 'Draft' | 'Pending Review' | 'Validated'

export interface CapCbsDossier {
  id: string
  client: string
  sector: string
  status: CapCbsStatus
  createdAt: string
  updatedAt: string
  pilotBanker: string
  nextReview: string
  /** Courte note "ce qui a changé" affichée dans les listes/flux d'activité. */
  note: string
  /** Conversation avec l'IA à propos de ce dossier — conservée pour reprendre le contexte. */
  messages: DossierMessage[]
}

export const INITIAL_CAP_CBS_DOSSIERS: CapCbsDossier[] = [
  {
    id: 'cc1',
    client: 'AeroDynamics Group',
    sector: 'Aerospace & Defence',
    status: 'Pending Review',
    createdAt: '12 janv. 2026',
    updatedAt: 'il y a 2h',
    pilotBanker: 'É. Mercier',
    nextReview: 'mars 2027',
    note: 'ESG axis updated 2h ago — submitted for review',
    messages: [
      { id: 'm1', role: 'assistant', content: '3 of 5 axes completed. The ESG axis was updated by É. Mercier 2h ago and submitted for Pilot Banker review.' },
    ],
  },
  {
    id: 'cc2',
    client: 'TechCorp France',
    sector: 'Technology',
    status: 'Validated',
    createdAt: '3 mars 2026',
    updatedAt: '2 sept. 2026',
    pilotBanker: 'É. Mercier',
    nextReview: 'sept. 2027',
    note: 'Validated Sep 2, 2026',
    messages: [
      { id: 'm1', role: 'assistant', content: 'CBS/CAP validated — data frozen until the next review (Sep 2027).' },
    ],
  },
  {
    id: 'cc3',
    client: 'Manufacturing Ltd',
    sector: 'Manufacturing',
    status: 'Pending Review',
    createdAt: '20 juin 2026',
    updatedAt: 'il y a 6h',
    pilotBanker: 'A. Beaulieu',
    nextReview: 'juin 2027',
    note: 'New EMEA region contribution — submitted for review',
    messages: [
      { id: 'm1', role: 'assistant', content: 'The EMEA region added a contribution on the IB/TB/GM angle axis. Awaiting Pilot Banker review.' },
    ],
  },
  {
    id: 'cc4',
    client: 'Financial Services Inc',
    sector: 'Finance',
    status: 'Validated',
    createdAt: '8 févr. 2026',
    updatedAt: '18 août 2026',
    pilotBanker: 'T. Nakamura',
    nextReview: 'févr. 2027',
    note: 'Validated',
    messages: [],
  },
  {
    id: 'cc5',
    client: 'Helvetia Ports SA',
    sector: 'Infrastructure',
    status: 'Draft',
    createdAt: '2 sept. 2026',
    updatedAt: 'il y a 1j',
    pilotBanker: 'É. Mercier',
    nextReview: 'sept. 2027',
    note: 'Context axis updated',
    messages: [],
  },
]
