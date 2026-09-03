import type { SourceRef } from './types'

export const CLIENT = {
  name: 'AeroDynamics Group',
  legalName: 'AeroDynamics Group SA',
  ticker: 'ADYN.PA',
  sector: 'Aerospace & Defence — Tier 1 supplier',
  country: 'France',
  clientId: 'C3-4471902',
  segment: 'Corporate Coverage — Large Cap EMEA',
  rating: 'BBB− / stable',
  ratingAgency: 'S&P (dernière revue 12 mai 2026)',
  coverage: 'Élodie Mercier — Senior Banker',
  parentGroup: 'AeroDynamics Holding NV',
  employees: '31 400',
  lastContact: '18 août 2026 — call CFO (Q2 results debrief)',
}

export const CLIENT_METRICS: Array<{
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  hint: string
}> = [
  {
    label: 'Chiffre d’affaires FY25',
    value: '€4,82 Md',
    delta: '+8,4 %',
    trend: 'up',
    hint: 'Publication annuelle du 26 février 2026',
  },
  {
    label: 'EBITDA ajusté',
    value: '€612 M',
    delta: '+3,1 %',
    trend: 'up',
    hint: 'Marge 12,7 % (vs 13,3 % FY24)',
  },
  {
    label: 'Dette nette / EBITDA',
    value: '3,2×',
    delta: '+0,4×',
    trend: 'down',
    hint: 'Covenant maximum : 3,75×',
  },
  {
    label: 'Exposition Groupe',
    value: '€385 M',
    delta: '+€40 M',
    trend: 'up',
    hint: 'Dont €250 M RCF non tiré',
  },
  {
    label: 'PNB YTD',
    value: '€14,2 M',
    delta: '+11 %',
    trend: 'up',
    hint: 'Budget annuel : €18,5 M (77 % atteint)',
  },
  {
    label: 'RoRWA',
    value: '1,84 %',
    delta: '−12 bps',
    trend: 'down',
    hint: 'Seuil de rentabilité métier : 1,60 %',
  },
]

export const CLIENT_FACILITIES = [
  {
    id: 'FAC-2023-0187',
    product: 'Revolving Credit Facility',
    amount: '€250 M',
    share: 'BNPP €45 M (18 %)',
    maturity: '30 juin 2027',
    role: 'Mandated Lead Arranger, Facility Agent',
    status: 'Actif — non tiré',
  },
  {
    id: 'FAC-2024-0912',
    product: 'Term Loan A',
    amount: '€180 M',
    share: 'BNPP €40 M (22 %)',
    maturity: '15 mars 2029',
    role: 'Bookrunner',
    status: 'Actif — tiré à 100 %',
  },
  {
    id: 'BND-2021-0044',
    product: 'Senior Unsecured Notes 1,875 %',
    amount: '€500 M',
    share: 'BNPP — Joint Bookrunner',
    maturity: '22 avril 2027',
    role: 'DCM',
    status: 'En circulation',
  },
  {
    id: 'HDG-2025-0231',
    product: 'Cross-currency swap EUR/USD',
    amount: '$120 M notionnel',
    share: 'BNPP 100 %',
    maturity: '31 décembre 2028',
    role: 'Global Markets',
    status: 'Actif',
  },
]

export const CLIENT_PIPELINE = [
  {
    name: 'Refinancement RCF 2027',
    product: 'Loans / Syndication',
    revenue: '€2,4 M',
    stage: 'Pitch envoyé',
    probability: '65 %',
    owner: 'É. Mercier',
  },
  {
    name: 'Acquisition Helion Composites',
    product: 'M&A Advisory',
    revenue: '€5,1 M',
    stage: 'Mandat en discussion',
    probability: '40 %',
    owner: 'M&A EMEA Industrials',
  },
  {
    name: 'Sustainability-Linked Loan conversion',
    product: 'Sustainable Finance',
    revenue: '€0,9 M',
    stage: 'Qualification',
    probability: '35 %',
    owner: 'Sustainable Finance Desk',
  },
  {
    name: 'Cash pooling multi-devises',
    product: 'Cash Management',
    revenue: '€1,3 M',
    stage: 'RFP à venir',
    probability: '50 %',
    owner: 'Transaction Banking',
  },
]

export const SOURCE_LABELS: Record<string, { name: string; blurb: string }> = {
  C3: { name: 'C3', blurb: 'Référentiel client et exposition Groupe' },
  Dealogic: { name: 'Dealogic', blurb: 'League tables et deals de marché' },
  Baccarat: { name: 'Baccarat', blurb: 'Données de revenus et de rentabilité' },
  Orbit: { name: 'Orbit', blurb: 'Pipeline commercial et comptes rendus' },
  Bloomberg: { name: 'Bloomberg', blurb: 'Données de marché et spreads' },
  'ESG Hub': { name: 'ESG Hub', blurb: 'Scores et trajectoires de transition' },
  Atlas: { name: 'Atlas', blurb: 'Documentation crédit et covenants' },
  Presse: { name: 'Presse', blurb: 'Revue de presse sectorielle agrégée' },
}

export const src = (system: SourceRef['system'], detail: string, asOf: string): SourceRef => ({
  system,
  detail,
  asOf,
})
