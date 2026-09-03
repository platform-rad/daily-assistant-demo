import type { WorkspaceDoc } from './types'
import { src } from './client'

/* ──────────────────────────────────────────────────────────────
   CBS / CAP — Client Business Strategy & Client Action Plan
   ────────────────────────────────────────────────────────────── */
export const CBS_DOC: WorkspaceDoc = {
  id: 'cbs',
  kind: 'CBS / CAP',
  title: 'Client Business Strategy & Client Action Plan 2026–2027',
  subtitle: 'AeroDynamics Group SA — Corporate Coverage EMEA / Industrials',
  reference: 'CBS-2026-ADYN-004',
  updatedAt: '2 septembre 2026, 07:14',
  author: 'Généré par l’agent CBS/CAPs — revu par É. Mercier',
  confidence: 94,
  blocks: [
    {
      id: 'cbs-b1',
      kind: 'h1',
      text: '1. Synthèse de la relation',
    },
    {
      id: 'cbs-b2',
      kind: 'kpi',
      cells: [
        {
          label: 'Exposition Groupe',
          value: '€385 M',
          delta: '+€40 M YoY',
          trend: 'up',
          sources: [src('C3', 'Exposition consolidée toutes entités', '1 sept. 2026')],
        },
        {
          label: 'PNB YTD 2026',
          value: '€14,2 M',
          delta: '+11 %',
          trend: 'up',
          sources: [src('Baccarat', 'PNB par métier, arrêté au 31 août', '31 août 2026')],
        },
        {
          label: 'RoRWA',
          value: '1,84 %',
          delta: '−12 bps',
          trend: 'down',
          sources: [src('Baccarat', 'Rentabilité ajustée du risque', '31 août 2026')],
        },
        {
          label: 'Part de wallet estimée',
          value: '~19 %',
          trend: 'flat',
          dataGap:
            'Donnée Baccarat non disponible sur les métiers Transaction Banking et Global Markets — estimation extrapolée depuis le wallet Financement uniquement.',
          sources: [src('Baccarat', 'Couverture partielle : Financement seulement', '31 août 2026')],
        },
      ],
    },
    {
      id: 'cbs-b3',
      kind: 'paragraph',
      text: 'AeroDynamics Group est un équipementier aéronautique de rang 1 couvert par BNP Paribas depuis 2011. La relation est historiquement centrée sur le financement (RCF, Term Loan A, DCM) avec une pénétration nettement plus faible sur les métiers de flux et de marchés. La montée en cadence des programmes civils et le capex associé pèsent sur la structure financière, tandis que la revue stratégique de la division Défense ouvre une fenêtre de conseil M&A significative sur les douze prochains mois.',
      sources: [
        src('C3', 'Fiche relation et historique de couverture', '1 sept. 2026'),
        src('Orbit', 'Comptes rendus de visite 2025-2026', '18 août 2026'),
      ],
      confidence: 96,
    },
    {
      id: 'cbs-b4',
      kind: 'h1',
      text: '2. Position de crédit et structure de dette',
    },
    {
      id: 'cbs-b5',
      kind: 'bullets',
      items: [
        'Dette nette / EBITDA à 3,2× au H1 2026, contre 2,8× au FY25 — covenant maximum contractuel à 3,75×, soit un headroom résiduel de 0,55×.',
        'Couverture des intérêts (EBITDA / charges financières nettes) à 6,1×, en repli depuis 7,4× au FY24.',
        'Échéancier concentré : €250 M de RCF en juin 2027 et €500 M de Senior Notes 1,875 % en avril 2027 — soit €750 M à refinancer sur un même exercice.',
        'Notation S&P BBB− perspective stable ; un franchissement durable de 3,5× exposerait le client à une révision de perspective.',
        'Le capex de montée en cadence est estimé à €410 M sur 2026-2027, dont environ 60 % déjà engagés.',
      ],
      sources: [
        src('Atlas', 'Documentation LMA et certificats de conformité', '14 août 2026'),
        src('Bloomberg', 'Spread secondaire Notes 2027 : 148 bps', '1 sept. 2026'),
      ],
      confidence: 92,
    },
    {
      id: 'cbs-b6',
      kind: 'callout',
      text: 'Point d’attention crédit — la concentration de €750 M de maturités sur l’exercice 2027 constitue le principal sujet de la prochaine revue de comité. Une approche de refinancement anticipé dès le T4 2026 est recommandée pour lisser le mur de dette.',
      sources: [src('Atlas', 'Échéancier consolidé de la dette', '28 août 2026')],
      confidence: 89,
    },
    {
      id: 'cbs-b7',
      kind: 'h1',
      text: '3. Plan d’action commercial (CAP)',
    },
    {
      id: 'cbs-b8',
      kind: 'opportunity',
      text: 'Refinancement anticipé de la RCF €250 M avec extension de maturité à 5 ans et introduction d’une marge indexée sur deux KPI de décarbonation. Objectif : sécuriser le rôle de Coordinateur et améliorer le RoRWA de la ligne.',
      meta: {
        product: 'Loans & Syndication',
        revenue: '€2,4 M',
        horizon: 'T4 2026 — lancement 3 novembre',
        owner: 'É. Mercier / Loan Syndication EMEA',
        probability: '65 %',
      },
      sources: [
        src('Atlas', 'Facility FAC-2023-0187', '28 août 2026'),
        src('Dealogic', 'Pricing comparable secteur A&D : E+135/165 bps', '30 août 2026'),
      ],
      confidence: 93,
    },
    {
      id: 'cbs-b9',
      kind: 'opportunity',
      text: 'Mandat sell-side sur la cession de la division Défense (CA ~€780 M). Positionnement conjoint Coverage / M&A EMEA Industrials, avec pitch de valorisation à présenter avant la fin du T3.',
      meta: {
        product: 'M&A Advisory',
        revenue: '€5,1 M',
        horizon: 'T4 2026 — T2 2027',
        owner: 'M&A EMEA Industrials',
        probability: '40 %',
      },
      sources: [
        src('Presse', 'Ouverture de la revue stratégique — 1er sept. 2026', '1 sept. 2026'),
        src('Dealogic', 'Multiples de transaction secteur défense : 9,5×–11,2× EBITDA', '30 août 2026'),
      ],
      confidence: 78,
    },
    {
      id: 'cbs-b10',
      kind: 'opportunity',
      text: 'Programme de couverture matières premières (titane, aluminium) sur horizon 24 mois. White spot confirmé : le client n’est équipé sur aucun sous-jacent commodities, alors que 5 de ses 6 peers le sont.',
      meta: {
        product: 'Global Markets — Commodities',
        revenue: '€0,7 M',
        horizon: 'T1 2027',
        owner: 'Global Markets Corporate Solutions',
        probability: '30 %',
      },
      sources: [src('Bloomberg', 'Volatilité titane +34 % sur 12 mois', '1 sept. 2026')],
      dataGap:
        'Donnée Baccarat non disponible sur les revenus commodities des peers — la comparaison de part de wallet reste indicative.',
      confidence: 71,
    },
    {
      id: 'cbs-b11',
      kind: 'h1',
      text: '4. Prochaines étapes',
    },
    {
      id: 'cbs-b12',
      kind: 'bullets',
      items: [
        '15 sept. 2026 — Call CFO : cadrage du calendrier de refinancement et sondage sur le mandat sell-side.',
        '30 sept. 2026 — Passage en comité de crédit pour validation de l’enveloppe finale.',
        '20 oct. 2026 — Remise du pitch de refinancement (structure, pricing indicatif, KPI ESG).',
        '3 nov. 2026 — Lancement de la syndication sous réserve des conditions de marché.',
      ],
      sources: [src('Orbit', 'Plan de contact validé en revue de portefeuille', '29 août 2026')],
      confidence: 90,
    },
  ],
}

