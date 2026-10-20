# CLAUDE.md — spenzia-website (spenzia.kyralabs.dev)

Standing instructions for Claude Code sessions in this repo. Owner: Mohammed Thalha (YamTee), Kyra Labs.

## What this is

The Spenzia app page (Spenzia is the in-development expense tracker): a static **Astro** site (`src/pages/index.astro`, `src/pages/privacy.astro` → `dist/index.html`, `dist/privacy.html`). It's built on the Kyra Labs Material 3 Expressive library **@kyralabs/m3exp-web 1.7** (`@kyralabs/m3e-tokens`, `m3e-css`, `m3e-react`, `m3e-elements`, `^1.7.0` from npm), with the same system as kyralabs.dev (kyra-labs/website, see its `CLAUDE.md`). Library repo: kyra-labs/m3exp-web.

## Commands

pnpm 12.11.2 (`packageManager`), Node ≥ 22.12; `.nvmrc` is pinned to **24.21.0** (2026-10-15: on Node 24.22.0, Cloudflare Workers Builds' Corepack setup of pnpm 12 fails with "Cannot find module …/corepack/v1/pnpm/12.11.2/bin/pnpm.cjs" before install; 24.21.0 is the last version that built. Only bump it after a Workers build passes on the new version).

- `pnpm dev`, `pnpm build` → `dist/`. Both run `pnpm gen` first: the theme from `src/brand.mjs` and the icon subset from `src/icons.txt`, into `src/styles/generated/` (git-ignored).
- `pnpm lint:css` (tokens only), `pnpm typecheck`, `pnpm check:js` (client-JS allowlist), `pnpm check:no-js` (every page with JavaScript off: all text visible; saves screenshots), `pnpm lighthouse` (accessibility and SEO must be 100, mobile + desktop; performance warns below 85).

## Rules (the JS rule was updated on 2026-10-15)

- **Client JS: enhancement only.** Two `client:only="react"` islands (the navigation bar, `src/islands/SectionNav.tsx`; the waitlist form, `src/islands/WaitlistForm.tsx`, used twice: the m3e-css outlined text field, the LoadingIndicator and a snackbar whose `@kyralabs/m3e-elements/snackbar-host.js` is imported on the first submit, never at load) plus one small deferred module, `src/scripts/enhance.ts` (the m3e press ripple + `html.js`), imported from `Base.astro`. All content, headings, links, meta and structured data stay in the server-rendered HTML; JS never creates or loads content; nothing render-blocking in `<head>`. Prefer CSS (scroll-driven animations) when it can do the job. `scripts/check-client-js.mjs` enforces the allowlist (islands, Astro runtime, one enhancement module ≤ 4 KB gzip, never in `<head>`) and fails on anything else.
- **Never hide content waiting for JS.** Any "hidden before animation" state is gated behind `html.js` (set by `enhance.ts`); the load entrance is transform-only so nothing is ever hidden. `pnpm check:no-js` proves the page is complete with JavaScript off. Animate transform/opacity only (no layout shift), use the `--m3e-sys-motion-*` spring tokens, and respect `prefers-reduced-motion`. The hero copy rises as one block: the waitlist island inside it is re-rendered on hydration, so a per-item animation would replay.
- **Layout: m3.material.io's expressive system** (since 2026-10-20, same as kyralabs.dev; replaces "a pane per section"). Page on `surface`, content capped at `--m3e-sys-window-width-extra-large`. **Duos** (`.duo`): a text pane (`.pane--text`, `surface-container-low`) next to an **art pane** (`.pane--art` + `.art--primary|secondary|tertiary|neutral`: a colour role, Material shapes behind, the content card in front on `surface-container-lowest`) or a form pane (`.pane--form`); side by side from 840px, 8dp apart, `extra-large(-increased)` corners. **Blocks** (`.block`): sections straight on the page surface. Cards are tonal (filled, no shadow, no hover lift; none has a single primary link, so none is interactive); lists are M3 segmented lists (`.seg-list`); feature rows lead with a Material Symbol in a tonal circle. Type: hero h1 display large, feature h2 display small/medium from expanded, the closing `h2.display` display large from 1200px, body large for paragraphs, small labels (`.eyebrow`) in on-surface-variant. **Shapes**: `src/components/Shape.astro` renders any of the 35 Material shapes (`@kyralabs/m3e-shapes`, dev dependency) to static SVG at build time; decorative, `aria-hidden`; they grow in on load and turn with scroll (CSS only). The hero text comes first in the DOM (the phone mock follows).
- **Tokens only** in `src/styles/site.css` (`var(--m3e-…)`; stylelint with the library's plugin). The only literals allowed are breakpoints and `vw` margins. Data values (budget fills, chart heights) are passed from markup as `--_fill`/`--_value`.
- **Keep exactly**: copy, section order, URLs/anchors, privacy text, SEO meta, canonical, JSON-LD, og-image, robots, sitemap, favicons/manifest, logos. Call out any deliberate change in the PR.
- **Theme**: Kyra red `#d84848`, `fidelity`, with core colours neutral + neutralVariant `#808080` (grey surfaces, text and outlines) and tertiary `#c8862a` (amber), light + dark (`src/brand.mjs`, palette C, chosen by the owner on 2026-10-15, same as kyralabs.dev). With `fidelity`, `neutralVariant` must be set too or secondary text and outlines stay red-tinted. Nothing uses tertiary today; don't use tertiary-container for decorative badges. **Font**: Google Sans Flex. **Icons**: Material Symbols Rounded via `src/icons.txt`.
- **Don't change the library from here**; write up library bugs for the owner.
- **Hosting**: Netlify today, via `netlify.toml` (`pnpm build`, `dist`; without it a merge would publish the repo root and 404). The planned move is to Cloudflare Workers static assets: `wrangler.jsonc` (Worker **`spenzia-website`**, which must match the dashboard name; `html_handling: "none"`, `previews: {}`) + `public/_redirects`. Keep both working.
- **Workflow**: branch → draft PR → CI green → tick "CI green", mark ready, post a self-review comment. The owner merges, never Claude. Commits end with `Co-Authored-By: Claude …`. `gh` needs `export PATH="$PATH:/c/Program Files/GitHub CLI"`. Never touch `.hallmark/` or `.agents/`.

## Decisions (2026-10-13)

- Same playbook as kyralabs.dev; the owner confirmed Netlify + Cloudflare-ready.
- ⚠️ **Both waitlist forms store nothing** (no backend). They show "you're on the list" (in a snackbar since 1.7) after a 450 ms LoadingIndicator, while privacy.html says emails are collected. Wire a real endpoint into `WaitlistForm.tsx`.
- JetBrains Mono (Google Fonts, never used by any CSS) was dropped.

## History

- PR #1: Astro rebuild on @kyralabs. Lighthouse accessibility went from 90–91 to 100. Heading levels were fixed (h3/h4 → h2, same text), and the spending chart bars render now (the old CSS never styled them).
- 2026-10-15, "look like Google's apps" (port of kyralabs.dev's change): @kyralabs 1.1.0, palette C, press ripple on plain-HTML components, pane layout, headline section titles, load entrance + scroll reveals gated behind `html.js`, JS rule relaxed to "enhancement only" with `check:no-js` and SEO 100 in CI.

- 2026-10-19, @kyralabs 1.7.0 (port of kyralabs.dev's change): both waitlist emails are the m3e-css outlined text field (1.6; it replaced the input hand-built from tokens) with a visible floating "Email address" label (it was visually hidden) and the library's required "*"; validation is the island's (`noValidate`), with "Please enter a valid email address." as error text (`role="alert"`) instead of the browser's bubble; the result shows in one shared snackbar (1.7) above the navigation bar. The text field is plain m3e-css markup, not m3e-react `<TextField>`, and the snackbar host is lazy-loaded, because both islands share one m3e-react chunk and those two components would add ~11 KB gzip to every page's navigation bar. Roundness (fonts-rond.css) is not used: no ROND token exists and `font-variation-settings` takes tokens only.

- 2026-10-20, **M3 Expressive redesign** (port of kyralabs.dev's, after comparing with m3.material.io, the Google blog, Google Fonts and the Workspace product pages): grey panes with shadowed cards became the duo/block system above. The hero's text now comes before the phone mock in the DOM, so phones show the headline first (it was a known gap). Copy, links, ids, meta and JSON-LD unchanged.

## Known gaps / follow-ups

- Mobile performance (simulated) ~86–89 because of the islands' React runtime (~92 KB gzip on 1.1); observed LCP is ~0.3 s. Keep the load entrance short (a long one pushes Speed Index/LCP up).
