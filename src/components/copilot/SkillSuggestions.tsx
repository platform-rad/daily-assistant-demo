import { Zap, TrendingUp, Users, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      label: 'Générer doc',
      prompt: 'Génère un memo d\'analyse pour ce client',
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
    <div className="grid grid-cols-1 gap-3 w-full max-w-md">
      {skills.map((skill, idx) => (
        <Button
          key={idx}
          onClick={() => onSkillClick(skill.prompt)}
          variant="outline"
          className="justify-start gap-3 h-12 text-left hover:bg-blue-50 border-gray-300"
        >
          <div className="text-blue-600">{skill.icon}</div>
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-900">{skill.label}</div>
            <div className="text-xs text-gray-500">{skill.prompt}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}