/* ──────────────────────────────────────────────────────────────
   Briefing Memo — préparation du call CFO
   ────────────────────────────────────────────────────────────── */
export const MEMO_DOC: WorkspaceDoc = {
  id: 'memo',
  kind: 'Briefing Memo',
  title: 'Briefing Memo — Call CFO du 15 septembre 2026',
  subtitle: 'AeroDynamics Group SA — préparation Senior Banker',
  reference: 'MEMO-2026-ADYN-017',
  updatedAt: '2 septembre 2026, 07:16',
  author: 'Généré par l’agent Briefing memo — revu par É. Mercier',
  confidence: 89,
  blocks: [
    {
      id: 'memo-b1',
      kind: 'h1',
      text: '1. Objet et participants',
    },
    {
      id: 'memo-b2',
      kind: 'paragraph',
      text: 'Call de 45 minutes avec Marc Ferrand (Group CFO) et Sonia Kessler (Group Treasurer). Objectif : cadrer le calendrier de refinancement 2027 et tester l’ouverture du client sur un mandat de conseil pour la division Défense. Côté BNP Paribas : É. Mercier (Senior Banker), T. Nakamura (Loan Syndication), A. Beaulieu (M&A Industrials).',
      sources: [src('Orbit', 'Invitation et ordre du jour partagés le 28 août', '28 août 2026')],
      confidence: 95,
    },
    {
      id: 'memo-b3',
      kind: 'h1',
      text: '2. Ce qui a changé depuis le dernier contact',
    },
    {
      id: 'memo-b4',
      kind: 'bullets',
      items: [
        'Ouverture confirmée d’une revue stratégique sur la division Défense (~€780 M de CA) — annonce du 1er septembre.',
        'Levier en hausse à 3,2× au H1 2026, headroom de covenant réduit à 0,55×.',
        'Spread secondaire des Notes 2027 élargi de 22 bps sur le mois écoulé, à 148 bps.',
        'Nomination d’un nouveau Directeur des achats groupe, ex-Safran — angle d’entrée possible sur le financement de la supply chain.',
      ],
      sources: [
        src('Presse', 'Revue de presse sectorielle agrégée', '1 sept. 2026'),
        src('Bloomberg', 'Spreads secondaires — clôture du 1er sept.', '1 sept. 2026'),
      ],
      confidence: 87,
    },
    {
      id: 'memo-b5',
      kind: 'kpi',
      cells: [
        {
          label: 'Dette nette / EBITDA',
          value: '3,2×',
          delta: '+0,4×',
          trend: 'down',
          sources: [src('Atlas', 'Certificat de conformité H1 2026', '14 août 2026')],
        },
        {
          label: 'Headroom covenant',
          value: '0,55×',
          trend: 'down',
          sources: [src('Atlas', 'Covenant maximum 3,75×', '14 août 2026')],
        },
        {
          label: 'Maturités 2027',
          value: '€750 M',
          trend: 'flat',
          sources: [src('Atlas', 'RCF €250 M + Notes €500 M', '28 août 2026')],
        },
        {
          label: 'Part de wallet Trans. Banking',
          value: '~12 %',
          trend: 'flat',
          dataGap:
            'Donnée Baccarat non disponible — estimation issue d’un échantillon de flux sur 3 mois seulement.',
        },
      ],
    },
    {
      id: 'memo-b6',
      kind: 'h1',
      text: '3. Messages clés à porter',
    },
    {
      id: 'memo-b7',
      kind: 'bullets',
      items: [
        'Proposer un refinancement anticipé de la RCF dès le T4 2026 pour désynchroniser les deux échéances de 2027.',
        'Positionner la structure Sustainability-Linked comme levier de pricing (jusqu’à −7,5 bps sur atteinte des KPI).',
        'Se rendre disponible sur le volet conseil de la revue stratégique, sans forcer le mandat à ce stade.',
        'Ouvrir la discussion sur la couverture matières premières, en s’appuyant sur la volatilité titane.',
      ],
      confidence: 84,
    },
    {
      id: 'memo-b8',
      kind: 'callout',
      text: 'Sujet sensible — le client a exprimé en mai 2026 des réserves sur la documentation ESG jugée trop contraignante en reporting. Anticiper une objection sur la charge administrative des KPI et préparer l’argument d’un reporting annuel unique adossé au rapport de durabilité existant.',
      sources: [src('Orbit', 'Compte rendu de visite du 12 mai 2026', '12 mai 2026')],
      confidence: 81,
    },
    {
      id: 'memo-b9',
      kind: 'h1',
      text: '4. Questions à poser',
    },
    {
      id: 'memo-b10',
      kind: 'bullets',
      items: [
        'Quel est le calendrier envisagé pour la revue stratégique de la division Défense ?',
        'Le budget capex 2027 est-il susceptible d’être revu à la baisse pour préserver le levier ?',
        'Le refinancement des Notes 2027 sera-t-il traité en obligataire ou basculé partiellement en bancaire ?',
        'La refonte du cash pooling multi-devises fera-t-elle l’objet d’un RFP formel au T4 ?',
      ],
      confidence: 92,
    },
  ],
}

export const DOCS: Record<'cbs' | 'memo', WorkspaceDoc> = {
  cbs: CBS_DOC,
  memo: MEMO_DOC,
}
