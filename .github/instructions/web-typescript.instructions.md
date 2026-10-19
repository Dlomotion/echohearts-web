---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,package.json,tsconfig*.json,eslint*.js,eslint*.mjs,vite.config.*,next.config.*,src/**/*"
---

# Echohearts Web TypeScript/JavaScript Implementation and Repair Rules

This repository owns the web/presentation/supporting application surface. Do not move Unreal runtime authority here.

## Before editing

- Inspect \`package.json\`, lockfile, TypeScript config, framework config, lint/test scripts, environment schema, source layout, API clients, components, routes, tests, and current error output.
- Use the repository's existing package manager and framework.
- Do not replace dependencies or rewrite the app because a smaller fix is possible.
- Preserve public routes/API contracts unless the requested change requires a migration.

## TypeScript rules

- Prefer TypeScript for new web logic when the current stack supports it.
- Avoid \`any\` unless a boundary is genuinely untyped and documented.
- Narrow \`unknown\` safely.
- Use discriminated unions or explicit schemas for stateful/network payloads.
- Validate external API/user data at runtime; static types alone are not validation.
- Keep async errors observable and actionable.
- Avoid silent promise rejection handling.
- Keep UI state deterministic and avoid duplicate sources of truth.
- Preserve accessibility: semantic elements, keyboard support, focus behavior, labels, and reduced-motion behavior where relevant.

## Echohearts data contracts

When web UI displays game data:
- preserve Vibrance, Density, Harmony, Purity naming;
- preserve Eco-Kin terminology;
- preserve Permanent Dex IDs rather than inventing client-only IDs;
- treat Forms Registry entries as forms linked to base Dex identities;
- preserve Anima-Link/Huma-Link terminology when surfaced;
- never silently turn historical/retired names into playable canon.

## Security

- never expose server secrets in browser bundles;
- validate and encode untrusted content;
- avoid unsafe HTML injection;
- protect authenticated mutations with the existing auth/authorization model;
- avoid trusting client-calculated progression, inventory, currency, scores, or authoritative game state;
- never commit tokens or local environment files.

## Repair loop

1. Reproduce the exact TypeScript/build/lint/test/browser error.
2. Find the first actionable cause.
3. Fix the smallest coherent surface.
4. Add/update a regression test when practical.
5. Run typecheck, lint, tests, and production build scripts that exist in the repo.
6. Report what passed and what remains unverified.

Do not claim the Unreal game/runtime is verified because the web build passes.
