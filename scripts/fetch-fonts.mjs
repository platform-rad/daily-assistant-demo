/**
 * Télécharge Inter (latin + latin-ext, graisses 400/500/600/700) depuis Google
 * Fonts et écrit un CSS avec les woff2 encodés en base64.
 *
 * Le résultat (scripts/inter-embedded.css) est mis en cache : le script ne
 * refait un appel réseau que si le fichier est absent. Le livrable standalone
 * est ainsi totalement autonome, y compris hors ligne.
 *
 *   node scripts/fetch-fonts.mjs [--force]
 */
import { writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, 'inter-embedded.css')

const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/**
 * On ne garde que la coupe « latin ». Elle couvre tout ce que le prototype
 * affiche : accents français, œ (U+0153), « » (U+00AB/BB), ’ (U+2019),
 * € (U+20AC), × (U+00D7), − (U+2212), ↑ ↓ (U+2191/2193).
 * La coupe latin-ext pèse deux fois plus lourd pour des glyphes inutilisés.
 */
const KEEP = ['U+0000-00FF']

async function main() {
  const force = process.argv.includes('--force')
  if (existsSync(OUT) && !force) {
    const size = (await readFile(OUT)).length
    console.log(`✓ inter-embedded.css déjà présent (${Math.round(size / 1024)} Ko) — --force pour régénérer`)
    return
  }

  console.log('→ Récupération de la feuille de style Google Fonts…')
  const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text()

  const blocks = css.split('@font-face').slice(1).map((b) => `@font-face${b.split('}')[0]}}`)
  const kept = blocks.filter((b) => KEEP.some((r) => b.includes(`unicode-range: ${r}`)))

  console.log(`→ ${kept.length} coupes retenues sur ${blocks.length}`)

  const out = []
  for (const block of kept) {
    const url = block.match(/url\((https:[^)]+)\)/)?.[1]
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1]
    if (!url) continue
    const buf = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer())
    console.log(`  · Inter ${weight} — ${Math.round(buf.length / 1024)} Ko`)
    out.push(block.replace(/url\(https:[^)]+\)/, `url(data:font/woff2;base64,${buf.toString('base64')})`))
  }

  const result = `/* Inter — embarqué pour un livrable autonome hors ligne. SIL Open Font License 1.1 */\n${out.join('\n')}\n`
  await writeFile(OUT, result, 'utf8')
  console.log(`✓ ${OUT} — ${Math.round(result.length / 1024)} Ko`)
}

main().catch((err) => {
  console.error('✗ Échec du téléchargement des polices :', err.message)
  process.exit(1)
})
