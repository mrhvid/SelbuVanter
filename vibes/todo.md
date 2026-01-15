# TODO List

## Implementation TODO (commit-sized tasks)

- [M-001] Define mitten data model schema (estimate: 4h) — DONE (scaffolded `src/mitten-model.js`).
- [M-002] Implement model classes and in-memory API (estimate: 6h) — IN PROGRESS (scaffold created).
- [M-003] Add model persistence interface (localStorage / file adapter) (estimate: 4h) — TODO.
- [T-001] Design template registry API (estimate: 2h) — DONE (registry skeleton in `templates/registry.js`).
- [T-002] Implement template registry storage and CRUD (estimate: 5h) — TODO.
- [R-001] Extract renderer core interface (estimate: 3h) — TODO.
- [R-002] Refactor current renderer to modular implementation (estimate: 6h) — TODO.
- [U-001] Create region model and selection logic (estimate: 3h) — TODO.
- [U-002] Implement region UI primitives (estimate: 5h) — TODO.
- [L-001] Define print/layout spec for A4 (estimate: 3h) — IN PROGRESS (scaffolded `src/print-layout.js`).
- [E-001] Design export/import JSON format (estimate: 2h) — TODO.
- [TS-001] Set up test framework and CI config (estimate: 4h) — TODO.

Notes:
- Scaffolds added: `src/mitten-model.js`, `templates/registry.js`, `src/print-layout.js`.
- Next actionable: implement persistence and hook model to UI/renderer.

_Last updated: 2026-01-15_