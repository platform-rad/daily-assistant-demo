import type { SourceRef } from './types'
import { src } from './client'

/**
 * Retouche d'un passage sélectionné dans le document.
 * Aucun LLM : la transformation est déterministe et choisie par mots-clés,
 * de sorte que la démonstration produise toujours un résultat visible.
 */
export interface RewriteResult {
  text: string
  /** Ce que l'assistant dit avoir fait — affiché dans le fil de co-édition. */
  note: string
  sources?: SourceRef[]
  confidence: number
  dataGap?: string
}

export interface QuickRewrite {
  id: string
  label: string
  instruction: string
}

export const QUICK_REWRITES: QuickRewrite[] = [
  { id: 'shorten', label: 'Raccourcir', instruction: 'Raccourcis ce passage' },
  { id: 'refresh', label: 'Actualiser les chiffres', instruction: 'Actualise les chiffres' },
  { id: 'source', label: 'Sourcer', instruction: 'Ajoute la source' },
  { id: 'expand', label: 'Développer', instruction: 'Développe ce passage' },
]

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * Portée d'une retouche lorsque la sélection couvre plusieurs blocs.
 *
 * - `local` : la consigne s'applique indépendamment à chaque bloc. Actualiser
 *   des chiffres dans trois puces doit actualiser les trois, pas les fusionner.
 * - `global` : la consigne porte sur l'ensemble du passage. Raccourcir trois
 *   paragraphes produit une synthèse unique, pas trois paragraphes raccourcis.
 */
export type RewriteScope = 'local' | 'global'

/**
 * Ce qu'une consigne peut faire sur un indicateur chiffré. Raccourcir ou
 * développer « €385 M » n'a pas de sens : on préfère le dire plutôt que de
 * produire n'importe quoi.
 */
export type CellAction = 'refresh' | 'source' | 'none'

export function cellActionOf(instruction: string): CellAction {
  const i = normalize(instruction)
  if (/actualise|chiffre|a jour|mettre a jour|rafraichi|fraicheur/.test(i)) return 'refresh'
  if (/source|sourcer|citer|provenance|referen/.test(i)) return 'source'
  return 'none'
}

export function scopeOf(instruction: string): RewriteScope {
  const i = normalize(instruction)
  if (/actualise|chiffre|a jour|rafraichi|source|sourcer|citer|provenance/.test(i)) return 'local'
  return 'global'
}

/* ──────────────────────────────────────────────────────────────
   Valeurs ayant bougé depuis la rédaction du document.
   On ne touche volontairement pas aux comparatifs historiques
   (« 2,8× au FY25 »), qui ne doivent jamais être réactualisés.
   ────────────────────────────────────────────────────────────── */
const FRESH_FIGURES: Array<{ from: string; to: string; why: string }> = [
  // Levier et headroom restent arithmétiquement cohérents : 3,75 − 3,26 = 0,49.
  { from: '3,2×', to: '3,26×', why: 'levier au 31 août' },
  { from: '+0,4×', to: '+0,46×', why: 'variation depuis le FY25' },
  { from: '0,55×', to: '0,49×', why: 'headroom recalculé après le certificat T3' },
  { from: '148 bps', to: '156 bps', why: 'spread secondaire au 2 septembre' },
  { from: '22 bps', to: '30 bps', why: 'élargissement sur 30 jours glissants' },
  { from: '60 %', to: '68 %', why: 'capex engagé au 31 août' },
  { from: '€780 M', to: '€795 M', why: 'CA division Défense, périmètre retraité' },
  // Indicateurs chiffrés — valeur et variation actualisées de pair.
  { from: '€385 M', to: '€402 M', why: 'exposition Groupe au 31 août' },
  { from: '+€40 M', to: '+€57 M', why: 'variation annuelle recalculée' },
  { from: '€14,2 M', to: '€15,1 M', why: 'PNB arrêté au 31 août' },
  { from: '+11 %', to: '+18 %', why: 'progression recalculée' },
  { from: '1,84 %', to: '1,79 %', why: 'RoRWA après dotation du T3' },
  { from: '−12 bps', to: '−17 bps', why: 'variation recalculée' },
  { from: '~19 %', to: '~18 %', why: 'part de wallet réestimée' },
  { from: '~12 %', to: '~13 %', why: 'part de wallet flux réestimée' },
]

