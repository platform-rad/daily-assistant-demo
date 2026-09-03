import type { HostRoute, SourceRef } from './types'
import { src } from './client'

/**
 * « Pouls » de la page d'accueil : chaque agent alimente un ou deux KPI.
 * Seuls les KPI des agents épinglés par l'utilisateur sont affichés, ce qui
 * rend l'accueil réellement personnalisé.
 */
export interface PulseKpi {
  id: string
  agentId: string
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  /** Sens métier de la variation : une hausse n'est pas toujours une bonne nouvelle. */
  tone: 'good' | 'bad' | 'neutral'
  caption: string
  sources: SourceRef[]
  /** Écrans hôtes où ce KPI est prioritaire. */
  contexts: HostRoute[]
  /** Question envoyée à l'IA quand l'utilisateur clique sur « creuser ». */
  deepDive: string
}

export const PULSE_KPIS: PulseKpi[] = [
  /* ── Client & market intelligence ── */
  {
    id: 'kpi-signals',
    agentId: 'client-market-intel',
    label: 'Signaux 24 h',
    value: '5',
    delta: '+2',
    trend: 'up',
    tone: 'neutral',
    caption: 'dont 2 en priorité haute',
    sources: [src('Presse', 'Revue de presse sectorielle agrégée', '2 sept. 2026')],
    contexts: ['client', 'client-edit'],
    deepDive: 'Résume les 5 signaux des dernières 24 h sur AeroDynamics',
  },
  {
    id: 'kpi-spread',
    agentId: 'client-market-intel',
    label: 'Spread Notes 2027',
    value: '148 bps',
    delta: '+22 bps',
    trend: 'up',
    tone: 'bad',
    caption: 'élargissement sur 30 jours',
    sources: [src('Bloomberg', 'Spread secondaire — clôture du 1er sept.', '1 sept. 2026')],
    contexts: ['client', 'credit'],
    deepDive: 'Pourquoi le spread des Notes 2027 s’est-il élargi de 22 bps ?',
  },

  /* ── CBS/CAPs ── */
  {
    id: 'kpi-cbs',
    agentId: 'cbs-cap',
    label: 'CBS à réviser',
    value: '3',
    delta: '1 en retard',
    trend: 'flat',
    tone: 'bad',
    caption: 'sur 24 groupes couverts',
    sources: [src('Orbit', 'Statut des CBS/CAP du portefeuille', '1 sept. 2026')],
    contexts: ['client-edit', 'portfolio', 'client'],
    deepDive: 'Quels CBS/CAP dois-je réviser en priorité et pourquoi ?',
  },
  {
    id: 'kpi-wallet',
    agentId: 'cbs-cap',
    label: 'Part de wallet',
    value: '~19 %',
    delta: '−2 pts',
    trend: 'down',
    tone: 'bad',
    caption: 'estimation partielle',
    sources: [src('Baccarat', 'Couverture partielle : financement seulement', '31 août 2026')],
    contexts: ['client', 'portfolio'],
    deepDive: 'Décompose notre part de wallet chez AeroDynamics par métier',
  },

  /* ── Briefing memo ── */
  {
    id: 'kpi-rdv',
    agentId: 'briefing-memo',
    label: 'RDV à préparer',
    value: '2',
    delta: 'le 15 sept.',
    trend: 'flat',
    tone: 'neutral',
    caption: 'prochain : call CFO',
    sources: [src('Orbit', 'Agenda de couverture', '2 sept. 2026')],
    contexts: ['client', 'client-edit', 'credit'],
    deepDive: 'Que dois-je préparer pour le call CFO du 15 septembre ?',
  },

  /* ── Early warning signal ── */
  {
    id: 'kpi-headroom',
    agentId: 'early-warning',
    label: 'Headroom covenant',
    value: '0,55×',
    delta: '−0,18×',
    trend: 'down',
    tone: 'bad',
    caption: '3e trimestre de repli',
    sources: [src('Atlas', 'Certificat de conformité H1 2026', '14 août 2026')],
    contexts: ['credit', 'client'],
    deepDive: 'Quel est le risque de franchissement de covenant sur AeroDynamics ?',
  },

  /* ── 360 client opportunity radar ── */
  {
    id: 'kpi-opps',
    agentId: 'opportunity-radar',
    label: 'Opportunités ouvertes',
    value: '11',
    delta: '+3',
    trend: 'up',
    tone: 'good',
    caption: '€18,4 M pondérés',
    sources: [src('Orbit', 'Pipeline Industrials EMEA', '1 sept. 2026')],
    contexts: ['portfolio', 'pipeline'],
    deepDive: 'Quelles sont mes 3 meilleures opportunités du trimestre ?',
  },

  /* ── Predictable event mapper ── */
  {
    id: 'kpi-echeances',
    agentId: 'predictable-event',
    label: 'Échéances < 90 j',
    value: '4',
    delta: '€750 M',
    trend: 'flat',
    tone: 'neutral',
    caption: 'maturités et comités',
    sources: [src('Atlas', 'Échéancier consolidé', '28 août 2026')],
    contexts: ['client', 'pipeline', 'credit'],
    deepDive: 'Liste les échéances des 90 prochains jours et ce qu’elles impliquent',
  },

  /* ── White spot detector ── */
  {
    id: 'kpi-whitespots',
    agentId: 'white-spot',
    label: 'White spots',
    value: '6',
    delta: '+1',
    trend: 'up',
    tone: 'good',
    caption: 'produits non équipés',
    sources: [src('Baccarat', 'Comparaison au peer group', '31 août 2026')],
    contexts: ['client', 'portfolio', 'pipeline'],
    deepDive: 'Quels produits mes clients n’ont-ils pas et que leurs peers ont ?',
  },

  /* ── Deal duplicator ── */
  {
    id: 'kpi-replicables',
    agentId: 'deal-duplicator',
    label: 'Deals réplicables',
    value: '3',
    delta: '€9,2 M',
    trend: 'up',
    tone: 'good',
    caption: 'structures transposables',
    sources: [src('Dealogic', 'Deals comparables du secteur', '30 août 2026')],
    contexts: ['pipeline', 'portfolio'],
    deepDive: 'Quels deals récents puis-je répliquer sur mon portefeuille ?',
  },

  /* ── Prospects finder ── */
  {
    id: 'kpi-prospects',
    agentId: 'prospects-finder',
    label: 'Prospects qualifiés',
    value: '8',
    delta: '+2',
    trend: 'up',
    tone: 'good',
    caption: 'Industrials EMEA',
    sources: [src('Dealogic', 'Sociétés du secteur non couvertes', '30 août 2026')],
    contexts: ['portfolio', 'pipeline'],
    deepDive: 'Présente-moi les prospects qualifiés du trimestre',
  },

  /* ── Action and calls in client ecosystem ── */
  {
    id: 'kpi-calls',
    agentId: 'action-calls',
    label: 'Calls écosystème',
    value: '7',
    delta: '30 j',
    trend: 'flat',
    tone: 'neutral',
    caption: 'dont 3 hors couverture',
    sources: [src('Orbit', 'Comptes rendus de l’écosystème client', '1 sept. 2026')],
    contexts: ['client', 'portfolio'],
    deepDive: 'Qui a parlé à l’écosystème AeroDynamics ces 30 derniers jours ?',
  },

  /* ── Pitch generator ── */
  {
    id: 'kpi-pitchs',
    agentId: 'pitch-generator',
    label: 'Pitchs en attente',
    value: '2',
    delta: 'à envoyer',
    trend: 'flat',
    tone: 'neutral',
    caption: 'refi RCF et green bond',
    sources: [src('Orbit', 'Statut des pitchs', '1 sept. 2026')],
    contexts: ['pipeline', 'client'],
    deepDive: 'Où en sont mes pitchs en attente ?',
  },

  /* ── Executive narrative agent ── */
  {
    id: 'kpi-narratif',
    agentId: 'executive-narrative',
    label: 'Narratif senior',
    value: 'À jour',
    trend: 'flat',
    tone: 'good',
    caption: 'révisé le 1er sept.',
    sources: [src('Orbit', 'Note senior management', '1 sept. 2026')],
    contexts: ['portfolio', 'client'],
    deepDive: 'Donne-moi le narratif senior management sur AeroDynamics en 10 lignes',
  },
]

