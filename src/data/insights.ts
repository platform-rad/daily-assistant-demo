import type { SourceRef } from './types'
import { src } from './client'

/** Réponse structurée de l'assistant dans la conversation d'accueil. */
export interface Insight {
  headline: string
  body: string
  bullets?: string[]
  kpis?: Array<{ label: string; value: string; delta?: string; tone?: 'good' | 'bad' | 'neutral' }>
  sources: SourceRef[]
  confidence: number
  dataGap?: string
  /** Rebonds proposés sous la réponse. */
  followUps: Array<{ label: string; kind: 'ask' | 'cbs' | 'memo'; prompt?: string }>
}

interface Recipe {
  match: string[]
  insight: Insight
}

const RECIPES: Recipe[] = [
  {
    match: ['covenant', 'headroom', 'franchissement', 'levier', 'risque de'],
    insight: {
      headline: 'Risque de covenant : modéré à court terme, sensible dès le T1 2027',
      body: 'Le levier atteint 3,2× au H1 2026 pour un maximum contractuel de 3,75×, soit un headroom de 0,55×. La dégradation est régulière — troisième trimestre consécutif — et tient au capex de montée en cadence plutôt qu’à une érosion de la marge.',
      bullets: [
        'Un EBITDA en repli de 8 % suffirait à franchir le seuil, toutes choses égales par ailleurs.',
        '60 % du capex 2026-2027 est déjà engagé : peu de levier de pilotage à court terme.',
        'S&P révise généralement sa perspective au-delà de 3,5× durablement.',
      ],
      kpis: [
        { label: 'Levier H1 2026', value: '3,2×', delta: '+0,4×', tone: 'bad' },
        { label: 'Headroom', value: '0,55×', delta: '−0,18×', tone: 'bad' },
      ],
      sources: [
        src('Atlas', 'Certificat de conformité H1 2026', '14 août 2026'),
        src('C3', 'Exposition Groupe €385 M', '1 sept. 2026'),
      ],
      confidence: 88,
      followUps: [
        {
          label: 'Et si l’EBITDA baisse de 10 % ?',
          kind: 'ask',
          prompt: 'Simule l’impact d’une baisse d’EBITDA de 10 % sur le covenant d’AeroDynamics',
        },
        { label: 'Documenter dans le CBS/CAP', kind: 'cbs' },
      ],
    },
  },
  {
    match: ['ebitda baisse', 'simule', 'scenario', 'scénario', '10 %'],
    insight: {
      headline: 'Scénario −10 % d’EBITDA : covenant franchi dès le T4 2026',
      body: 'Avec un EBITDA ramené de €612 M à €551 M et une dette nette stable à €1,96 Md, le levier passe à 3,56×. Le covenant à 3,75× n’est pas franchi, mais la marge tombe à 0,19× — un niveau qui déclencherait une discussion de waiver préventif.',
      kpis: [
        { label: 'Levier simulé', value: '3,56×', delta: '+0,36×', tone: 'bad' },
        { label: 'Headroom résiduel', value: '0,19×', tone: 'bad' },
      ],
      sources: [src('Atlas', 'Structure de dette et covenants', '28 août 2026')],
      confidence: 74,
      dataGap:
        'Simulation à dette nette constante : la saisonnalité du BFR au T4 n’est pas modélisée faute de données trimestrielles dans Atlas.',
      followUps: [
        { label: 'Préparer le comité de crédit', kind: 'memo' },
        {
          label: 'Quelles options de waiver ?',
          kind: 'ask',
          prompt: 'Quelles options de waiver ou d’amendement de covenant sont envisageables ?',
        },
      ],
    },
  },
  {
    match: ['signaux', '24 h', '24h', 'quoi de neuf', 'actualite', 'actualité'],
    insight: {
      headline: '5 signaux depuis hier, dont 2 qui appellent une action cette semaine',
      body: 'La revue stratégique de la division Défense est le fait marquant : elle ouvre une fenêtre de conseil M&A sur douze mois. Le second sujet prioritaire est la fenêtre de refinancement de la RCF, qui se referme en novembre.',
      bullets: [
        'Revue stratégique Défense (~€780 M de CA) — fenêtre sell-side T4 2026.',
        'RCF €250 M à M−10 de la maturité — lancement optimal en novembre.',
        'Levier à 3,2×, headroom de covenant réduit à 0,55×.',
        'Aucune couverture matières premières alors que 5 peers sur 6 en ont.',
        'Refonte du cash pooling multi-devises attendue au T4.',
      ],
      sources: [
        src('Presse', 'Dépêche sectorielle du 1er sept.', '1 sept. 2026'),
        src('Dealogic', 'Comparables secteur A&D', '31 août 2026'),
        src('Atlas', 'Documentation crédit', '28 août 2026'),
      ],
      confidence: 91,
      followUps: [
        { label: 'Générer le Briefing Memo', kind: 'memo' },
        {
          label: 'Creuser la piste M&A',
          kind: 'ask',
          prompt: 'Creuse l’opportunité M&A sur la division Défense d’AeroDynamics',
        },
      ],
    },
  },
  {
    match: ['spread', 'bps', 'obligataire', 'marche secondaire', 'marché secondaire'],
    insight: {
      headline: 'Spread +22 bps : effet secteur pour les deux tiers, effet crédit pour le reste',
      body: 'L’élargissement de 22 bps sur trente jours se décompose en environ 14 bps d’effet sectoriel — l’indice A&D EMEA s’est écarté de 13 bps sur la période — et 8 bps d’effet spécifique, concomitants à la publication du levier semestriel.',
      kpis: [
        { label: 'Spread actuel', value: '148 bps', delta: '+22 bps', tone: 'bad' },
        { label: 'Dont effet crédit', value: '≈8 bps', tone: 'bad' },
      ],
      sources: [src('Bloomberg', 'Spreads secondaires et indice sectoriel', '1 sept. 2026')],
      confidence: 79,
      dataGap:
        'Décomposition estimée par écart à l’indice : aucune attribution de performance formelle n’est disponible dans Bloomberg pour cette ligne.',
      followUps: [
        {
          label: 'Impact sur le pricing du refi ?',
          kind: 'ask',
          prompt: 'Quel est l’impact de l’élargissement du spread sur le pricing du refinancement ?',
        },
        { label: 'Ajouter au CBS/CAP', kind: 'cbs' },
      ],
    },
  },
  {
    match: ['call cfo', 'preparer', 'préparer', 'rdv', '15 sept'],
    insight: {
      headline: 'Call CFO du 15 septembre : trois messages, une objection à anticiper',
      body: 'L’objectif est de cadrer le calendrier de refinancement et de tester l’ouverture du client sur un mandat de conseil, sans le forcer à ce stade.',
      bullets: [
        'Proposer un refinancement anticipé de la RCF au T4 pour désynchroniser les deux échéances 2027.',
        'Positionner la structure Sustainability-Linked comme levier de pricing (jusqu’à −7,5 bps).',
        'Se rendre disponible sur le volet conseil de la revue stratégique.',
        'Objection attendue : la charge de reporting ESG, jugée trop lourde en mai 2026.',
      ],
      sources: [
        src('Orbit', 'Compte rendu de visite du 12 mai 2026', '12 mai 2026'),
        src('Atlas', 'Échéancier consolidé', '28 août 2026'),
      ],
      confidence: 86,
      followUps: [
        { label: 'Ouvrir le Briefing Memo complet', kind: 'memo' },
        {
          label: 'Quelles questions poser ?',
          kind: 'ask',
          prompt: 'Quelles questions dois-je poser au CFO lors du call ?',
        },
      ],
    },
  },
  {
    match: ['questions', 'poser'],
    insight: {
      headline: 'Quatre questions à poser, par ordre de rendement',
      body: 'Les deux premières servent le refinancement, les deux suivantes ouvrent des pistes de revenus additionnels.',
      bullets: [
        'Quel calendrier envisagez-vous pour la revue stratégique de la division Défense ?',
        'Le budget capex 2027 peut-il être revu à la baisse pour préserver le levier ?',
        'Le refinancement des Notes 2027 sera-t-il obligataire ou partiellement bancaire ?',
        'La refonte du cash pooling fera-t-elle l’objet d’un RFP formel au T4 ?',
      ],
      sources: [src('Orbit', 'Historique des échanges 2025-2026', '18 août 2026')],
      confidence: 90,
      followUps: [{ label: 'Ouvrir le Briefing Memo', kind: 'memo' }],
    },
  },
  {
    match: ['wallet', 'part de marche', 'part de marché', 'decompose', 'décompose'],
    insight: {
      headline: 'Part de wallet : forte en financement, marginale sur les flux',
      body: 'L’écart entre métiers est le principal gisement de la relation. Nous sommes bien positionnés là où le capital est consommé, peu là où il ne l’est pas.',
      kpis: [
        { label: 'Financement', value: '31 %', tone: 'good' },
        { label: 'Transaction Banking', value: '~12 %', tone: 'bad' },
        { label: 'Global Markets', value: '~8 %', tone: 'bad' },
        { label: 'Conseil', value: '0 %', tone: 'bad' },
      ],
      sources: [src('Baccarat', 'Revenus par métier — couverture partielle', '31 août 2026')],
      confidence: 61,
      dataGap:
        'Donnée Baccarat non disponible sur Transaction Banking et Global Markets : les deux chiffres sont extrapolés depuis un échantillon de flux de 3 mois.',
      followUps: [
        {
          label: 'Comment rattraper sur les flux ?',
          kind: 'ask',
          prompt: 'Comment augmenter notre part de wallet Transaction Banking chez AeroDynamics ?',
        },
        { label: 'Ajouter au CBS/CAP', kind: 'cbs' },
      ],
    },
  },
  {
    match: ['m&a', 'defense', 'défense', 'sell-side', 'cession'],
    insight: {
      headline: 'M&A Défense : fenêtre réelle, mais nous ne sommes pas seuls',
      body: 'La division pèse ~€780 M de CA pour ~€94 M d’EBITDA. Sur la base de trois transactions comparables, la fourchette de valorisation ressort entre €890 M et €1,05 Md, soit 9,5× à 11,2× l’EBITDA.',
      kpis: [
        { label: 'Valorisation basse', value: '€890 M', tone: 'neutral' },
        { label: 'Valorisation haute', value: '€1,05 Md', tone: 'neutral' },
        { label: 'Revenu potentiel', value: '€5,1 M', tone: 'good' },
      ],
      sources: [
        src('Dealogic', 'Multiples de transaction secteur défense EMEA', '30 août 2026'),
        src('Presse', 'Ouverture de la revue stratégique', '1 sept. 2026'),
      ],
      confidence: 77,
      dataGap:
        'L’EBITDA de la division n’est pas publié séparément : estimation par application de la marge groupe au chiffre d’affaires segmenté.',
      followUps: [
        { label: 'Documenter dans le CBS/CAP', kind: 'cbs' },
        { label: 'Préparer le Briefing Memo', kind: 'memo' },
      ],
    },
  },
  {
    match: ['portefeuille', 'concentrer', 'effort', 'priorite', 'priorité', 'meilleures'],
    insight: {
      headline: 'Trois groupes concentrent 70 % du revenu additionnel accessible',
      body: 'Le classement croise revenu pondéré, probabilité de closing et échéance. Ferrovia Lombarda est en tête pour une raison défensive : le waiver conditionne le maintien de l’exposition.',
      bullets: [
        'Ferrovia Lombarda — waiver de covenant à négocier avant le 8 octobre (€268 M d’exposition).',
        'Iberia Chemicals — refinancement TLA, mandat déjà obtenu, €3,2 M à sécuriser.',
        'Nordwind Turbines — green bond inaugural €400 M, €4,6 M, closing visé en octobre.',
      ],
      kpis: [
        { label: 'Revenu pondéré', value: '€18,4 M', delta: '+3 opportunités', tone: 'good' },
        { label: 'Taux de conversion', value: '41 %', tone: 'neutral' },
      ],
      sources: [
        src('Orbit', 'Pipeline Industrials EMEA', '1 sept. 2026'),
        src('Atlas', 'Échéances de covenant du portefeuille', '29 août 2026'),
      ],
      confidence: 84,
      followUps: [
        {
          label: 'Détaille le cas Ferrovia',
          kind: 'ask',
          prompt: 'Détaille la situation de covenant de Ferrovia Lombarda',
        },
        { label: 'Générer un CBS/CAP', kind: 'cbs' },
      ],
    },
  },
  {
    match: ['ferrovia', 'lombarda', 'ferrovia lombarda', 'situation', 'waiver', 'breach'],
    insight: {
      headline: 'Ferrovia Lombarda : covenant franchi, waiver à obtenir avant le 8 octobre',
      body: 'Le levier ressort à 4,6× pour un maximum de 4,50×. Le franchissement est avéré, non contesté par le client, et lié à un décalage de livraison sur deux contrats d’infrastructure.',
      kpis: [
        { label: 'Levier', value: '4,6×', delta: 'max 4,50×', tone: 'bad' },
        { label: 'Exposition', value: '€268 M', tone: 'neutral' },
      ],
      sources: [
        src('Atlas', 'Certificat de conformité H1 2026 — Ferrovia', '29 août 2026'),
        src('C3', 'Exposition Groupe', '1 sept. 2026'),
      ],
      confidence: 94,
      followUps: [
        { label: 'Préparer le comité du 30 sept.', kind: 'memo' },
        {
          label: 'Quelles conditions de waiver ?',
          kind: 'ask',
          prompt: 'Quelles conditions de waiver sont usuelles dans ce cas de figure ?',
        },
      ],
    },
  },
  {
    match: [
      'white spot',
      'peers',
      'peer group',
      'compare',
      'non equipe',
      'non équipé',
      'couverture de taux',
      'sans couverture',
    ],
    insight: {
      headline: 'Six produits non équipés, dont deux à forte valeur immédiate',
      body: 'La comparaison au peer group fait ressortir deux manques structurants : la couverture matières premières et la couverture de taux sur la dette à taux variable.',
      bullets: [
        'Couverture titane et aluminium — 5 peers sur 6 équipés, volatilité +34 % sur 12 mois.',
        'Couverture de taux — 7 groupes du portefeuille concernés, €1,4 Md de notionnel.',
        'Supply chain finance — aucun programme, alors que le premier cercle fournisseurs est concentré.',
      ],
      sources: [
        src('Baccarat', 'Revenus par sous-jacent — peer group', '31 août 2026'),
        src('Bloomberg', 'Volatilité titane et pente de courbe', '1 sept. 2026'),
      ],
      confidence: 76,
      dataGap:
        'Donnée Baccarat non disponible sur les revenus commodities des peers : la comparaison reste indicative.',
      followUps: [
        { label: 'Documenter dans le CBS/CAP', kind: 'cbs' },
        {
          label: 'Chiffre le potentiel de revenus',
          kind: 'ask',
          prompt: 'Chiffre le potentiel de revenus des white spots identifiés',
        },
      ],
    },
  },

  /* ── Recettes atteintes par les rebonds des réponses ci-dessus ── */
  {
    match: ['cadre', 'calendrier', 'structure', 'rcf', 'maturite', 'fenetre de refinancement'],
    insight: {
      headline: 'Refinancement 2027 : lancer la RCF en novembre, garder l’obligataire pour le S1',
      body: 'Les €750 M de maturités 2027 doivent être désynchronisés. La RCF, plus simple à exécuter, sert de première étape : elle sécurise la liquidité et envoie un signal au marché avant l’échéance obligataire.',
      bullets: [
        'Fenêtre optimale de lancement : 3 novembre 2026, soit M−8 de la maturité.',
        'Structure visée : €300 M, 5 ans + 1 + 1, marge indexée sur deux KPI de décarbonation.',
        'Traiter les Notes 2027 au S1 2027, une fois la RCF bouclée et le levier stabilisé.',
      ],
      kpis: [
        { label: 'Pricing indicatif', value: 'E+140 bps', tone: 'neutral' },
        { label: 'Revenu attendu', value: '€2,4 M', delta: '65 %', tone: 'good' },
      ],
      sources: [
        src('Dealogic', 'Pricing comparable secteur A&D : E+135/165 bps', '30 août 2026'),
        src('Atlas', 'Facility FAC-2023-0187', '28 août 2026'),
      ],
      confidence: 87,
      followUps: [
        { label: 'Générer le CBS/CAP', kind: 'cbs' },
        {
          label: 'Impact du spread sur le pricing ?',
          kind: 'ask',
          prompt: 'Quel est l’impact de l’élargissement du spread sur le pricing du refinancement ?',
        },
      ],
    },
  },
  {
    match: ['pricing', 'impact', 'elargissement'],
    insight: {
      headline: 'Impact sur le pricing : +8 à +12 bps sur la marge de la RCF',
      body: 'Seule la composante crédit de l’élargissement se transmet au bancaire ; l’effet sectoriel est déjà intégré dans les comparables. Le surcoût reste absorbable et peut être compensé par la structure Sustainability-Linked.',
      kpis: [
        { label: 'Marge sans SLL', value: 'E+148 bps', tone: 'bad' },
        { label: 'Marge avec SLL', value: 'E+140 bps', tone: 'good' },
      ],
      sources: [
        src('Bloomberg', 'Spread secondaire et indice sectoriel', '1 sept. 2026'),
        src('Dealogic', 'Marges des comparables récents', '30 août 2026'),
      ],
      confidence: 72,
      dataGap:
        'Transmission spread obligataire → marge bancaire estimée par élasticité historique du secteur, non par un modèle de pricing interne.',
      followUps: [{ label: 'Documenter dans le CBS/CAP', kind: 'cbs' }],
    },
  },
  {
    match: ['options de waiver', 'conditions de waiver', 'amendement', 'usuelles', 'envisageables'],
    insight: {
      headline: 'Waiver : trois options, de la plus légère à la plus structurante',
      body: 'Sur ce type de franchissement lié à un décalage de livraison, le marché retient rarement la voie la plus dure. Les deux premières options sont les plus probables.',
      bullets: [
        'Waiver ponctuel sur une période de test, contre commission de 15 à 25 bps.',
        'Reset temporaire du covenant à 5,00× sur deux trimestres, avec retour au palier initial.',
        'Amendement structurel avec resserrement des distributions et capex — réservé aux cas récurrents.',
      ],
      sources: [
        src('Atlas', 'Documentation LMA et précédents du portefeuille', '29 août 2026'),
        src('Dealogic', 'Waivers observés sur le secteur infrastructure', '30 août 2026'),
      ],
      confidence: 81,
      followUps: [{ label: 'Préparer le comité de crédit', kind: 'memo' }],
    },
  },
  {
    match: ['augmenter', 'transaction banking', 'rattraper', 'flux', 'cash pooling', 'cash management'],
    insight: {
      headline: 'Flux : le RFP du T4 est la seule vraie fenêtre de l’année',
      body: 'Notre position sur les flux ne bougera pas par petites touches. La refonte du cash pooling multi-devises est le point de bascule : elle rebat les cartes sur 14 entités et 9 pays d’un coup.',
      bullets: [
        'Se positionner avant la publication du RFP, en s’appuyant sur la relation financement.',
        'Adosser une offre de supply chain finance au premier cercle de fournisseurs.',
        'Point d’entrée disponible : la nouvelle Directrice des achats groupe, arrivée en juillet.',
      ],
      kpis: [
        { label: 'Part de wallet flux', value: '~12 %', tone: 'bad' },
        { label: 'Potentiel', value: '€1,3 M', tone: 'good' },
      ],
      sources: [src('Orbit', 'Compte rendu de visite du 18 août 2026', '18 août 2026')],
      confidence: 67,
      dataGap:
        'Donnée Baccarat non disponible sur les volumes de flux réels : la part de wallet de 12 % reste une estimation sur trois mois.',
      followUps: [{ label: 'Ajouter au CBS/CAP', kind: 'cbs' }],
    },
  },
  {
    match: ['chiffre', 'potentiel de revenus'],
    insight: {
      headline: 'White spots : €3,1 M de revenus additionnels sur 18 mois',
      body: 'Le chiffrage retient une hypothèse de pénétration conservatrice, alignée sur nos taux de conversion observés sur produits non équipés.',
      kpis: [
        { label: 'Couverture matières', value: '€0,7 M', tone: 'good' },
        { label: 'Couverture de taux', value: '€1,1 M', tone: 'good' },
        { label: 'Supply chain finance', value: '€1,3 M', tone: 'good' },
        { label: 'Total pondéré', value: '€3,1 M', tone: 'good' },
      ],
      sources: [
        src('Baccarat', 'Revenus unitaires par produit — portefeuille', '31 août 2026'),
        src('Bloomberg', 'Notionnels et volatilités de référence', '1 sept. 2026'),
      ],
      confidence: 63,
      dataGap:
        'Taux de pénétration issu de notre historique interne uniquement : aucune donnée de marché ne permet de le calibrer sur ce segment.',
      followUps: [{ label: 'Documenter dans le CBS/CAP', kind: 'cbs' }],
    },
  },
  {
    match: [
      'repliquer',
      'répliquer',
      'replicable',
      'réplicable',
      'dupliquer',
      'deals recents',
      'green bond',
      'nordwind',
    ],
    insight: {
      headline: 'Trois réplications immédiates, €9,2 M de revenus cumulés',
      body: 'La structure du green bond Nordwind est la plus transposable : profil de notation et trajectoire de transition comparables sur trois groupes du portefeuille.',
      bullets: [
        'Iberia Chemicals — green bond, notation BBB+, trajectoire publiée : le cas le plus proche.',
        'AeroDynamics — conversion de la RCF en Sustainability-Linked plutôt qu’un format obligataire.',
        'Helvetia Precision — format plus petit, à traiter après le RFP cash management.',
      ],
      kpis: [
        { label: 'Revenus cumulés', value: '€9,2 M', tone: 'good' },
        { label: 'Deals réplicables', value: '3', delta: '+1', tone: 'good' },
      ],
      sources: [
        src('Dealogic', 'Structure et pricing du green bond Nordwind', '30 août 2026'),
        src('ESG Hub', 'Trajectoires de transition comparées', '20 août 2026'),
      ],
      confidence: 78,
      followUps: [{ label: 'Générer un CBS/CAP', kind: 'cbs' }],
    },
  },
  {
    match: ['cbs', 'reviser', 'réviser', 'desynchronise', 'désynchronisé'],
    insight: {
      headline: 'Trois CBS à réviser, dont un en retard depuis juin',
      body: 'La priorité n’est pas l’ancienneté mais l’écart entre la fiche et la réalité de la relation. Sur AeroDynamics, trois champs de la fiche client contredisent le CBS en cours.',
      bullets: [
        'AeroDynamics — stratégie et plan d’action datés de février, trois éléments plus récents disponibles.',
        'Ferrovia Lombarda — CBS en retard depuis juin, alors que le dossier passe en comité le 30 septembre.',
        'Baltic Shipyards — révision annuelle à programmer avant la visite du 12 octobre.',
      ],
      kpis: [
        { label: 'CBS à réviser', value: '3', delta: '1 en retard', tone: 'bad' },
        { label: 'Sur', value: '24 groupes', tone: 'neutral' },
      ],
      sources: [
        src('Orbit', 'Statut des CBS/CAP du portefeuille', '1 sept. 2026'),
        src('C3', 'Dates de dernière modification des fiches', '1 sept. 2026'),
      ],
      confidence: 89,
      followUps: [{ label: 'Ouvrir le CBS/CAP AeroDynamics', kind: 'cbs' }],
    },
  },
  {
    match: ['echeances', 'échéances', '90 prochains jours', '90 j', 'prochains jours'],
    insight: {
      headline: 'Quatre échéances d’ici fin novembre, dont deux bloquantes',
      body: 'Deux d’entre elles conditionnent le reste : le call CFO ouvre le sujet du refinancement, et le comité de crédit valide l’enveloppe sans laquelle la syndication ne peut pas être lancée.',
      bullets: [
        '15 sept. — Call CFO : cadrage du calendrier et sondage sur le mandat sell-side.',
        '30 sept. — Comité de crédit : validation de l’enveloppe, et waiver Ferrovia en séance.',
        '20 oct. — Remise du pitch de refinancement, pricing indicatif et KPI ESG.',
        '3 nov. — Lancement de la syndication, sous réserve des conditions de marché.',
      ],
      sources: [
        src('Atlas', 'Échéancier consolidé de la dette', '28 août 2026'),
        src('Orbit', 'Plan de contact validé en revue de portefeuille', '29 août 2026'),
      ],
      confidence: 92,
      followUps: [
        { label: 'Préparer le call CFO', kind: 'memo' },
        { label: 'Mettre à jour le CBS/CAP', kind: 'cbs' },
      ],
    },
  },
  {
    match: ['comite de credit', 'comité de crédit', 'comite', '30 septembre', '30 sept'],
    insight: {
      headline: 'Comité du 30 septembre : six dossiers, un seul vraiment disputé',
      body: 'Ferrovia Lombarda est le point dur de la séance : franchissement avéré et waiver à obtenir. Les autres dossiers sont soit conformes, soit sous surveillance sans décision requise.',
      bullets: [
        'Ferrovia Lombarda — waiver à obtenir, levier 4,6× contre 4,50×, €268 M d’exposition.',
        'AeroDynamics — revue annuelle, sous surveillance, headroom de 0,55× à documenter.',
        'Baltic Shipyards — augmentation de ligne, à arbitrer au regard du levier à 3,9×.',
      ],
      kpis: [
        { label: 'Dossiers', value: '6', tone: 'neutral' },
        { label: 'Exposition', value: '€1,3 Md', tone: 'neutral' },
        { label: 'Signaux d’alerte', value: '3', delta: '1 critique', tone: 'bad' },
      ],
      sources: [
        src('Atlas', 'Certificats de conformité du portefeuille', '29 août 2026'),
        src('C3', 'Expositions consolidées', '1 sept. 2026'),
      ],
      confidence: 90,
      followUps: [
        { label: 'Générer le Briefing Memo', kind: 'memo' },
        {
          label: 'Détaille le cas Ferrovia',
          kind: 'ask',
          prompt: 'Détaille la situation de covenant de Ferrovia Lombarda',
        },
      ],
    },
  },

  /* ── Recettes des agents moins souvent épinglés ── */
  {
    match: ['prospects', 'qualifies', 'qualifiés', 'non couverte'],
    insight: {
      headline: 'Huit prospects qualifiés, deux méritent un contact ce trimestre',
      body: 'Le filtre retient les sociétés du secteur non couvertes par la banque, avec un événement de financement identifiable dans les douze mois.',
      bullets: [
        'Composites Atlantique — LBO secondaire attendu au T1 2027, sponsor déjà client.',
        'Aeronova Systems — première syndication après introduction en bourse, sans banque relationnelle établie.',
        'Six autres dossiers sans catalyseur daté : à laisser en veille.',
      ],
      kpis: [
        { label: 'Prospects qualifiés', value: '8', delta: '+2', tone: 'good' },
        { label: 'Avec catalyseur', value: '2', tone: 'good' },
      ],
      sources: [
        src('Dealogic', 'Sociétés du secteur non couvertes', '30 août 2026'),
        src('Presse', 'Opérations annoncées sur le secteur', '1 sept. 2026'),
      ],
      confidence: 66,
      dataGap:
        'Aucune donnée interne sur ces sociétés : le scoring repose uniquement sur des sources de marché.',
      followUps: [{ label: 'Générer un CBS/CAP', kind: 'cbs' }],
    },
  },
  {
    match: ['ecosysteme', 'écosystème', 'a parle', 'a parlé', 'derniers jours', 'calls'],
    insight: {
      headline: 'Sept contacts sur l’écosystème, dont trois hors de votre couverture',
      body: 'Les trois échanges hors couverture sont les plus utiles : ils touchent des interlocuteurs que vous ne voyez pas et donnent une lecture indépendante de la situation.',
      bullets: [
        'M&A Industrials a rencontré le Head of M&A du groupe le 4 juin — piste Défense déjà évoquée.',
        'Global Markets a échangé avec la trésorerie sur la volatilité titane, sans suite donnée.',
        'DCM a vu deux investisseurs porteurs des Notes 2027, inquiets du levier.',
      ],
      sources: [src('Orbit', 'Comptes rendus de l’écosystème client', '1 sept. 2026')],
      confidence: 73,
      followUps: [
        { label: 'Préparer le call CFO', kind: 'memo' },
        {
          label: 'Creuser la piste M&A',
          kind: 'ask',
          prompt: 'Creuse l’opportunité M&A sur la division Défense d’AeroDynamics',
        },
      ],
    },
  },
  {
    match: ['pitchs', 'pitch', 'en attente'],
    insight: {
      headline: 'Deux pitchs prêts, tous deux bloqués sur une validation interne',
      body: 'Aucun des deux ne dépend du client. Le pitch de refinancement attend l’enveloppe du comité, le green bond attend la validation du desk.',
      bullets: [
        'Refi RCF AeroDynamics — prêt, à envoyer après le comité du 30 septembre.',
        'Green bond Nordwind — trame complète, validation Sustainable Finance en cours.',
      ],
      kpis: [
        { label: 'Pitchs en attente', value: '2', tone: 'neutral' },
        { label: 'Revenu associé', value: '€7,0 M', tone: 'good' },
      ],
      sources: [src('Orbit', 'Statut des pitchs', '1 sept. 2026')],
      confidence: 84,
      followUps: [{ label: 'Ouvrir le CBS/CAP', kind: 'cbs' }],
    },
  },
  {
    match: ['narratif', 'senior management', '10 lignes', 'executive'],
    insight: {
      headline: 'Narratif senior : une relation solide en financement, exposée sur le levier',
      body: 'AeroDynamics est un client historique de rang 1, couvert depuis 2011, dont la relation reste concentrée sur le financement. Notre exposition de €385 M génère €14,2 M de PNB pour un RoRWA de 1,84 %, au-dessus du seuil métier. Le point de vigilance est le levier, à 3,2× pour un covenant à 3,75×, avec €750 M de maturités concentrées sur 2027. Deux fenêtres s’ouvrent en parallèle : le refinancement anticipé de la RCF au T4 2026 et un mandat de conseil sur la cession de la division Défense. La diversification vers les métiers de flux reste le principal angle mort de la relation.',
      kpis: [
        { label: 'Exposition', value: '€385 M', delta: '+€40 M', tone: 'neutral' },
        { label: 'PNB YTD', value: '€14,2 M', delta: '+11 %', tone: 'good' },
        { label: 'RoRWA', value: '1,84 %', delta: '−12 bps', tone: 'bad' },
        { label: 'Levier', value: '3,2×', delta: 'max 3,75×', tone: 'bad' },
      ],
      sources: [
        src('C3', 'Exposition et référentiel client', '1 sept. 2026'),
        src('Baccarat', 'PNB et rentabilité', '31 août 2026'),
        src('Atlas', 'Covenants et échéancier', '28 août 2026'),
      ],
      confidence: 88,
      followUps: [
        { label: 'Générer le Briefing Memo', kind: 'memo' },
        { label: 'Ouvrir le CBS/CAP', kind: 'cbs' },
      ],
    },
  },
]

