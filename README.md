# Daily Assistant — prototype v0

Prototype haute fidélité d'un **Daily Assistant** pour les bankers Corporate Coverage,
intégré en compagnon par-dessus une application hôte simulée (**MyClientDev**).

React 18 + Vite + TypeScript + Tailwind CSS + composants de type Shadcn/UI (Radix).

## Lancer

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle statique dans dist/
```

## Livrable diffusable — un seul fichier HTML

```bash
npm run build:standalone   # → daily-assistant.html (~625 Ko)
```

Produit **`daily-assistant.html`**, autonome : polices Inter, CSS et JS sont inlinés,
**zéro requête réseau** au chargement. Le fichier s'ouvre par double-clic (`file://`) et
s'envoie par mail. Toutes les fonctionnalités sont identiques à la version `npm run dev` —
c'est le même bundle, seul l'emballage change.

Deux détails d'implémentation qui rendent le fichier robuste hors ligne :

- **Script classique, pas module ES.** Le bundle est émis en `iife`
  ([vite.standalone.config.ts](vite.standalone.config.ts)), car les `<script type="module">`
  subissent des restrictions CORS quand la page est ouverte en `file://`.
- **Inter embarquée en base64.** [scripts/fetch-fonts.mjs](scripts/fetch-fonts.mjs) télécharge
  la coupe *latin* des graisses 400/500/600/700 depuis Google Fonts et les encode en data-URI
  (Inter, SIL Open Font License 1.1). Le résultat est mis en cache dans
  `scripts/inter-embedded.css` — non versionné, régénéré au premier build
  (`node scripts/fetch-fonts.mjs --force` pour forcer). Sans cet embarquement, un destinataire
  hors ligne ou derrière un proxy filtrant retomberait sur la police système.

La coupe *latin* suffit au prototype : elle couvre les accents français, `œ`, `« »`, `’`,
`€`, `×`, `−`, `↑ ↓`. Ajouter *latin-ext* triplerait le poids des polices pour des glyphes
inutilisés.

## Charte graphique

Structure et densité du Design System bancaire interne (« platform-rad »), mais **le vert
historique BNP Paribas est remplacé** par une palette alternative **Slate / Navy avec accent
Indigo**. Les tokens sont définis en variables CSS dans [src/index.css](src/index.css) et
étendus dans [tailwind.config.js](tailwind.config.js) (`rad.navy`, `rad.indigo.*`).

## Les 3 états du compagnon

| État | Largeur | Contenu |
| --- | --- | --- |
| **Collapsed** | pilule ancrée à droite | icône + pastille de notification, positionnée sous le header et **déplaçable verticalement** |
| **Widget** | 380 px | header agents + favoris, page d'accueil conversationnelle |
| **Split View** | 50 % de l'écran | MyClientDev à gauche, Workspace de co-édition à droite |

La bascule Widget ⇄ Split View se fait par le bouton dédié dans le header de l'assistant
(icône colonnes / panneau). Un clic sur « Générer CBS/CAP » ou « Générer Briefing Memo »
depuis le briefing bascule automatiquement en Split View après 1 s de génération simulée.

### Le continuum accueil → conversation → document

Le widget ouvre sur une **page d'accueil**, pas sur une liste d'alertes. Quatre couches, du
chiffre vers l'action :

1. **Votre pouls** — des KPI chiffrés, dérivés des **agents épinglés** par l'utilisateur.
   Épingler un autre agent change le pouls ; chaque agent alimente au moins un KPI, donc
   l'accueil n'est jamais vide. À contexte égal, les KPI pertinents pour l'écran hôte
   remontent en premier.
2. **À la une** — les trois signaux les plus pertinents pour l'écran courant.
3. **Actions suggérées** — trois raccourcis sensibles au contexte.
4. **Composeur** — toujours accessible en bas.

Ces quatre entrées mènent au **même endroit** : une conversation. Cliquer sur un KPI, sur une
actualité ou sur une suggestion revient à poser la question correspondante. La réponse est une
[InsightCard](src/components/assistant/InsightCard.tsx) : synthèse, chiffres, sources,
« Data Gap », indice de confiance, et des rebonds qui relancent la conversation ou **escaladent
en Split View** sur le CBS/CAP ou le Briefing Memo.

La conversation vit dans `DailyAssistant` : elle survit aux changements d'écran hôte, de mode
et d'onglet interne. Aller éditer un document puis revenir ne la perd pas.

Le résolveur ([insights.ts](src/data/insights.ts)) choisit la réponse **par score**, pas au
premier mot-clé trouvé : « simule une baisse d'EBITDA sur le covenant » contient le mot
« covenant » mais doit répondre le scénario, pas la synthèse covenant.

