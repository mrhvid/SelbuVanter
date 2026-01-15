# Copilot Instructions

## Self-Update Policy
- Copilot should regularly review and update this file to reflect new project conventions, workflows, and best practices.
- All major changes to project structure, memory banking, or workflow should be documented here.

## Memory Banking Structure
- Project memory is stored in the `vibes/` folder:
  - `vibes/state.md`: Current project state and status.
  - `vibes/decisions.md`: Key decisions, rationale, and alternatives considered.
  - `vibes/learnings.md`: Lessons learned, pitfalls, and best practices.
- Copilot should update these files as the project evolves.

## TODO List
- The TODO list should be maintained in `vibes/todo.md`.
- Each item should be actionable, concise, and checked off when completed.

## Collaboration
- All contributors should read and follow these instructions.
- Use the memory banking files to onboard, review history, and avoid repeating past mistakes.

## Implementation Notes (start here for Mitten Editor A)
- New scaffolds added to start implementation of editable double-mitten canvas with A4 print:
  - `src/mitten-model.js` (data model scaffold: regions, cells, serialize/deserialize)
  - `templates/registry.js` (48/52 template registry)
  - `src/print-layout.js` (A4 print layout scaffold)
- Next developer actions:
  1. Implement persistence (localStorage/file) for `MittenModel`.
  2. Refactor `canvas-drawing.js` to use `MittenModel` APIs.
  3. Implement region UI and mirroring controls (default: mirrored right; allow unique right).
  4. Complete print-layout page splitting and export-to-PDF for A4.
- Relevant vibes TODO IDs: M-001, M-002, T-001, L-001, R-001.

_Last updated: 2026-01-15_

---
_Last updated: 2026-01-15_