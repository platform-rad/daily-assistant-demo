/* Réponses contextuelles de l'IA basées sur le contexte et la requête */

export interface ContextualResponse {
  analysis: string
  summary: string
  steps: string[]
  toolsNeeded: string[]
}

// Note: Les réponses sont préétablies pour chaque client/contexte
// En production, elles seraient générées dynamiquement avec l'IA

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
    'Fais une analyse complète de l\'exposition de ce client': {
      analysis: `Analyse détaillée de TechCorp France:

**Exposition et Structure:**
- Exposition totale: €10.0M
- Type: Corporate Client
- Secteur: Technology
- Rating: BBB+
- Statut: Active
- Nombre de facilities: 1 (RCF)

**Analyse du risque:**
- Profil de risque: Moderate
- Tendance: Stable
- Dernière revue: 2026-08-15
- Prochain review: 2026-11-15

**Exposition détaillée:**
- Revenue: €1.2B (2025)
- Leverage: 2.1x (acceptable)
- Interest Coverage: 4.5x (bon)
- Liquidity: Sufficient

**Recommandations:**
- Maintenir le monitoring mensuel
- Revoir les pricing annuellement
- Aucune action immédiate requise`,
      summary: 'Analyser l\'exposition du client',
      steps: [
        'Récupérer les données du client',
        'Évaluer l\'exposition et les risques',
        'Analyser les ratios financiers',
        'Préparer les recommandations',
      ],
      toolsNeeded: ['my-client-dev'],
    },
    'Quels risques identifiez-vous pour ce client': {
      analysis: `Analyse des risques spécifiques pour TechCorp France:

**Profil de Risque: MODÉRÉ**

**Risques identifiés:**

1. **Exposition au secteur Technology** (Volatilité moyenne)
   - Secteur sujet aux cycles économiques
   - Dépendance aux tendances technologiques

2. **Taille de l'exposition: €10M** (Acceptable)
   - Pas de concentration excessive
   - Diversification appropriée

3. **Rating BBB+** (Stable)
   - Position de crédit acceptable
   - Surveillance recommandée

4. **Covenant Compliance** (En bon état)
   - Tous les covenants respectés
   - Marges confortables

**Recommandations:**
- Monitoring mensuel (standard)
- Review annuelle des covenants
- Surveiller les news du secteur Technology
- Pas d'action immédiate requise`,
      summary: 'Analyser les risques du client',
      steps: [
        'Évaluer le secteur et les tendances',
        'Vérifier les ratios financiers',
        'Analyser les covenants',
        'Produire un risk report',
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
  portfolio: {
    'Fais une analyse du portefeuille par secteur': {
      analysis: `Analyse de composition du portefeuille global:

**Répartition par secteur:**
- Secteur Financier: 32% (€270M) - Segment stable
- Technologie: 28% (€237M) - Croissance modérée
- Manufacturing: 22% (€186M) - Cyclique
- Services: 18% (€154M) - En développement

**Exposition totale:** €847.3M
**Nombre de clients:** 847
**Rating moyen:** BBB+

**Analyse des risques:**
- 12 clients identifiés à risque (1.4%)
- Concentration acceptable
- Diversification bien équilibrée`,
      summary: 'Analyser composition portefeuille',
      steps: [
        'Récupérer données par secteur',
        'Calculer exposition',
        'Identifier concentration',
        'Comparer benchmarks',
      ],
      toolsNeeded: ['my-client-dev'],
    },
    'Quel est le profil de risque du portefeuille?': {
      analysis: `Profil de risque du portefeuille global:

**Risque Global: MODÉRÉ**

**Par dimension:**
- Concentration: Acceptable (Herfindahl Index: 0.12)
- Diversification secteur: Bonne (4 secteurs majeurs)
- Rating: Sain (BBB+ moyenne)
- Géographie: Diversifiée (EMEA)

**Expositions critiques:**
- 12 clients BBB- ou moins (monitoring accru)
- 3 facilities > 90% utilisées
- 0 violations de covenant actuellement

**Recommandations:**
- Maintenir surveillance mensuelle
- Réduire exposition Manufacturing si possible
- Surveiller secteur Services`,
      summary: 'Évaluer profil risque portefeuille',
      steps: [
        'Analyser ratings par client',
        'Évaluer secteurs',
        'Identifier concentrations',
        'Proposer ajustements',
      ],
      toolsNeeded: ['my-client-dev'],
    },
  },
  pipeline: {
    'Résume l\'état du pipeline': {
      analysis: `État du deal pipeline Q3 2026:

**Deals actifs: 23**

**Par stage:**
- Origination: 8 deals (€680M)
- Structuring: 7 deals (€920M)
- Due Diligence: 5 deals (€540M)
- Close: 3 deals (€160M)

**Volume total:** €2.3B
**Forecast Q3:** €850M
**Close rate moyenne:** 67%

**Top clients en pipeline:**
1. TechCorp France - €280M
2. Manufacturing Ltd - €450M
3. Finance Corp - €320M

**Status:**
- On track: 20 deals
- At risk: 2 deals
- Delayed: 1 deal`,
      summary: 'Résumer état pipeline',
      steps: [
        'Récupérer deals par stage',
        'Calculer volumes',
        'Identifier risques',
        'Projeter forecast',
      ],
      toolsNeeded: ['my-client-dev'],
    },
    'Quels deals sont à risque?': {
      analysis: `Deals identifiés comme étant à risque:

**À risque immédiat (2 deals):**

1. **Manufacturing Corp - €280M**
   - Issue: Client covenant concerns
   - Stage: Due Diligence (retard 2 semaines)
   - Action: Call client cette semaine
   - Probabilité close: 45% (vs 80% normal)

2. **Finance Solutions - €150M**
   - Issue: Documentation incomplete
   - Stage: Structuring
   - Action: Fournir docs manquantes
   - Probabilité close: 55%

**Delayed (1 deal):**
- Retail Group - €95M
- Cause: Approvals internes
- Timeline: +3 semaines

**Recommandations:**
- Engagement immédiat clients
- Support documentaire
- Possible deal restructuring`,
      summary: 'Identifier deals à risque',
      steps: [
        'Analyser par stage',
        'Identifier blocages',
        'Évaluer probabilités',
        'Proposer mitigations',
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