### Pilule réduite — déplacement vertical

Position par défaut : 12 px sous le header hôte (`DEFAULT_PILL_TOP` dans
[CollapsedPill.tsx](src/components/assistant/CollapsedPill.tsx)). Elle se saisit à la souris
et se déplace **sur l'axe vertical uniquement**, entre le bas du header et le bas du viewport.
La position est conservée entre deux ouvertures du panneau, et réajustée si la fenêtre rétrécit.

[useVerticalDrag.ts](src/hooks/useVerticalDrag.ts) — trois choix qui comptent pour la fluidité :

- **Pointer Events avec capture** : le glissement se poursuit même si le curseur sort de la
  pilule ou de la fenêtre.
- **Écriture directe sur le nœud DOM** pendant le geste, state React synchronisé au relâché
  seulement : aucun rendu entre le `pointerdown` et le `pointerup`.
- **Garde en ref, pas en state** : le premier `pointermove` n'est jamais perdu en attendant
  un re-rendu.

Un glissement de plus de 3 px n'ouvre pas le panneau — seul un clic net le fait. Au clavier,
`Entrée` ouvre, `↑` / `↓` déplacent par pas de 16 px.

## Écrans hôtes et sensibilité au contexte

MyClientDev simule cinq écrans, navigables depuis la barre supérieure et depuis les écrans
eux-mêmes (« Éditer la fiche », clic sur une ligne du portefeuille). L'assistant **n'est jamais
démonté** : il vit à côté de l'hôte dans l'arbre React, garde sa position, son mode et son
document ouvert d'un écran à l'autre.

| Écran hôte | Agent mis en avant | Ce que l'assistant remonte |
| --- | --- | --- |
| Mon portefeuille | 360 client opportunity radar | signaux transverses aux 24 groupes |
| Clients (fiche) | Client & market intelligence | veille client et marché des 24 h |
| Édition de la fiche | CBS/CAPs | champs désynchronisés du CBS/CAP |
| Pipeline | Deal duplicator | deals réplicables, échéances proches |
| Crédit | Early warning signal | signaux faibles, marges de covenant |

Le mapping vit dans [hostRoutes.ts](src/data/hostRoutes.ts) ; chaque alerte porte un tableau
`contexts` ([briefing.ts](src/data/briefing.ts)) qui pilote son classement. Le bandeau
« Contexte détecté » ([ContextBanner.tsx](src/components/assistant/ContextBanner.tsx)) affiche
l'écran reconnu, l'agent retenu et l'action la plus pertinente.

Deux règles de non-intrusion :

- l'agent ne se recale sur le contexte que si l'utilisateur ne l'a pas choisi à la main ;
- naviguer pendant une co-édition **ne referme pas le document** et ne perd aucune modification.

## Human-in-the-loop

- Tous les blocs du document sont **éditables à la main** (`contentEditable`, sauvegarde au blur).
- **Badges de source** au survol : `[Source: C3]`, `[Source: Dealogic]`, `[Source: Baccarat]`,
  `[Source: Atlas]`, `[Source: Bloomberg]`, `[Source: ESG Hub]`, `[Source: Orbit]`, `[Source: Presse]`.
- **Data Gap** : badge ambre sur toute donnée partielle (ex. « Donnée Baccarat non disponible »).
- **Confidence** : indicateur par bloc et pour le document entier.
- **Chat IA** : la demande insère un nouveau bloc d'opportunité dans le document, qui reste éditable.
- **Édition au clic** : les blocs ne sont pas `contentEditable` en permanence. Un clic net rend
  le bloc visé éditable et y replace le curseur (`caretRangeFromPoint`) ; un glissement produit
  une sélection. C'est la condition pour que la sélection traverse plusieurs blocs — le
  navigateur **clampe toute sélection à l'intérieur d'un unique hôte d'édition**. Avec des blocs
  éditables en permanence, un `Range` de 263 caractères sur trois puces donnait une `Selection`
  de 111 : le premier bloc seulement.
