/* Réponses contextuelles de l'IA basées sur le contexte et la requête */

export interface ContextualResponse {
  analysis: string
  summary: string
  steps: string[]
  toolsNeeded: string[]
}

export const CONTEXTUAL_RESPONSES: Record<string, Record<string, ContextualResponse>> = {
  myClientDev: {
    'Fais une analyse complète du portefeuille par secteur et exposition': {
      analysis: `J'ai analysé votre portefeuille MyClientDev. Voici ce que j'observe:

Le portefeuille compte 847 clients répartis sur plusieurs secteurs. La distribution est la suivante:
- Secteur Financier: 32% (€270M)
- Technologie: 28% (€237M)
- Manufacturing: 22% (€186M)
- Services: 18% (€154M)

L'exposition totale est de €847.3M avec un rating moyen de BBB+. Cependant, je détecte 12 clients identifiés comme étant à risque, avec une tendance à la hausse.`,
      summary: 'Analyser portefeuille par secteur',
      steps: [
        'Récupérer les données de distribution par secteur',
        'Calculer l\'exposition par secteur',
        'Identifier les risques sectoriels',
        'Comparer aux benchmarks',
      ],
      toolsNeeded: ['my-client-dev'],
    },
    'Quels clients sont identifiés comme étant à risque?': {
      analysis: `Analyse des clients à risque dans votre portefeuille:

12 clients sont actuellement identifiés comme à risque, soit 1.4% du portefeuille:

1. **TechCorp EMEA** - Rating dégradé (BBB- → BB+), exposition €85M
2. **Manufacturing Ltd** - Baisse de revenue -15%, exposition €42M
3. **Retail Services** - Covenant breach imminent, exposition €38M
4. **Construction Group** - Liquidité faible, exposition €28M
...et 8 autres

Recommandations:
- Augmenter la fréquence de monitoring
- Mettre en place des covenants plus stricts
- Considérer une réduction d'exposition`,
      summary: 'Identifier clients à risque',
      steps: [
        'Récupérer les ratings récents',
        'Analyser les tendances financières',
        'Vérifier la compliance des covenants',
        'Classer par niveau de risque',
      ],
      toolsNeeded: ['my-client-dev'],
    },
    'Quelles sont les actions recommandées pour le portefeuille?': {
      analysis: `Basé sur l'analyse de votre portefeuille MyClientDev, voici les actions recommandées:

**Actions prioritaires:**

1. **Revoir les covenants des clients BBB-** (4 clients)
   - Impact: Réduire le risque de violations
   - Timeline: 30 jours

2. **Augmenter le monitoring des secteurs cycliques**
   - Focus: Manufacturing, Retail
   - Fréquence: Mensuel → Hebdomadaire

3. **Optimiser l'allocation de capital**
   - Réduire exposition aux secteurs surexposés
   - Redéployer vers secteurs moins couverts

4. **Mettre en place des alertes automatiques**
   - Rating changes
   - Covenant breaches
   - Exposure limits`,
      summary: 'Actions recommandées portefeuille',
      steps: [
        'Identifier les clients BBB- et BB+',
        'Préparer les dossiers de révision',
        'Configurer les alertes',
        'Planifier les rencontres clients',
      ],
      toolsNeeded: ['my-client-dev'],
    },
  },
  myCreditApp: {
    'Analyse les facilities par produit et date de maturité': {
      analysis: `Analyse des credit facilities par produit et maturité:

**Répartition par produit:**
- Revolving Credit Facilities: 156 (€445M) - 58%
- Term Loans: 54 (€265M) - 34%
- Acquisition Facilities: 24 (€137M) - 8%

**Maturités critiques (90 jours):**
- Août 2026: 23 facilities pour €185M
- Septembre 2026: 18 facilities pour €142M
- Octobre 2026: 12 facilities pour €98M

**Utilization par produit:**
- RCF: 62% (€275M utilisé)
- Term Loans: 74% (€196M utilisé)
- Acq Facilities: 68% (€93M utilisé)

Observation: 45 facilities arrivent à maturité dans les 180 prochains jours. Nécessite un plan de renouvellement.`,
      summary: 'Analyser facilities par produit',
      steps: [
        'Récupérer données de facilities',
        'Classer par produit et maturité',
        'Calculer utilization rates',
        'Identifier les renewals critiques',
      ],
      toolsNeeded: ['my-credit-app'],
    },
    'Quels clients risquent de violer leurs covenants?': {
      analysis: `Analyse de conformité des covenants:

**Clients à risque imminent (< 30 jours):**

1. **Manufacturing Ltd** - Leverage Ratio
   - Covenant: Max 3.5x, Current: 3.4x
   - Marge: 0.1x (critique)
   - Impact projecté: Violation probable en août

2. **Retail Services EMEA** - Interest Coverage
   - Covenant: Min 2.5x, Current: 2.6x
   - Marge: 0.1x (très étroit)
   - Risque: EBITDA down trending

3. **Construction Group** - Liquidity Test
   - Requirement: €25M, Current: €26M
   - Marge: €1M (minimal buffer)

**Recommandations:**
- Engagement immédiat avec les clients
- Modifier les covenants si possible
- Préparer les waiver agreements`,
      summary: 'Vérifier covenant compliance',
      steps: [
        'Récupérer les ratios actuels',
        'Comparer aux seuils',
        'Analyser les tendances',
        'Notifier les clients à risque',
      ],
      toolsNeeded: ['my-credit-app'],
    },
    'Montre-moi les KPI détaillés sur l\'utilisation des facilities': {
      analysis: `KPI détaillés sur l'utilisation des facilities:

**Utilization Overview:**
- Total Facilities: €767M
- Total Utilisé: €564M
- Overall Rate: 67.8%
- Trend: +2.3% vs mois dernier

**Par type:**
- RCF: 62% utilisation (€275M/€445M)
- Term Loans: 74% (€196M/€265M)
- Acq: 68% (€93M/€137M)

**Par secteur:**
- Manufacturing: 78% (le plus utilisé)
- Technology: 61%
- Finance: 58%
- Retail: 72%

**Indicateurs d'alerte:**
- 8 facilities > 90% utilisées
- 2 facilities au-dessus des limites
- 15 facilities approaching limits (85%+)

**Forecast (90 jours):**
- Avg utilization: 71% (hausse attendue)
- Potential breaches: 3-4 facilities`,
      summary: 'KPI utilisation détaillés',
      steps: [
        'Récupérer les drawdowns',
        'Calculer les ratios d\'utilisation',
        'Analyser par segment',
        'Projeter la tendance',
      ],
      toolsNeeded: ['my-credit-app'],
    },
  },
  dashboard: {
    'Résume les métriques clés du jour': {
      analysis: `Résumé des métriques clés du jour:

**Transactions:**
- 47 transactions traitées (↑ 12% vs yesterday)
- Montant total: €234M
- Temps moyen: 4.2 heures
- Taux de completion: 98.9%

**Portfolio Updates:**
- 12 clients mises à jour
- 3 ratings changes
- 2 covenant reviews complétées
- 5 agreements signés

**Alertes du jour:**
- 3 high priority alerts
- 8 medium priority
- 2 risk escalations
- 0 critical issues

**Trending:**
- Activity up 15% vs average
- Processing time down 8%
- Client satisfaction: 4.6/5

Aucun problème critique à signaler. Opérations nominales.`,
      summary: 'Résumé métriques du jour',
      steps: [
        'Collecter les transactions',
        'Agréger les updates clients',
        'Lister les alerts',
        'Calculer les tendances',
      ],
      toolsNeeded: ['my-client-dev', 'my-credit-app'],
    },
    'Montre-moi les items en attente': {
      analysis: `Items en attente de suivi:

**Critiques (doit être fait aujourd\'hui):**
1. Covenant waiver - Manufacturing Ltd (overdue 2 jours)
2. Credit review - TechCorp France (due demain)

**Important (cette semaine):**
1. Facility renewal - Retail Group (due en 3 jours)
2. Pricing review - 4 clients (due samedi)
3. Risk report - Finance sector (due vendredi)

**Routine (cette semaine):**
1. 8 client calls à programmer
2. 3 documentation updates
3. 2 covenant amendments

**Par département:**
- Credit: 8 items
- Risk: 4 items
- Operations: 5 items
- Legal: 2 items`,
      summary: 'Items en attente',
      steps: [
        'Récupérer les tasks',
        'Filtrer par priorité',
        'Classer par due date',
        'Notifier les propriétaires',
      ],
      toolsNeeded: ['my-client-dev'],
    },
  },
}
