import type { BriefingAlert } from './types'
import { src } from './client'

/** Daily Briefing — alertes marché produites par les agents pendant la nuit. */
export const BRIEFING_ALERTS: BriefingAlert[] = [
  {
    id: 'alert-1',
    agentId: 'client-market-intel',
    severity: 'high',
    time: '07:12',
    title: 'AeroDynamics ouvre la revue stratégique de sa division Défense',
    summary:
      'Le CFO a confirmé hier soir l’ouverture d’une revue stratégique sur la division Défense (CA ~€780 M). Deux fonds mid-cap et un industriel allemand seraient déjà approchés. Fenêtre M&A sell-side sur T4 2026.',
    tags: ['M&A', 'Sell-side', 'Défense'],
    sources: [
      src('Presse', 'Dépêche sectorielle — 1er sept. 2026, 22:40', '1 sept. 2026'),
      src('Dealogic', '3 transactions comparables sur le segment depuis 18 mois', '31 août 2026'),
    ],
    confidence: 91,
    contexts: ['client', 'client-edit', 'pipeline'],
    actions: [
      { label: 'Générer Briefing Memo', target: 'memo' },
      { label: 'Générer CBS/CAP', target: 'cbs' },
    ],
  },
  {
    id: 'alert-2',
    agentId: 'predictable-event',
    severity: 'high',
    time: '06:45',
    title: 'RCF €250 M : fenêtre de refinancement à 10 mois de la maturité',
    summary:
      'La RCF syndiquée de €250 M arrive à maturité le 30 juin 2027. Les 4 dernières opérations comparables du secteur ont été lancées à M−10. Fenêtre optimale : octobre-novembre 2026.',
    tags: ['Refinancement', 'Loans', 'Syndication'],
    sources: [
      src('Atlas', 'Facility FAC-2023-0187 — documentation LMA', '28 août 2026'),
      src('Dealogic', 'Timing médian de relaunch secteur A&D EMEA', '30 août 2026'),
    ],
    confidence: 94,
    contexts: ['client', 'pipeline', 'client-edit'],
    actions: [
      { label: 'Générer CBS/CAP', target: 'cbs' },
      { label: 'Générer Briefing Memo', target: 'memo' },
    ],
  },
  {
    id: 'alert-3',
    agentId: 'early-warning',
    severity: 'medium',
    time: '06:30',
    title: 'Levier à 3,2× — marge de covenant réduite à 0,55×',
    summary:
      'La dette nette / EBITDA remonte à 3,2× au H1 2026 (vs 2,8× au FY25) sous l’effet du capex de montée en cadence. Le covenant maximum est à 3,75×. Headroom en repli pour le 3e trimestre consécutif.',
    tags: ['Crédit', 'Covenant', 'Early warning'],
    sources: [
      src('Atlas', 'Certificat de conformité H1 2026', '14 août 2026'),
      src('C3', 'Exposition Groupe consolidée €385 M', '1 sept. 2026'),
    ],
    confidence: 88,
    contexts: ['credit', 'client'],
    actions: [{ label: 'Générer CBS/CAP', target: 'cbs' }],
  },
  {
    id: 'alert-4',
    agentId: 'white-spot',
    severity: 'medium',
    time: '06:05',
    title: 'White spot : aucun produit de couverture matières premières',
    summary:
      '5 des 6 peers d’AeroDynamics ont mis en place des couvertures titane et aluminium sur 24 mois. Le client n’est équipé sur aucun sous-jacent commodities chez BNPP ni, à notre connaissance, ailleurs.',
    tags: ['Global Markets', 'Commodities', 'White spot'],
    sources: [
      src('Baccarat', 'Revenus Global Markets par sous-jacent', '31 août 2026'),
      src('Bloomberg', 'Volatilité titane +34 % sur 12 mois', '1 sept. 2026'),
    ],
    confidence: 76,
    contexts: ['client', 'pipeline'],
    actions: [{ label: 'Générer CBS/CAP', target: 'cbs' }],
  },
  {
    id: 'alert-5',
    agentId: 'opportunity-radar',
    severity: 'low',
    time: '05:50',
    title: 'Cash management : RFP multi-devises attendue au T4',
    summary:
      'Le Group Treasurer a mentionné en comité une refonte du cash pooling EUR/USD/GBP. Notre part de wallet Transaction Banking est estimée à 12 %, contre 31 % en financement.',
    tags: ['Transaction Banking', 'Cash Management'],
    sources: [
      src('Orbit', 'Compte rendu de visite du 18 août 2026', '18 août 2026'),
      src('Baccarat', 'Part de wallet Transaction Banking — estimation partielle', '31 août 2026'),
    ],
    confidence: 64,
    contexts: ['portfolio', 'client', 'pipeline'],
    actions: [{ label: 'Générer CBS/CAP', target: 'cbs' }],
  },

  /* ── Signaux propres aux autres écrans de MyClientDev ── */
  {
    id: 'alert-6',
    agentId: 'early-warning',
    severity: 'high',
    time: '06:20',
    title: 'Ferrovia Lombarda : covenant de levier franchi à 4,6× (max 4,50×)',
    summary:
      'Le certificat de conformité du H1 2026 fait ressortir un levier de 4,6× contre un maximum contractuel de 4,50×. Un waiver est en négociation. Le dossier passe en comité de crédit le 30 septembre.',
    tags: ['Crédit', 'Breach', 'Waiver'],
    sources: [
      src('Atlas', 'Certificat de conformité H1 2026 — Ferrovia Lombarda', '29 août 2026'),
      src('C3', 'Exposition Groupe €268 M', '1 sept. 2026'),
    ],
    confidence: 96,
    contexts: ['credit', 'portfolio'],
    actions: [{ label: 'Générer Briefing Memo', target: 'memo' }],
  },
  {
    id: 'alert-7',
    agentId: 'opportunity-radar',
    severity: 'medium',
    time: '06:10',
    title: 'Portefeuille : 7 groupes sur 24 sans couverture de taux',
    summary:
      'Sept groupes du portefeuille Industrials EMEA portent de la dette à taux variable sans instrument de couverture, pour un notionnel cumulé de €1,4 Md. La pente de courbe s’est accentuée de 34 bps sur le trimestre.',
    tags: ['Portefeuille', 'Global Markets', 'White spot'],
    sources: [
      src('C3', 'Structures de dette consolidées — 24 groupes', '1 sept. 2026'),
      src('Bloomberg', 'Pente 2 ans / 10 ans EUR', '1 sept. 2026'),
    ],
    confidence: 83,
    contexts: ['portfolio'],
    actions: [{ label: 'Générer CBS/CAP', target: 'cbs' }],
  },
  {
    id: 'alert-8',
    agentId: 'deal-duplicator',
    severity: 'medium',
    time: '05:58',
    title: 'Green bond Nordwind : structure réplicable sur 3 groupes du pipeline',
    summary:
      'Le green bond inaugural de €400 M monté pour Nordwind Turbines est transposable à Iberia Chemicals, AeroDynamics et Helvetia Precision — profils de notation et de trajectoire de transition comparables.',
    tags: ['Deal duplicator', 'DCM', 'Sustainable Finance'],
    sources: [
      src('Dealogic', 'Structure et pricing du green bond Nordwind', '30 août 2026'),
      src('ESG Hub', 'Trajectoires de transition comparées', '20 août 2026'),
    ],
    confidence: 79,
    contexts: ['pipeline', 'portfolio'],
    actions: [{ label: 'Générer CBS/CAP', target: 'cbs' }],
  },
  {
    id: 'alert-9',
    agentId: 'cbs-cap',
    severity: 'medium',
    time: '05:40',
    title: 'Fiche client désynchronisée du CBS/CAP sur 3 champs',
    summary:
      'La stratégie et le plan d’action de la fiche datent de février 2026. Le CBS/CAP en cours contient trois éléments plus récents : la revue stratégique Défense, le levier à 3,2× et l’opportunité Sustainability-Linked.',
    tags: ['CBS/CAP', 'Qualité de donnée'],
    sources: [
      src('C3', 'Fiche client — dernière modification 26 février 2026', '1 sept. 2026'),
      src('Orbit', 'CBS-2026-ADYN-004 — révisé le 2 septembre', '2 sept. 2026'),
    ],
    confidence: 87,
    contexts: ['client-edit'],
    actions: [{ label: 'Générer CBS/CAP', target: 'cbs' }],
  },
]