/** Suggestions d'action de la page d'accueil, sensibles à l'écran hôte. */
export interface HomeSuggestion {
  id: string
  label: string
  /** 'ask' pose la question à l'IA, 'cbs'/'memo' ouvrent le document. */
  kind: 'ask' | 'cbs' | 'memo'
  prompt?: string
  contexts: HostRoute[]
}

export const HOME_SUGGESTIONS: HomeSuggestion[] = [
  {
    id: 'sug-call',
    label: 'Préparer le call CFO du 15 sept.',
    kind: 'memo',
    contexts: ['client', 'client-edit', 'credit'],
  },
  {
    id: 'sug-refi',
    label: 'Cadrer le refinancement 2027',
    kind: 'ask',
    prompt: 'Cadre le refinancement 2027 d’AeroDynamics : calendrier, structure, pricing',
    contexts: ['client', 'pipeline', 'credit'],
  },
  {
    id: 'sug-cbs',
    label: 'Mettre à jour le CBS/CAP',
    kind: 'cbs',
    contexts: ['client-edit', 'client', 'portfolio'],
  },
  {
    id: 'sug-peers',
    label: 'Comparer au peer group',
    kind: 'ask',
    prompt: 'Compare AeroDynamics à son peer group sur le levier et la part de wallet',
    contexts: ['client', 'portfolio'],
  },
  {
    id: 'sug-portfolio',
    label: 'Où concentrer mon effort ce mois-ci ?',
    kind: 'ask',
    prompt: 'Sur quels groupes de mon portefeuille dois-je concentrer mon effort ce mois-ci ?',
    contexts: ['portfolio', 'pipeline'],
  },
  {
    id: 'sug-credit',
    label: 'Préparer le comité du 30 sept.',
    kind: 'ask',
    prompt: 'Que dois-je préparer pour le comité de crédit du 30 septembre ?',
    contexts: ['credit'],
  },
]