/** Applique la table des valeurs fraîches et rapporte ce qui a bougé. */
export function refreshFigures(text: string): { text: string; changes: string[] } {
  let out = text
  const changes: string[] = []
  for (const f of FRESH_FIGURES) {
    if (out.includes(f.from) && f.from !== f.to) {
      out = out.split(f.from).join(f.to)
      changes.push(`${f.from} → ${f.to} (${f.why})`)
    }
  }
  return { text: out, changes }
}

/** Choix de la source la plus plausible selon le contenu du passage. */
export function pickSource(selection: string): SourceRef {
  const s = normalize(selection)
  if (/levier|covenant|dette|maturite|echeance/.test(s))
    return src('Atlas', 'Certificat de conformité H1 2026 et échéancier', '14 août 2026')
  if (/spread|marche|bps|volatilite/.test(s))
    return src('Bloomberg', 'Spreads secondaires et données de marché', '1 sept. 2026')
  if (/pnb|revenu|wallet|rentabilite|rorwa/.test(s))
    return src('Baccarat', 'Revenus et rentabilité par métier', '31 août 2026')
  if (/exposition|groupe|encours/.test(s))
    return src('C3', 'Exposition Groupe consolidée', '1 sept. 2026')
  if (/comparable|multiple|transaction|league/.test(s))
    return src('Dealogic', 'Transactions comparables du secteur', '30 août 2026')
  return src('Orbit', 'Comptes rendus et plan de contact', '29 août 2026')
}

/** Phrase de contexte ajoutée par « Développer », choisie sur le contenu. */
function expansionFor(selection: string): string {
  const s = normalize(selection)
  if (/covenant|levier|dette/.test(s))
    return 'À titre de repère, un franchissement durable de 3,5× exposerait le client à une révision de perspective par S&P, ce qui renchérirait mécaniquement le coût du refinancement 2027.'
  if (/refinanc|rcf|syndication/.test(s))
    return 'Les quatre dernières opérations comparables du secteur ont été lancées à dix mois de la maturité, ce qui situe la fenêtre optimale entre octobre et novembre 2026.'
  if (/m&a|defense|cession/.test(s))
    return 'Les trois transactions comparables identifiées sur le segment ressortent entre 9,5× et 11,2× l’EBITDA, soit une fourchette de valorisation de €890 M à €1,05 Md.'
  if (/esg|durable|transition|carbone/.test(s))
    return 'La trajectoire de décarbonation publiée en février 2026 permet d’adosser les KPI au rapport de durabilité existant, ce qui répond à l’objection du client sur la charge de reporting.'
  if (/wallet|flux|cash|transaction banking/.test(s))
    return 'L’écart est le plus marqué sur les métiers de flux, où notre part de wallet est estimée à 12 % contre 31 % en financement.'
  return 'Ce point sera repris lors du call CFO du 15 septembre, qui doit permettre de cadrer le calendrier et de valider les hypothèses retenues.'
}

