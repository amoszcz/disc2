# Contract: Cross-Surface Visual Template Selection

## Template Catalog Contract

- The Template Catalog is the only source list used by gameplay, storybook, mapper, and game configuration.
- Game configuration declares `defaultTemplateId`, which must reference a ready catalog source.
- A new session initializes its active source from the configured default. No screen chooses its own default or relies on catalog order.

## Source Discovery Contract

- A selectable source consists of exactly one PNG image and one JSON coordinate map with the same base filename in a configured template asset location.
- Each ready pair has one stable catalog identifier and one readable label.
- A missing mate, unreadable PNG, unreadable JSON, malformed map, or duplicate identifier is reported as a diagnostic and is not selectable.
- The current template and WIP template are both returned when they meet the pair contract.
- The client receives only registered identifiers and URLs; it never sends filesystem paths.

## Active Selection Contract

- Gameplay, storybook, and mapper each show a dropdown containing every ready source once and identifying the same active source.
- A successful choice updates the session-wide active template without restarting the application or changing game progress.
- If a requested source fails to load, the application reports the failure and keeps the prior usable template or existing fallback rendering visible.
- Missing subject/state entries in an otherwise ready source resolve through the established fallback path.

## Rendering Contract

- Map and battle rendering resolve the active source image and its map coordinates through the existing shared visual-resolution seam.
- Storybook preview tiles and state changes use that identical active-source resolution seam.
- Changing source changes only visual-template inputs; scenario rules, battle progress, selected storybook state where still valid, and viewport state remain unchanged.

## Mapper Contract

- Loading the mapper for a template requests the registered template identifier and returns only that pair's image and coordinate map.
- Mapper gallery, preview, validation, export, and save operations are scoped to its `loadedTemplateId`.
- A save request includes the registered identifier and resolved mapping changes. The local development boundary validates that identifier, validates all resulting crop rectangles against its paired PNG, and writes only that selected JSON map.
- A dirty mapper session warns before a template change. Cancel keeps the current selected/loaded template and pending changes; confirm discards only the current template's pending changes before loading the requested source.
- Production/preview behavior remains read-only and does not expose a write route.
