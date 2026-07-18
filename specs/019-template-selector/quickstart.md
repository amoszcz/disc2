# Quickstart: Validate Visual Template Selection

## Prerequisites

- Run from the repository root with project dependencies installed.
- Provide the current and WIP templates as valid same-base-name PNG/JSON pairs in the single configured template catalog.
- Set the game configuration's default template identifier to one ready catalog entry.
- Use the local development server for mapper persistence checks; production and preview are read-only.

## Automated validation

Run the focused feature tests after they are added, then build the app:

```bash
npm run test:template-selector
npm run build
```

Expected outcomes:

- The single catalog lists every ready same-name PNG/JSON source once, and the game configuration initializes new sessions with its declared default.
- Changing the active template updates the shared rendering catalog while retaining game progress and storybook selections.
- Game and storybook state previews use the same selected source and fall back visibly when a state is absent.
- Mapper load, gallery, validation, download, and save actions are scoped to the selected source; a save never changes a different map.
- Dirty mapper changes require confirmation before changing source.

## Manual validation

1. Run `npm run dev`; open a scenario and confirm the gameplay dropdown initially shows the configured default template. Select each available source and confirm the game remains in the same scenario while visual objects update.
2. Open the asset storybook. Confirm its dropdown reports the same active source, then switch source and change a subject state. Confirm the preview updates through the chosen source and remains visible when a state has no entry.
3. Open the sprite mapper and choose each source. Confirm image dimensions, gallery entries, selected crop, and labels all belong to the selected pair.
4. Make an unsaved mapper change, choose another source, cancel the warning, and verify the current source and edit remain. Repeat and confirm to switch; verify the new source has no inherited pending changes.
5. Make a valid mapper change for one source and save. Reopen the other source and verify its coordinate map did not change.

See [template-selection.md](contracts/template-selection.md) for the UI and mapper boundary, and [data-model.md](data-model.md) for state and validation rules.