- **Retouche par sélection**, sur une phrase, un paragraphe ou **plusieurs blocs** : surligner
  ouvre, **au relâché du bouton**, une bulle
  ([SelectionPopover.tsx](src/components/assistant/SelectionPopover.tsx)) proposant quatre
  retouches — *Raccourcir*, *Actualiser les chiffres*, *Sourcer*, *Développer* — ou une consigne
  libre. Seul le passage sélectionné est réécrit : les bornes viennent du `Range`, pas d'un
  `indexOf`, donc le reste du document est préservé au caractère près même si l'extrait
  apparaît plusieurs fois. La retouche s'affiche dans le fil de co-édition avec l'extrait cité
  et un bouton **Annuler** (instantané complet des blocs, car une retouche peut en toucher
  plusieurs, en supprimer, ou vider des puces).

  Les **indicateurs chiffrés** sont aussi des cibles : leur valeur est sélectionnable et
  éditable au clic. Sur un chiffre, seules *Actualiser* et *Sourcer* ont un sens — *Raccourcir*
  « €385 M » n'en a aucun, donc l'assistant laisse la valeur intacte et le dit. *Actualiser*
  met à jour la valeur **et** sa variation de pair, en gardant la cohérence arithmétique
  (3,75 − 3,26 = 0,49) ; *Sourcer* ajoute un `SourceRef` structuré plutôt que du texte dans le
  chiffre. La citation affichée est reconstruite depuis les cibles, pas depuis
  `sel.toString()`, qui embarquerait le texte des badges et des libellés.

  Quand la sélection couvre plusieurs blocs de texte, la portée dépend de la consigne
  (`scopeOf` dans [rewrites.ts](src/data/rewrites.ts)) : *actualiser* et *sourcer* s'appliquent
  **bloc par bloc** — actualiser trois puces doit actualiser les trois, pas les fusionner ;
  *raccourcir*, *développer* et *reformuler* portent sur **l'ensemble du passage**, le résultat
  atterrit dans le premier bloc et les suivants sont nettoyés.
  *Actualiser les chiffres* ne touche qu'aux valeurs courantes listées dans
  [rewrites.ts](src/data/rewrites.ts) et laisse intacts les comparatifs historiques
  (« 2,8× au FY25 »), qui ne doivent jamais être réactualisés.

  Deux règles dans [useDocSelection.ts](src/hooks/useDocSelection.ts) rendent le geste
  utilisable, et leur absence le casse complètement :
  **rien n'est publié pendant le glissement** — une bulle qui s'ouvre au troisième caractère
  surligné interrompt la sélection en cours ; et le champ de saisie **n'a pas d'`autoFocus`** —
  prendre le focus viderait la sélection du document à l'instant où l'utilisateur vient de la
  faire. Un clic dans la bulle gèle la sélection au lieu de la perdre.
- **Export PDF / PPTX** simulé dans la barre d'outils.

## Structure

```
src/
├── App.tsx                       # orchestration des états collapsed / widget / split
├── components/
│   ├── ui/                       # primitives type Shadcn (button, card, badge, tabs, tooltip…)
│   ├── host/                     # application hôte simulée MyClientDev
│   │   ├── MyClientDev.tsx       # coquille + routeur d'écrans
│   │   ├── TopNav.tsx
│   │   ├── DataTable.tsx
│   │   └── pages/                # PortfolioPage, ClientOverviewPage,
│   │                             # ClientEditPage, PipelinePage, CreditPage
│   └── assistant/
│       ├── DailyAssistant.tsx    # coquille du compagnon
│       ├── AssistantHeader.tsx   # sélecteur des agents + épinglage des 3 priorités
│       ├── ContextBanner.tsx     # « contexte détecté » selon l'écran hôte
│       ├── CollapsedPill.tsx
│       ├── AssistantHome.tsx     # accueil : pouls, à la une, suggestions
│       ├── ConversationView.tsx  # fil de conversation
│       ├── InsightCard.tsx       # réponse structurée + rebonds
│       ├── Composer.tsx          # champ de saisie partagé
│       ├── DailyBriefing.tsx     # alertes marché + actions rapides
│       ├── Workspace.tsx         # document co-édité + barre d'outils
│       ├── DocumentBlock.tsx     # rendu d'un bloc (kpi, opportunité, callout…)
│       ├── Editable.tsx          # contentEditable non contrôlé
│       ├── ChatPanel.tsx
│       ├── ExportMenu.tsx
│       └── TrustBadges.tsx       # Source / Data Gap / Confidence
├── data/                         # mocks : agents, client, briefing, documents,
│                                 # pulse (KPI), insights (réponses IA), hostRoutes
└── hooks/
    ├── useWorkspaceDoc.ts        # état du document + chat de co-édition
    ├── useAssistantChat.ts       # conversation de l'accueil
    └── useVerticalDrag.ts        # déplacement de la pilule réduite
```

## Contraintes respectées

Aucune API externe, aucun LLM. Toutes les données sont fictives et vivent dans `src/data/`.
Les générations sont simulées par `fakeLatency(1000)` dans [src/lib/utils.ts](src/lib/utils.ts).