const GENERIC: Insight = {
  headline: 'Voici ce que je peux consolider sur ce sujet',
  body: 'Je n’ai pas de réponse pré-construite sur cette formulation dans ce prototype, mais voici l’état de la relation tel que les systèmes le décrivent aujourd’hui. Reformulez ou choisissez un rebond ci-dessous pour que je creuse.',
  kpis: [
    { label: 'Exposition Groupe', value: '€385 M', delta: '+€40 M', tone: 'neutral' },
    { label: 'PNB YTD', value: '€14,2 M', delta: '+11 %', tone: 'good' },
    { label: 'Levier', value: '3,2×', delta: '+0,4×', tone: 'bad' },
  ],
  sources: [
    src('C3', 'Référentiel client et exposition', '1 sept. 2026'),
    src('Baccarat', 'Revenus par métier', '31 août 2026'),
  ],
  confidence: 58,
  followUps: [
    {
      label: 'Résume les signaux du jour',
      kind: 'ask',
      prompt: 'Résume les signaux des dernières 24 h',
    },
    { label: 'Ouvrir le CBS/CAP', kind: 'cbs' },
  ],
}

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * Sélection par score plutôt que par premier match : une question comme
 * « simule une baisse d'EBITDA sur le covenant » contient le mot « covenant »
 * mais doit répondre le scénario, pas la synthèse covenant. On retient donc
 * la recette qui partage le plus de mots-clés avec la question.
 */
export function resolveInsight(prompt: string): Insight {
  const p = normalize(prompt)
  let best: Recipe | null = null
  let bestScore = 0
  for (const recipe of RECIPES) {
    const score = recipe.match.filter((m) => p.includes(normalize(m))).length
    if (score > bestScore) {
      best = recipe
      bestScore = score
    }
  }
  return best ? best.insight : GENERIC
}
