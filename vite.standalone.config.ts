import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'

const ROOT = __dirname
const TMP = path.resolve(ROOT, '.standalone-tmp')
const FONT_CSS = path.resolve(ROOT, 'scripts/inter-embedded.css')
const OUTPUT = path.resolve(ROOT, 'daily-assistant.html')

/**
 * Assemble le bundle en un fichier HTML unique et autonome :
 * polices Inter en base64 + CSS + JS inlinés, aucune requête réseau.
 */
function inlineEverything(): Plugin {
  return {
    name: 'inline-everything',
    apply: 'build',
    closeBundle() {
      const assets = path.join(TMP, 'assets')
      const files = fs.readdirSync(assets)
      const css = files.filter((f) => f.endsWith('.css')).map((f) => read(path.join(assets, f)))
      const js = files.filter((f) => f.endsWith('.js')).map((f) => read(path.join(assets, f)))

      if (!fs.existsSync(FONT_CSS)) {
        throw new Error(
          'scripts/inter-embedded.css manquant — lancez d’abord `node scripts/fetch-fonts.mjs`.'
        )
      }

      const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyClientDev — Daily Assistant (prototype v0)</title>
    <style>${read(FONT_CSS)}</style>
    <style>${css.join('\n')}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>${js.map(guard).join('\n')}</script>
  </body>
</html>
`

      fs.writeFileSync(OUTPUT, html, 'utf8')
      fs.rmSync(TMP, { recursive: true, force: true })
      const kb = Math.round(Buffer.byteLength(html) / 1024)
      // eslint-disable-next-line no-console
      console.log(`\n✓ ${path.relative(process.cwd(), OUTPUT)} — ${kb} Ko, autonome hors ligne`)
    },
  }
}

const read = (p: string) => fs.readFileSync(p, 'utf8')

/** Empêche un `</script>` présent dans une chaîne de fermer la balise. */
const guard = (code: string) => code.replace(/<\/script/gi, '<\\/script')

export default defineConfig({
  plugins: [react(), inlineEverything()],
  resolve: {
    alias: { '@': path.resolve(ROOT, './src') },
  },
  build: {
    outDir: TMP,
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    // IIFE : un seul chunk exécutable en <script> classique, donc pas de
    // restriction CORS sur les modules ES quand le fichier est ouvert en file://
    rollupOptions: {
      output: { format: 'iife', inlineDynamicImports: true },
    },
  },
})
