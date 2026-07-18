# Well Worth It

## Global Career Accelerator assignment

This repository contains Sahar Rao’s student concept and working prototype for
the Global Career Accelerator “charity: water Game Concept” assignment. It is a
design-and-frontend exercise demonstrating game concept development, digital
wireframing, interaction logic, responsive layouts, accessibility thinking, and
AI-assisted ideation.

It is not an official charity: water product, fundraising page, impact tracker,
or endorsement. The app displays an explicit assignment disclaimer before the
experience opens. Stories, locations, photos, metrics, rewards, and project
references are sample content only. No donation is accepted, and leaderboard
data stays on the local device.

The implementation target is a mobile-first, accessible single-page experience:

- Main Game: hold-to-fill water-project progress.
- Village: deterministic building unlocks and impact stats.
- Stories: bundled, source-traceable project stories.
- Leaderboard: local personal bests in the web pilot, with Supabase-shaped
  server validation and synthetic campus fixtures prepared for the stakeholder
  build.

## Repository shape

- `apps/web` — dependency-free shareable browser demo.
- `apps/mobile` — Expo Router shell for iOS and Android.
- `packages/game-core` — deterministic phase, quest, reward, and unlock rules.
- `packages/content-schema` — provenance-aware story metadata validation.
- `supabase` — RLS migration and server-side score submission function.
- `docs` — product boundary and accessibility notes.

Run the deterministic checks with `npm test`. The mobile app requires an Expo
development environment and intentionally has no embedded provider secrets.

This repository is an experiment and is not affiliated with or endorsed by charity: water.

## Local pilot boundary

This build is suitable for a controlled demo or usability pilot on localhost.
It intentionally does not provide real donations, real project attribution,
account registration, a shared leaderboard, or a backend. All story, location,
photo, and impact content is sample content pending source and licensing review.

Run it with:

```powershell
python -m http.server 4175
Start-Process http://127.0.0.1:4175/index.html
```

Before an external pilot, replace sample content with approved sources, add a
privacy/consent flow if collecting data, and implement server-side identity,
validation, rate limits, anti-cheat controls, monitoring, and a reviewed
donation provider. Do not enable those integrations by placing secrets in this
repository or in browser JavaScript.

## Council provider diagnostics

`council-deep.py --dry-run` reads Anthropic, OpenAI, and Gemini keys from the
DPAPI-protected store and reads `PERPLEXITY_API_KEY` from the environment. A
Perplexity HTTP 401 means that credential must be replaced in the selected
credential manager; the adapter records the provider failure and continues with
the remaining council members.
