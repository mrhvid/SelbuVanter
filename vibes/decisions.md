# Key Decisions

## Outline & Canvas
- Outlines must match book templates for all sizes, with correct pixel spacing.
- Double-mitten layout: left mitten is editable, right mitten is mirrored.
- Outline simplified to symmetric hand with 45-degree zigzag tip (no thumb/gusset).

## Memory Banking
- Project memory is stored in the `vibes/` folder for state, decisions, and learnings.
- TODO list is maintained in `vibes/todo.md`.

## Alternatives Considered
- Mirroring logic: tested several approaches to ensure symmetry at grid center.
- Outline complexity: decided to remove thumb/gusset for clarity and maintainability.

## Implementation Details
- Canvas drawing logic: implemented in `canvas-drawing.js` using a coordinate-based grid.
- Double-mitten behavior: left canvas accepts drawing input; right canvas is rendered by mirroring the left's grid across the vertical centerline.
- Mirroring edge cases: special handling added for the grid center column to avoid overlap/artifacts near the mitten pair seam.
- Pixel-accurate templates: coordinates were adjusted to match the three book template sizes and maintain correct pixel spacing between pattern rows.
- Simplification: removed thumb and gusset lines to create a single symmetric hand outline that is easier to mirror and maintain.

## Operational Decisions
- Files created for project memory: `.github/copilot-instructions.md`, `vibes/state.md`, `vibes/learnings.md`, and `vibes/todo.md`.
- `vibes/todo.md` is the canonical TODO list for the project and should be kept up-to-date by contributors.
- When adding features that affect mirroring (thumbs, asymmetric needles, etc.), update mirroring logic and add tests or visual checks to `vibes/`.

## Changelog
- 2026-01-15: Added memory banking structure and TODO list; recorded design and implementation decisions based on recent refactors and user requests.

_Last updated: 2026-01-15_