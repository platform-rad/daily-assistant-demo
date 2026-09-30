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
      { text: 'JP Morgan raises Q4 IB revenue guidance on the back of an M&A rebound.', tag: 'Financial Times' },
      { text: 'Goldman Sachs announces a reorganization of its Asset Management division.', tag: 'Bloomberg' },
      { text: "Morgan Stanley strengthens its Private Credit team in Europe.", tag: 'Reuters' },
    ],
  },
  {
    id: 'sector-360',
    title: 'Sector 360 — Commercial & Investment Banking · Asset Management & Private Equity',
    icon: <Building2 size={13} />,
    items: [
      { text: 'Continued consolidation among alternative asset managers: record flows into Private Credit.', tag: 'Sector Watch' },
      { text: 'US investment banks raise their 2026 fee pool targets.', tag: 'Sector Watch' },
    ],
  },
  {
    id: 'client-360',
    title: 'Client 360',
    icon: <Users size={13} />,
    items: [
      { text: 'JP Morgan: advisory mandate renewal expected in Q1 2027.', tag: 'C3' },
      { text: 'Goldman Sachs: new syndicated credit line being structured.', tag: 'Dealogic' },
      { text: "Morgan Stanley: annual relationship review scheduled for next month.", tag: 'Orbit' },
      { text: 'Macquarie: confirmed interest in an infrastructure financing deal.', tag: 'C3' },
    ],
  },
  {
    id: 'competitive-intel',
    title: 'Competitive intelligence',
    icon: <Swords size={13} />,
    items: [
      { text: 'A direct competitor won the sell-side mandate on a comparable Financial Institutions deal.', tag: 'Press' },
      { text: 'Pricing repositioning observed at two competing banks in Transaction Banking.', tag: 'Press' },
    ],
  },
]

export function DigestCard() {
  const [openSection, setOpenSection] = useState<string | null>('must-read')
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="rounded-lg border border-rad-indigo-200 bg-gradient-to-br from-rad-indigo-50/60 to-transparent overflow-hidden">
      <div className="px-3 py-2.5 flex items-start gap-2">
        <div className="w-7 h-7 rounded-lg bg-rad-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Mail size={14} className="text-rad-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs font-bold text-slate-900">Good Morning Jessica 👋</p>
          <p className="text-2xs text-slate-600 mt-0.5">
            Your personalized client digest for {today}. Recent news for {CLIENTS.join(', ')}.
          </p>
        </div>
      </div>

      <div className="border-t border-rad-indigo-100">
        {SECTIONS.map((section) => {
          const isOpen = openSection === section.id
          return (
            <div key={section.id} className="border-b border-rad-indigo-100 last:border-b-0">
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-rad-indigo-50/60 transition text-left"
              >
                <span className="text-rad-indigo-600 flex-shrink-0">{section.icon}</span>
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
