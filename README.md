# echohearts-web

Web/presentation and supporting-app surface for **Echohearts: Rebearth**.

This repository may host public-facing web experiences, prototypes, documentation views, and approved supporting tools. It is **not** the canonical game-design authority and it is **not** the executable Unreal Engine 5.8 runtime authority.

## Source of truth

- Canon, systems, story, 125-ID Permanent Dex, production contracts, and publication: `Dlomotion/Echohearts-Rebearth`
- Executable UE5.8 C++ runtime, build/package tooling, tests, and retained runtime evidence: `Dlomotion/ECHOHEARTS-REBEARTH-BUILD-`

Web implementations must consume approved Echohearts data/contracts without inventing new canon, Dex IDs, gameplay truth, or verification claims.

## Verification boundary

A working webpage or web prototype does not prove UE5.8 gameplay, save/network behavior, cross-play, AI, performance, or packaged-runtime completion. Report web validation separately from game-runtime evidence.

## Local Echo Egg prototype

Run `npm start` and open `http://127.0.0.1:8080/game/` to try the browser care-loop prototype. Run `npm test` for its isolated logic tests. Its meter ranges and rates are prototype tuning; completion does not generate a species, Dex ID, or rarity, and the prototype is not Unreal Engine runtime evidence.

## World Explorer

Run `npm start` and open `http://127.0.0.1:8080/explorer/`. The supplied illustrated region explorer now includes adjustable mountains/canyons, inertial flight with pitch/roll/gravity, a mini-map, compass and predicted collision warnings. Focus the terrain view for keyboard controls, or use the touch buttons. Export tuning as JSON.

`npm test` includes eight deterministic terrain/flight checks. Browser checks covered rendering, controls, pause, region selection, JSON export, original filters and mobile overflow. This is a browser authoring study; terrain units and balancing are provisional and no Unreal import or runtime verification is claimed.

The original illustrated locations remain source content pending canonical identity reconciliation. Safehold, Heritage, expression and Sanctuary direction is governed by the October 23 owner ruling in the canon repository. Original source HTML SHA-256: `a1f5585d91b4757225b4bed375a804ad218a14cba71a1b9d5bf61a7d2d1d213c`.
