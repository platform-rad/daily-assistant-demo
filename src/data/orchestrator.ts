/* Système d'orchestration simplifié pour le Copilot */

export type ToolId = 'my-credit-app' | 'my-client-dev'
export type ActionStatus = 'pending' | 'authorized' | 'executed' | 'failed'

export interface Tool {
  id: ToolId
  name: string
  description: string
  icon: string
}

export interface OrchestratedAction {
  id: string
  toolId: ToolId
  analysis: string
  summary: string
  steps: string[]
  status: ActionStatus
  results?: string
}

export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: OrchestratedAction[]
  thinking?: string
}

export const TOOLS: Tool[] = [
  {
    id: 'my-credit-app',
    name: 'MyCreditApp',
    description: 'Gestion des crédits et expositions',
    icon: 'CreditCard',
  },
  {
    id: 'my-client-dev',
    name: 'MyClientDev',
    description: 'Gestion des clients et portefeuille',
    icon: 'Users',
  },
]

// Parcours de démo: créer un client avec credit facility
export const DEMO_SCENARIO = {
  userInput: 'Crée un nouveau client "TechCorp France" avec une credit facility de 10M EUR',
  aiAnalysis: `J'ai analysé votre demande. Vous voulez créer un nouveau client corporate avec une facility de crédit.

Voici ce que je vais faire:
1. Dans MyClientDev: Créer le client "TechCorp France" avec ses données de base
2. Dans MyCreditApp: Ajouter une facility de crédit de 10M EUR liée à ce client
3. Valider les informations avant finalisation

Je vais avoir besoin d'accès à ces deux systèmes. Autorisez-vous?`,

  steps: [
    'Créer client TechCorp France dans MyClientDev',
    'Ajouter facility de 10M EUR dans MyCreditApp',
    'Lier les deux enregistrements',
  ],

  tools: ['my-client-dev', 'my-credit-app'] as ToolId[],
}
