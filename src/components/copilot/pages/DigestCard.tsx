import { useState } from 'react'
import { ChevronDown, ChevronUp, Newspaper, Building2, Users, Swords, Mail } from 'lucide-react'

interface DigestSection {
  id: string
  title: string
  icon: React.ReactNode
  items: { text: string; tag: string }[]
}

const CLIENTS = ['JP Morgan', 'Goldman Sachs', 'Morgan Stanley', 'Macquarie']

const SECTIONS: DigestSection[] = [
  {
    id: 'must-read',
    title: 'Must-read Articles',
    icon: <Newspaper size={13} />,
    items: [
      { text: 'JP Morgan relève ses prévisions de revenus IB pour le T4 sur fond de reprise M&A.', tag: 'Financial Times' },
      { text: 'Goldman Sachs annonce une réorganisation de sa division Asset Management.', tag: 'Bloomberg' },
      { text: 'Morgan Stanley renforce son équipe Private Credit en Europe.', tag: 'Reuters' },
    ],
  },
  {
    id: 'sector-360',
    title: 'Sector 360 — Commercial & Investment Banking · Asset Management & Private Equity',
    icon: <Building2 size={13} />,
    items: [
      { text: 'Consolidation continue chez les gérants d\'actifs alternatifs : flux records vers le Private Credit.', tag: 'Sector Watch' },
      { text: 'Les banques d\'investissement américaines relèvent leurs objectifs de fee pool 2026.', tag: 'Sector Watch' },
    ],
  },
  {
    id: 'client-360',
    title: 'Client 360',
    icon: <Users size={13} />,
    items: [
      { text: 'JP Morgan : renouvellement de mandat de conseil attendu au T1 2027.', tag: 'C3' },
      { text: 'Goldman Sachs : nouvelle ligne de crédit syndiquée en cours de structuration.', tag: 'Dealogic' },
      { text: 'Morgan Stanley : revue annuelle de la relation prévue le mois prochain.', tag: 'Orbit' },
      { text: 'Macquarie : intérêt confirmé pour une opération de financement d\'infrastructure.', tag: 'C3' },
    ],
  },
  {
    id: 'competitive-intel',
    title: 'Competitive intelligence',
    icon: <Swords size={13} />,
    items: [
      { text: 'Un concurrent direct a remporté le mandat sell-side sur un deal comparable au secteur Financial Institutions.', tag: 'Presse' },
      { text: 'Repositionnement tarifaire observé chez deux banques concurrentes sur le Transaction Banking.', tag: 'Presse' },
    ],
  },
]

export function DigestCard() {
  const [openSection, setOpenSection] = useState<string | null>('must-read')
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50/60 to-transparent overflow-hidden">
      <div className="px-3 py-2.5 flex items-start gap-2">
        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Mail size={14} className="text-purple-600" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs font-bold text-slate-900">Good Morning Jessica 👋</p>
          <p className="text-2xs text-slate-600 mt-0.5">
            Votre digest client personnalisé du {today}. Actualités récentes pour {CLIENTS.join(', ')}.
          </p>
        </div>
      </div>

      <div className="border-t border-purple-100">
        {SECTIONS.map((section) => {
          const isOpen = openSection === section.id
          return (
            <div key={section.id} className="border-b border-purple-100 last:border-b-0">
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-purple-50/60 transition text-left"
              >
                <span className="text-purple-600 flex-shrink-0">{section.icon}</span>
                <span className="text-2xs font-semibold text-slate-800 flex-1 truncate">{section.title}</span>
                {isOpen ? (
                  <ChevronUp size={13} className="text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown size={13} className="text-slate-400 flex-shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-3 pb-2.5 space-y-1.5">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 pl-5">
                      <span className="text-2xs text-slate-600 leading-snug flex-1">{item.text}</span>
                      <span className="text-2xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded flex-shrink-0 whitespace-nowrap scale-90 origin-right">
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
