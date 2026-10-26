---
applyTo: "**/*.html,**/*.css,**/*.js,**/*.ts,**/*.tsx,**/*.jsx"
---
## 2026-10-20 live runtime ownership correction (takes precedence)

- The active executable Unreal Engine 5.8 C++ project, build/package tooling, tests, and retained runtime evidence now live in `IN2Deep-Studios/ECO-KIN-Game`.
- The former `Dlomotion/ECHOHEARTS-REBEARTH-BUILD-` and `Dlomotion/ECHOHEARTS-REBEARTH-` addresses are unavailable. Do not route work to them, recreate them, or create another Unreal project/module.
- UE gameplay/create/fix requests belong in the existing `EchoheartsRebearth.uproject` and `EchoheartsRebearth` module in the live game repository. This repository retains its declared non-runtime role.
- Any later line in this file that calls ECO-KIN-Game legacy/prototype-only or names the former BUILD repository as active is superseded by this section.
- Repository/static checks never prove UHT/UBT, Editor, PIE, networking, save/cloud, cooking, package launch, performance, target hardware, or EPUB rendering.


# Echohearts web instructions

This repository owns browser presentation/prototype work, not the UE5.8 executable runtime. Keep web fixes responsive, keyboard-accessible, screen-reader-aware, and performant. Do not paste Unreal C++ into browser code or claim web behavior proves UE runtime behavior.

Use canon names from `Dlomotion/Echohearts-Rebearth`. Route executable gameplay requirements to `Dlomotion/ECHOHEARTS-REBEARTH-BUILD-`.

When implementing math/gameplay visualizations, keep them as tooling/presentation unless a separate runtime implementation is explicitly requested.
