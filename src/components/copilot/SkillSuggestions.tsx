import { Zap, TrendingUp, Users, FileText, AlertCircle } from 'lucide-react'

interface SkillSuggestionsProps {
  context: string
  onSkillClick: (skill: string) => void
}

const SKILLS_BY_CONTEXT: Record<string, Array<{ icon: React.ReactNode; label: string; prompt: string }>> = {
  myClientDev: [
    {
      icon: <Users size={18} />,
      label: 'Créer un client',
      prompt: 'Crée un nouveau client "TechCorp France" avec les informations pertinentes',
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Analyse exposition',
      prompt: 'Fais une analyse complète de l\'exposition de ce client',
    },
    {
      icon: <FileText size={18} />,
      label: 'Créer un Credit Memo',
      prompt: 'Génère un Credit Memo complet pour ce client',
    },
  ],
  myCreditApp: [
    {
      icon: <Zap size={18} />,
      label: 'Ajouter facility',
      prompt: 'Ajoute une credit facility de 10M EUR pour ce client',
    },
    {
      icon: <AlertCircle size={18} />,
      label: 'Vérifier risque',
      prompt: 'Analyse les risques et limites de crédit pour ce client',
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'KPI détaillés',
      prompt: 'Montre-moi les KPI détaillés sur l\'utilisation des facilities',
    },
  ],
  dashboard: [
    {
      icon: <TrendingUp size={18} />,
      label: 'Vue d\'ensemble',
      prompt: 'Résume la situation du portefeuille pour aujourd\'hui',
    },
    {
      icon: <AlertCircle size={18} />,
      label: 'Alertes',
      prompt: 'Quelles sont les alertes les plus importantes?',
    },
    {
      icon: <FileText size={18} />,
      label: 'Rapport journalier',
      prompt: 'Crée un rapport journalier avec les points clés',
    },
  ],
  reporting: [
    {
      icon: <FileText size={18} />,
      label: 'Générer rapport',
      prompt: 'Génère un rapport complet de fin de mois',
    },
    {
      icon: <TrendingUp size={18} />,
      label: 'Tendances',
      prompt: 'Analyse les tendances principales du portefeuille',
    },
    {
      icon: <Users size={18} />,
      label: 'Clients à risque',
      prompt: 'Liste les clients identifiés comme étant à risque',
    },
  ],
}

export function SkillSuggestions({ context, onSkillClick }: SkillSuggestionsProps) {
  const skills = SKILLS_BY_CONTEXT[context] || SKILLS_BY_CONTEXT.myClientDev

  return (
    <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
      {skills.map((skill, idx) => (
        <button
          key={idx}
          onClick={() => onSkillClick(skill.prompt)}
          className="justify-start gap-2.5 px-3 py-2 text-left rounded border border-slate-200 bg-slate-50 hover:border-rad-indigo-300 hover:bg-rad-indigo-50 transition-colors group"
        >
          <div className="flex gap-2.5">
            <div className="text-rad-indigo-500 flex-shrink-0">{skill.icon}</div>
            <div className="flex-1">
              <div className="font-medium text-2xs text-slate-900 group-hover:text-rad-indigo-700">{skill.label}</div>
              <div className="text-2xs text-slate-500 mt-0.5 group-hover:text-rad-indigo-600">{skill.prompt}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
