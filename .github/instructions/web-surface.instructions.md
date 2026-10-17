---
applyTo: "**/*.html,**/*.css,**/*.js,**/*.mjs,**/*.cjs,**/*.ts,**/*.tsx,**/*.jsx,**/*.json"
---

# Echohearts web-surface instructions

This repository is a web/presentation/supporting-app surface, not the UE5.8 runtime authority.

- Consume approved canon/contracts from `Dlomotion/Echohearts-Rebearth`.
- Do not invent Permanent Dex IDs, forms, story outcomes, or gameplay truth in frontend code.
- Do not present mock data, animations, browser prototypes, or static pages as proof that UE5.8 gameplay exists.
- Keep accessibility, responsive layout, input semantics, validation, error handling, and performance explicit.
- Never copy executable gameplay logic here merely to make the web surface look complete.

## Toolchain-resolution routing

- Executable compiler resolution lives only in `Dlomotion/ECHOHEARTS-REBEARTH-BUILD-/BuildScripts/EchoheartsCompiler.py`. Do not copy a Python compiler driver into this repo; route UE/Python build-driver repair to BUILD and canonical documentation to `Dlomotion/Echohearts-Rebearth`.
- Guidance for BUILD fixes: an explicit compiler target must resolve via PATH or be a regular executable file; reject blank, missing, directory, and unsupported targets. Never treat `shutil.which(x) or x` as proof a tool exists, and never classify every unknown executable as GNU.
- Use argv-based subprocess calls; filename blacklists (e.g. `hack`/`override`) are not security.
- Do not add an Unreal Blueprint string library, `std::string`-to-char-array examples, or magic tracking IDs (`0x2C`/`0x2D`) here.
- TypeScript/JavaScript remains this repo's implementation lane.
- `STATIC CHECK PASSED` requires retained check evidence; UE5.8 runtime remains NOT YET VERIFIED without BUILD evidence.
