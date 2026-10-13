# CLAUDE.md — spenzia-website (spenzia.kyralabs.dev)

Standing instructions for Claude Code sessions in this repo. Owner: Mohammed Thalha (YamTee), Kyra Labs.

## What this is

The Spenzia app page (Spenzia is the in-development expense tracker): a static **Astro** site (`src/pages/index.astro`, `src/pages/privacy.astro` → `dist/index.html`, `dist/privacy.html`). It's built on the Kyra Labs Material 3 Expressive library **@kyralabs/m3exp-web 1.0.0** (`@kyralabs/m3e-tokens`, `m3e-css`, `m3e-react`, `^1.0.0` from npm), with the same system as kyralabs.dev (kyra-labs/website, see its `CLAUDE.md`). Library repo: kyra-labs/m3exp-web.

## Commands

pnpm 12.11.2 (`packageManager`), Node ≥ 22.12 (`.nvmrc` 24).

- `pnpm dev`, `pnpm build` → `dist/`. Both run `pnpm gen` first: the theme from `src/brand.mjs` and the icon subset from `src/icons.txt`, into `src/styles/generated/` (git-ignored).
- `pnpm lint:css` (tokens only), `pnpm typecheck`, `pnpm check:js` (client-JS allowlist), `pnpm lighthouse` (accessibility must be 100).

## Rules

- **Zero client JS except two `client:only="react"` islands**: the navigation bar (`src/islands/SectionNav.tsx`) and the waitlist LoadingIndicator (`src/islands/WaitlistForm.tsx`, used twice). `scripts/check-client-js.mjs` enforces this.
- **Tokens only** in `src/styles/site.css` (`var(--m3e-…)`; stylelint with the library's plugin). The only literals allowed are breakpoints and `vw` margins. Data values (budget fills, chart heights) are passed from markup as `--_fill`/`--_value`.
- **Keep exactly**: copy, section order, URLs/anchors, privacy text, SEO meta, canonical, JSON-LD, og-image, robots, sitemap, favicons/manifest, logos. Call out any deliberate change in the PR.
- **Theme**: Kyra red `#d84848`, `fidelity`, light + dark. **Font**: Google Sans Flex. **Icons**: Material Symbols Rounded via `src/icons.txt`.
- **Don't change the library from here**; write up library bugs for the owner.
- **Hosting**: Netlify today, via `netlify.toml` (`pnpm build`, `dist`; without it a merge would publish the repo root and 404). The planned move is to Cloudflare Workers static assets: `wrangler.jsonc` (Worker **`spenzia-website`**, which must match the dashboard name; `html_handling: "none"`, `previews: {}`) + `public/_redirects`. Keep both working.
- **Workflow**: branch → draft PR → CI green → tick "CI green", mark ready, post a self-review comment. The owner merges, never Claude. Commits end with `Co-Authored-By: Claude …`. `gh` needs `export PATH="$PATH:/c/Program Files/GitHub CLI"`. Never touch `.hallmark/` or `.agents/`.

## Decisions (2026-10-13)

- Same playbook as kyralabs.dev; the owner confirmed Netlify + Cloudflare-ready.
- ⚠️ **Both waitlist forms store nothing** (no backend). They show "you're on the list" after a 450 ms LoadingIndicator, while privacy.html says emails are collected. Wire a real endpoint into `WaitlistForm.tsx`.
- JetBrains Mono (Google Fonts, never used by any CSS) was dropped.

## History

- PR #1: Astro rebuild on @kyralabs. Lighthouse accessibility went from 90–91 to 100. Heading levels were fixed (h3/h4 → h2, same text), and the spending chart bars render now (the old CSS never styled them).

## Known gaps / follow-ups

- On phones the hero shows the phone mock before the headline (old DOM order kept).
- Mobile performance (simulated) ~89 because of the islands' React runtime.