const TONE_SUBSTITUTIONS: Array<[RegExp, string]> = [
  [/il convient de /gi, 'nous devons '],
  [/il est nécessaire de /gi, 'nous devons '],
  [/est susceptible d[e’']/gi, 'peut '],
  [/dans le cadre de /gi, 'pour '],
  [/afin de /gi, 'pour '],
  [/de manière à /gi, 'pour '],
  [/permet de /gi, 'sert à '],
  [/en outre/gi, 'par ailleurs'],
  [/est de nature à /gi, 'peut '],
  [/à ce stade/gi, 'aujourd’hui'],
]

const ensurePeriod = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`)

export function resolveRewrite(selection: string, instruction: string): RewriteResult {
  const i = normalize(instruction)

  /* ── Raccourcir ── */
  if (/raccourci|court|concis|resume|synthetise|allege/.test(i)) {
    const trimmed = selection.trim()
    const sentences = trimmed.split(/(?<=[.!?])\s+/)
    let out: string
    if (sentences.length > 1) {
      out = sentences[0]
    } else {
      // Phrase unique : on retire la dernière incise ou proposition coordonnée,
      // en retenant la coupe la plus courte qui garde une phrase intelligible.
      // `.*$` et non `[^.]*$` : la phrase se termine par un point, donc une
      // classe excluant le point ne peut rien capturer en fin de chaîne.
      const candidates = [
        trimmed.replace(/\s*[—–]\s*.*$/, ''),
        trimmed.replace(/,\s+(?:ce qui|soit|dont|tandis que|alors que).*$/i, ''),
        trimmed.replace(/\s+(?:et|ainsi que|puis)\s+.*$/i, ''),
      ]
        .filter((c) => c.length < trimmed.length && c.length >= 30)
        .sort((a, b) => a.length - b.length)
      out = candidates[0] ?? trimmed
    }
    out = ensurePeriod(out)

    // Garde-fou : une coupe qui ne laisse presque rien n'est pas un résumé.
    // Un titre numéroté comme « 2. Ce qui a changé » se scinde en deux phrases
    // et se réduirait à « 2. » — on préfère ne rien faire.
    const tooAggressive = out.length < 20 || out.length < trimmed.length * 0.3
    if (tooAggressive) out = trimmed

    const gain = trimmed.length - out.length
    return {
      text: out,
      note: gain
        ? `Passage réduit de ${trimmed.length} à ${out.length} caractères, en conservant l’information principale.`
        : tooAggressive
          ? 'Raccourcir ce passage l’aurait vidé de son sens : je l’ai laissé tel quel.'
          : 'Le passage était déjà court : je l’ai laissé tel quel plutôt que d’en retirer du sens.',
      confidence: gain ? 86 : 70,
    }
  }

  /* ── Actualiser les chiffres ── */
  if (/actualise|chiffre|a jour|mettre a jour|rafraichi|fraicheur/.test(i)) {
    const { text: out, changes: changed } = refreshFigures(selection)
    if (!changed.length) {
      return {
        text: selection,
        note: 'Aucune donnée obsolète détectée dans ce passage : les valeurs correspondent aux derniers arrêtés disponibles. Je n’ai rien modifié.',
        sources: [pickSource(selection)],
        confidence: 81,
      }
    }
    return {
      text: out,
      note: `${changed.length} valeur${changed.length > 1 ? 's' : ''} actualisée${
        changed.length > 1 ? 's' : ''
      } : ${changed.join(' ; ')}.`,
      sources: [pickSource(selection)],
      confidence: 84,
      dataGap:
        'Les valeurs actualisées proviennent d’arrêtés intermédiaires non audités — à confirmer avant diffusion externe.',
    }
  }

  /* ── Sourcer ── */
  if (/source|sourcer|citer|provenance|referen/.test(i)) {
    const source = pickSource(selection)
    const mention = ` (source : ${source.system} — ${source.detail.toLowerCase()}, ${source.asOf})`
    if (selection.includes(`source : ${source.system}`)) {
      return {
        text: selection,
        note: `Ce passage cite déjà ${source.system} : je n’ai pas ajouté de mention en double.`,
        sources: [source],
        confidence: 88,
      }
    }
    const out = ensurePeriod(selection).replace(/\.$/, `${mention}.`)
    return {
      text: out,
      note: `Source ${source.system} citée dans le corps du texte, en plus du badge de traçabilité.`,
      sources: [source],
      confidence: 90,
    }
  }

  /* ── Développer ── */
  if (/developpe|detaille|precise|enrichi|plus long|argument|etoffe/.test(i)) {
    const out = `${ensurePeriod(selection)} ${expansionFor(selection)}`
    return {
      text: out,
      note: 'Passage étoffé d’un élément de contexte chiffré, cohérent avec le reste du document.',
      sources: [pickSource(selection)],
      confidence: 79,
    }
  }

  /* ── Reformuler / ton plus direct (défaut) ── */
  let out = selection
  let applied = 0
  for (const [pattern, replacement] of TONE_SUBSTITUTIONS) {
    if (pattern.test(out)) {
      out = out.replace(pattern, replacement)
      applied++
    }
  }
  if (!applied) {
    const body = selection.trim()
    out = `En synthèse : ${body.charAt(0).toLowerCase()}${body.slice(1)}`
    out = ensurePeriod(out)
  }
  return {
    text: out,
    note: applied
      ? `Formulation resserrée : ${applied} tournure${applied > 1 ? 's' : ''} indirecte${
          applied > 1 ? 's' : ''
        } remplacée${applied > 1 ? 's' : ''} par une formulation directe.`
      : 'Passage reformulé en synthèse, pour une lecture plus directe en comité.',
    confidence: 75,
  }
}
