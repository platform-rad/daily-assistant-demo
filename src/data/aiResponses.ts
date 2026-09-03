import type { DocBlock } from './types'
import { src } from './client'
import { uid } from '@/lib/utils'

interface Recipe {
  /** Mots-clés déclencheurs (recherche insensible à la casse/accents). */
  match: string[]
  reply: string
  build: () => DocBlock[]
}

/**
 * Moteur de réponse 100 % local. Aucun LLM n'est appelé : on choisit une
 * recette par mots-clés, sinon on retombe sur une opportunité générique.
 */
const RECIPES: Recipe[] = [
  {
    match: ['esg', 'rse', 'durable', 'sustainability', 'transition', 'decarbonation'],
    reply:
      'J’ai ajouté une opportunité Sustainable Finance pour 2026 dans la section « Plan d’action commercial ». Elle s’appuie sur la trajectoire de décarbonation publiée par le client et sur trois structures Sustainability-Linked comparables du secteur. La donnée de scope 3 reste partielle — je l’ai signalée.',
    build: () => [
      {
        id: uid('ai'),
        kind: 'opportunity',
        aiGenerated: true,
        text: 'Conversion de la RCF €250 M en Sustainability-Linked Loan avec trois KPI : intensité carbone scope 1 & 2 (−18 % d’ici 2029), part d’aluminium recyclé dans les approvisionnements (≥ 35 %) et taux d’accidents du travail. Ajustement de marge de ±7,5 bps. La structure permet d’aligner le refinancement 2027 sur la trajectoire de transition publiée par le client en février 2026.',
        meta: {
          product: 'Sustainable Finance / Loans',
          revenue: '€0,9 M',
          horizon: 'T4 2026 — arrimé au refinancement RCF',
          owner: 'Sustainable Finance Desk / É. Mercier',
          probability: '35 %',
        },
        sources: [
          src('ESG Hub', 'Trajectoire de décarbonation publiée en février 2026', '20 août 2026'),
          src('Dealogic', '3 SLL comparables secteur A&D EMEA depuis 2024', '30 août 2026'),
        ],
        dataGap:
          'Données scope 3 non auditées à date — le KPI d’approvisionnement devra être confirmé avec l’équipe Sustainable Finance avant toute proposition ferme.',
        confidence: 82,
      },
    ],
  },
  {
    match: ['m&a', 'acquisition', 'cession', 'sell-side', 'defense', 'défense', 'conseil'],
    reply:
      'J’ai inséré une opportunité M&A sell-side sur la division Défense, avec la fourchette de valorisation issue des transactions comparables Dealogic. Le calendrier reste indicatif tant que le client n’a pas confirmé de processus formel.',
    build: () => [
      {
        id: uid('ai'),
        kind: 'opportunity',
        aiGenerated: true,
        text: 'Mandat de conseil sell-side sur la cession de la division Défense (CA ~€780 M, EBITDA ~€94 M). Fourchette de valorisation indicative de €890 M à €1,05 Md sur la base de multiples de 9,5× à 11,2× l’EBITDA observés sur trois transactions comparables. Positionnement conjoint Coverage / M&A EMEA Industrials avec pitch de valorisation avant fin septembre.',
        meta: {
          product: 'M&A Advisory',
          revenue: '€5,1 M',
          horizon: 'T4 2026 — T2 2027',
          owner: 'M&A EMEA Industrials',
          probability: '40 %',
        },
        sources: [
          src('Dealogic', 'Multiples de transaction secteur défense EMEA', '30 août 2026'),
          src('Presse', 'Ouverture de la revue stratégique — 1er sept. 2026', '1 sept. 2026'),
        ],
        confidence: 77,
      },
    ],
  },
  {
    match: ['cash', 'flux', 'pooling', 'transaction banking', 'trésorerie', 'tresorerie'],
    reply:
      'Opportunité Transaction Banking ajoutée. Notre part de wallet sur les flux est le principal écart de la relation : 12 % contre 31 % en financement.',
    build: () => [
      {
        id: uid('ai'),
        kind: 'opportunity',
        aiGenerated: true,
        text: 'Refonte du cash pooling multi-devises EUR / USD / GBP couvrant 14 entités dans 9 pays, avec centralisation des paiements fournisseurs et mise en place d’un programme de supply chain finance sur le premier cercle de sous-traitants. Un RFP formel est attendu au T4 2026.',
        meta: {
          product: 'Transaction Banking',
          revenue: '€1,3 M',
          horizon: 'RFP T4 2026 — mise en œuvre S1 2027',
          owner: 'Transaction Banking EMEA',
          probability: '50 %',
        },
        sources: [src('Orbit', 'Compte rendu de visite du 18 août 2026', '18 août 2026')],
        dataGap:
          'Donnée Baccarat non disponible sur les volumes de flux réels — la part de wallet de 12 % reste une estimation sur échantillon de 3 mois.',
        confidence: 68,
      },
    ],
  },
  {
    match: ['risque', 'covenant', 'levier', 'credit', 'crédit', 'notation', 'rating'],
    reply:
      'J’ai ajouté un encadré de synthèse crédit reprenant le levier, le headroom de covenant et le mur de dette 2027, sourcé sur Atlas.',
    build: () => [
      {
        id: uid('ai'),
        kind: 'callout',
        aiGenerated: true,
        text: 'Synthèse crédit — levier à 3,2× au H1 2026 pour un covenant maximum de 3,75×, soit un headroom de 0,55× en repli sur trois trimestres consécutifs. €750 M de maturités concentrées sur l’exercice 2027. Une révision de perspective S&P deviendrait probable en cas de franchissement durable de 3,5×. Recommandation : traiter le refinancement de la RCF en anticipé dès le T4 2026.',
        sources: [
          src('Atlas', 'Certificat de conformité H1 2026 et échéancier consolidé', '14 août 2026'),
          src('C3', 'Exposition Groupe €385 M', '1 sept. 2026'),
        ],
        confidence: 90,
      },
    ],
  },
  {
    match: ['refinanc', 'rcf', 'syndication', 'loan', 'maturité', 'maturite'],
    reply:
      'Opportunité de refinancement insérée, avec le pricing indicatif issu des comparables Dealogic et la fenêtre de lancement recommandée.',
    build: () => [
      {
        id: uid('ai'),
        kind: 'opportunity',
        aiGenerated: true,
        text: 'Refinancement anticipé de la RCF €250 M avec extension de maturité à 5 ans (+1+1) et augmentation de l’enveloppe à €300 M pour absorber le capex de montée en cadence. Pricing indicatif E+140 bps sur la base des comparables secteur. Lancement recommandé le 3 novembre 2026, sous réserve des conditions de marché.',
        meta: {
          product: 'Loans & Syndication',
          revenue: '€2,4 M',
          horizon: 'Lancement 3 novembre 2026',
          owner: 'Loan Syndication EMEA',
          probability: '65 %',
        },
        sources: [
          src('Dealogic', 'Pricing comparable secteur A&D : E+135/165 bps', '30 août 2026'),
          src('Atlas', 'Facility FAC-2023-0187', '28 août 2026'),
        ],
        confidence: 91,
      },
    ],
  },
]

