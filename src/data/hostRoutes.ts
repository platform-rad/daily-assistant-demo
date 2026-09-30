import type { HostRoute } from './types'

export interface RouteMeta {
  id: HostRoute
  /** Libellé de l'entrée de navigation supérieure (null = pas dans la nav). */
  navLabel: string | null
  /** Fil d'Ariane de l'écran. */
  breadcrumb: string[]
  /** Ce que l'assistant affiche comme contexte détecté. */
  contextLabel: string
  /** Agent que l'assistant met en avant sur cet écran. */
  suggestedAgentId: string
  /** Phrase d'accroche contextuelle affichée dans le bandeau de l'assistant. */
  contextHint: string
  /** Action contextuelle proposée dans le bandeau. */
  contextAction?: { label: string; target: 'cbs' | 'memo' }
}

export const ROUTES: Record<HostRoute, RouteMeta> = {
  portfolio: {
    id: 'portfolio',
    navLabel: 'Mon portefeuille',
    breadcrumb: ['Mon portefeuille', 'Industrials EMEA'],
    contextLabel: 'Portefeuille — 24 groupes couverts',
    suggestedAgentId: 'opportunity-radar',
    contextHint:
      'Vue portefeuille détectée : je remonte les signaux transverses à vos 24 groupes plutôt que ceux d’un client isolé.',
  },
  client: {
    id: 'client',
    // Pas d'entrée de nav dédiée : on y accède depuis la ligne d'un client dans "Mon portefeuille".
    navLabel: null,
    breadcrumb: ['Clients', 'Industrials EMEA', 'AeroDynamics Group'],
    contextLabel: 'Fiche client — AeroDynamics Group',
    suggestedAgentId: 'client-market-intel',
    contextHint:
      'Vous consultez AeroDynamics Group : voici la veille client et marché des dernières 24 h.',
    contextAction: { label: 'Générer Briefing Memo', target: 'memo' },
  },
  'client-edit': {
    id: 'client-edit',
    navLabel: null,
    breadcrumb: ['Clients', 'AeroDynamics Group', 'Édition de la fiche'],
    contextLabel: 'Édition de la fiche client',
    suggestedAgentId: 'cbs-cap',
    contextHint:
      'Vous éditez la fiche : je peux pré-remplir la stratégie et le plan d’action depuis le CBS/CAP en cours.',
    contextAction: { label: 'Ouvrir le CBS/CAP', target: 'cbs' },
  },
  'cap-cbs': {
    id: 'cap-cbs',
    navLabel: 'CAP/CBS',
    breadcrumb: ['CAP/CBS'],
    contextLabel: 'Tableau de bord CAP/CBS — dossiers en cours',
    suggestedAgentId: 'cbs-cap',
    contextHint:
      'Vue tableau de bord CAP/CBS : je peux prioriser les dossiers à valider ou en retard de contribution.',
    contextAction: { label: 'Voir le Briefing Memo', target: 'memo' },
  },
  'cap-cbs-detail': {
    id: 'cap-cbs-detail',
    // Atteint uniquement depuis une ligne du tableau de bord CAP/CBS.
    navLabel: null,
    breadcrumb: ['CAP/CBS', 'AeroDynamics Group', 'Cycle 2026–2027'],
    contextLabel: 'CAP/CBS en cours — Complétion CBS',
    suggestedAgentId: 'cbs-cap',
    contextHint:
      'Vous êtes dans le CBS/CAP : je peux pré-remplir les axes depuis les données disponibles et suivre la contribution des équipes pays.',
    contextAction: { label: 'Voir le Briefing Memo', target: 'memo' },
  },
  pipeline: {
    id: 'pipeline',
    navLabel: 'Pipeline',
    breadcrumb: ['Pipeline', 'Industrials EMEA', 'T3–T4 2026'],
    contextLabel: 'Pipeline commercial — 11 opportunités',
    suggestedAgentId: 'deal-duplicator',
    contextHint:
      'Vue pipeline détectée : je priorise les deals réplicables et les échéances qui approchent.',
    contextAction: { label: 'Générer CBS/CAP', target: 'cbs' },
  },
  credit: {
    id: 'credit',
    navLabel: 'Crédit',
    breadcrumb: ['Crédit', 'Comité du 30 septembre 2026'],
    contextLabel: 'Dossiers de crédit — comité du 30 sept.',
    suggestedAgentId: 'early-warning',
    contextHint:
      'Vue crédit détectée : je remonte d’abord les signaux faibles et les marges de covenant.',
    contextAction: { label: 'Générer Briefing Memo', target: 'memo' },
  },
}

/** Ordre des entrées de la navigation supérieure. 'client' et 'cap-cbs-detail' ne sont
 *  volontairement pas listés ici : on y accède uniquement en cliquant une ligne
 *  (portefeuille → client, tableau de bord CAP/CBS → dossier). */
export const NAV_ORDER: HostRoute[] = ['portfolio', 'cap-cbs', 'pipeline', 'credit']
