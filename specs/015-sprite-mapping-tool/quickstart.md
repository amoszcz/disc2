# Quickstart: Validate the Sprite Mapping Tool

## Prerequisites

- Run from the repository root with project dependencies installed.
- Ensure `wip/sprite-atlas/a_sprite_sheet_sheet_in_2d_digital_art_displays_fa.png` and `wip/sprite-atlas/game-atlas.json` are present.
- Use the local development server; Save is intentionally unavailable in preview/production mode.

## Automated validation

Run the focused feature tests when they are added, then build the app:

```bash
npm run test:sprite-mapping
npm run build
```

Expected outcomes:

- Atlas parsing and validation detect any declared-versus-actual dimension mismatch.
- Every mapping record is represented in the gallery or has a visible validation result.
- A shared pan changes every preview consistently and reset restores the loaded coordinates.
- A valid save updates only x/y for every entry, preserves all other JSON data, reloads the map, and clears the unsaved offset.
- Invalid adjusted entries prevent save.
- Downloading produces a JSON file with the current resolved mapping without saving or discarding pending changes.

## Manual developer workflow

1. Run `npm run dev` and open the Sprite Mapping page from the developer menu.
2. Confirm the page reports the PNG's actual dimensions and the JSON's declared dimensions.
3. Choose a recognizable gallery item and inspect its crop boundary in the alignment canvas.
4. Drag the source image until the fixed boundary surrounds the intended sprite. Confirm gallery previews update together and the displayed offset changes.
5. Use Reset once to confirm the original map is restored, then repeat the alignment.
6. Save a valid alignment and confirm the page reloads with a zero unsaved offset and the corrected coordinates. The current 1024 × 1536 fixture has entries touching all four edges, so every non-zero shared offset is correctly invalid; use a future atlas with spare bounds to exercise a non-zero save.

## Amended validation workflow

1. Select one entry, edit or drag its x/y values, and verify a second entry remains unchanged.
2. Change the selected width and height sliders and verify its boundary and preview update.
3. Zoom and pan the review view, then verify no crop values changed solely from view interaction.
4. Confirm an invalid x/y/width/height combination disables saving; correct it and save a valid mixed set when the fixture allows it.
5. Make a valid unsaved crop edit, choose Download mapping JSON, and verify the downloaded JSON includes that edit while it remains pending in the editor.
6. Block or deny clipboard access, then confirm Download mapping JSON remains available for a loaded mapping.
7. Try an offset that makes a crop invalid; confirm Save is disabled and affected entries are listed. Download the resolved JSON if it is needed for review, then confirm no persistence occurs.

See [sprite-mapping-tool.md](contracts/sprite-mapping-tool.md) for the page/save contract and [data-model.md](data-model.md) for state and validation details.
