/* Données contextuelles spécifiques à chaque page/route */

export interface ContextData {
  currentItem?: string // Client, Facility, etc.
  itemType?: string
  data?: Record<string, any>
}

// Simulated data par route/page
export const CONTEXT_DATA_BY_ROUTE: Record<string, ContextData> = {
  client: {
    currentItem: 'TechCorp France',
    itemType: 'Client',
    data: {
      name: 'TechCorp France',
      exposure: '€10.0M',
      rating: 'BBB+',
      sector: 'Technology',
      status: 'Active',
      lastReview: '2026-08-15',
    },
  },
  'client-edit': {
    currentItem: 'Manufacturing Ltd',
    itemType: 'Client',
    data: {
      name: 'Manufacturing Ltd',
      exposure: '€42.5M',
      rating: 'BB+',
      sector: 'Manufacturing',
      status: 'At Risk',
      lastReview: '2026-07-20',
    },
  },
  credit: {
    currentItem: 'RCF - TechCorp France',
    itemType: 'Facility',
    data: {
      clientName: 'TechCorp France',
      facilityType: 'Revolving Credit Facility',
      amount: '€10.0M',
      used: '€2.5M',
      maturity: '2025-09-03',
      utilization: '25%',
      status: 'Active',
    },
  },
  portfolio: {
    currentItem: 'Portefeuille Global',
    itemType: 'Portfolio',
    data: {
      totalExposure: '€847.3M',
      clientCount: '847',
      avgRating: 'BBB+',
      atRisk: '12',
      sectors: ['Technology', 'Manufacturing', 'Finance', 'Retail'],
    },
  },
  pipeline: {
    currentItem: 'Deal Pipeline Q3 2026',
    itemType: 'Pipeline',
    data: {
      activeDeals: '23',
      totalVolume: '€2.3B',
      stage: 'Origination to Close',
      topClients: ['TechCorp France', 'Manufacturing Ltd', 'Finance Corp'],
    },
  },
}
