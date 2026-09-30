/* Index de recherche mocké pour la recherche globale du panneau assistant.
   En prod, ceci interrogerait C3/le CRM plutôt qu'une liste statique. */

export type SearchResultType = 'client' | 'cap-cbs' | 'crm-agent'

export interface SearchResult {
  type: SearchResultType
  title: string
  subtitle: string
}

export const SEARCH_INDEX: SearchResult[] = [
  // Clients (portefeuille)
  { type: 'client', title: 'AeroDynamics Group', subtitle: 'Aerospace & Defence · Client fiche' },
  { type: 'client', title: 'Nordwind Turbines', subtitle: 'Renewable Energy · Client fiche' },
  { type: 'client', title: 'Ferrovia Lombarda', subtitle: 'Rail & Infrastructure · Client fiche' },
  { type: 'client', title: 'Helvetia Precision', subtitle: 'Machinery · Client fiche' },
  { type: 'client', title: 'Iberia Chemicals', subtitle: 'Specialty Chemicals · Client fiche' },
  { type: 'client', title: 'Baltic Shipyards', subtitle: 'Marine & Defence · Client fiche' },

  // Dossiers CAP/CBS
  { type: 'cap-cbs', title: 'AeroDynamics Group', subtitle: 'CAP/CBS · Draft · ESG axis updated 2h ago' },
  { type: 'cap-cbs', title: 'TechCorp France', subtitle: 'CAP/CBS · Validated Sep 2, 2026' },
  { type: 'cap-cbs', title: 'Manufacturing Ltd', subtitle: 'CAP/CBS · Draft · New EMEA contribution' },
  { type: 'cap-cbs', title: 'Financial Services Inc', subtitle: 'CAP/CBS · Validated' },
  { type: 'cap-cbs', title: 'Helvetia Ports SA', subtitle: 'CAP/CBS · Draft' },

  // Sujets CRM+ Agent
  { type: 'crm-agent', title: 'AeroDynamics Group · CFO call', subtitle: 'CRM+ Agent · Synced Aug 18, 2026' },
  { type: 'crm-agent', title: 'TechCorp France · Monthly review', subtitle: 'CRM+ Agent · Synced Aug 12, 2026' },
  { type: 'crm-agent', title: 'Manufacturing Ltd · Covenant follow-up', subtitle: 'CRM+ Agent · Draft Aug 5, 2026' },
]

export function searchIndex(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return SEARCH_INDEX.filter(
    (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
  ).slice(0, 8)
}