const GENERIC: Recipe = {
  match: [],
  reply:
    'J’ai ajouté un nouveau bloc d’opportunité dans le document à partir des signaux disponibles sur le client. Les sources sont indiquées sur le bloc — merci de vérifier le montant de revenu estimé avant diffusion.',
  build: () => [
    {
      id: uid('ai'),
      kind: 'opportunity',
      aiGenerated: true,
      text: 'Financement de la montée en cadence industrielle : mise en place d’une ligne de crédit dédiée de €150 M adossée au programme capex 2026-2027, avec tirage progressif par tranches semestrielles. Permet de préserver la RCF comme ligne de liquidité pure et d’améliorer la lisibilité du levier auprès des agences.',
      meta: {
        product: 'Structured Finance',
        revenue: '€1,1 M',
        horizon: 'S1 2027',
        owner: 'É. Mercier / Structured Finance EMEA',
        probability: '30 %',
      },
      sources: [
        src('C3', 'Enveloppe capex communiquée par le client', '1 sept. 2026'),
        src('Atlas', 'Structure de dette existante', '28 août 2026'),
      ],
      confidence: 69,
    },
  ],
}

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function resolveAiResponse(prompt: string) {
  const p = normalize(prompt)
  const recipe = RECIPES.find((r) => r.match.some((m) => p.includes(normalize(m)))) ?? GENERIC
  return { reply: recipe.reply, blocks: recipe.build() }
}

/** Suggestions affichées sous le champ de saisie du chat. */
export const CHAT_SUGGESTIONS = [
  'Ajoute une opportunité ESG pour 2026',
  'Résume le risque de covenant',
  'Ajoute le mandat M&A sur la division Défense',
  'Complète avec une opportunité cash management',
]
