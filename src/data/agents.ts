import type { Agent } from './types'

/** Catalogue des agents de la banque exposés dans le Daily Assistant. */
export const AGENTS: Agent[] = [
  {
    id: 'client-market-intel',
    name: 'Client & market intelligence',
    category: 'Intelligence',
    icon: 'Radar',
    description: 'Veille consolidée client, secteur et marchés de capitaux.',
    pending: 4,
  },
  {
    id: 'action-calls',
    name: 'Action and calls in client ecosystem',
    category: 'Intelligence',
    icon: 'PhoneCall',
    description: 'Actions et calls réalisés sur l’écosystème du client.',
    pending: 2,
  },
  {
    id: 'early-warning',
    name: 'Early warning signal',
    category: 'Risque',
    icon: 'AlertTriangle',
    description: 'Signaux faibles de dégradation crédit et covenants.',
    pending: 1,
  },
  {
    id: 'white-spot',
    name: 'White spot detector',
    category: 'Origination',
    icon: 'Crosshair',
    description: 'Produits non équipés vs. peer group du client.',
    pending: 3,
  },
  {
    id: 'prospects-finder',
    name: 'Prospects finder',
    category: 'Origination',
    icon: 'Search',
    description: 'Prospects prioritaires sur le portefeuille sectoriel.',
    pending: 0,
  },
  {
    id: 'deal-duplicator',
    name: 'Deal duplicator',
    category: 'Origination',
    icon: 'Copy',
    description: 'Réplication d’un deal gagné sur des clients comparables.',
    pending: 2,
  },
  {
    id: 'predictable-event',
    name: 'Predictable event mapper',
    category: 'Origination',
    icon: 'CalendarClock',
    description: 'Maturités, AG, publications et fenêtres de refinancement.',
    pending: 5,
  },
  {
    id: 'cbs-cap',
    name: 'CBS/CAPs',
    category: 'Production de documents',
    icon: 'FileSpreadsheet',
    description: 'Client Business Strategy & Client Action Plan.',
    pending: 1,
    producesDocument: true,
  },
  {
    id: 'opportunity-radar',
    name: '360 client opportunity radar',
    category: 'Origination',
    icon: 'Compass',
    description: 'Vue 360 des opportunités cross-métiers.',
    pending: 6,
  },
  {
    id: 'briefing-memo',
    name: 'Briefing memo',
    category: 'Production de documents',
    icon: 'FileText',
    description: 'Mémo de préparation de rendez-vous client.',
    pending: 2,
    producesDocument: true,
  },
  {
    id: 'pitch-generator',
    name: 'Pitch generator',
    category: 'Production de documents',
    icon: 'Presentation',
    description: 'Trame de pitch produit à partir du CBS.',
    pending: 0,
    producesDocument: true,
  },
  {
    id: 'executive-narrative',
    name: 'Executive narrative agent',
    category: 'Production de documents',
    icon: 'Sparkles',
    description: 'Narratif senior management en 10 lignes.',
    pending: 1,
    producesDocument: true,
  },
]

/** Les 3 priorités épinglées par défaut dans le header de l'assistant. */
export const DEFAULT_PINNED = ['client-market-intel', 'cbs-cap', 'briefing-memo']

export const MAX_PINNED = 3
