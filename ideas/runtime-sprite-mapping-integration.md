# Runtime Sprite Mapping Integration

The Sprite Mapping Tool can correct `x`, `y`, `width`, and `height` for entries in its WIP atlas JSON, but those saved values do not currently control gameplay rendering.

Current runtime object templates use manually defined sprite-frame values in `src/render/sprites/visualTemplateCatalog.ts` and point to `generated-asset-sheet.png`. The mapping editor uses a separate WIP atlas and JSON map.

## Follow-up idea

Make the saved mapping JSON the source for runtime object-template crop frames.

Required integration:

1. Map each JSON entry identity (subject, state, direction/context) to the relevant runtime visual template.
2. Serve or bundle the same atlas image used by the mapping tool for gameplay.
3. Translate saved `x`, `y`, `width`, and `height` to runtime `sourceX`, `sourceY`, `sourceWidth`, and `sourceHeight` values.

Once this integration exists, editing a crop's width or height in the mapping tool will directly change the sprite crop displayed in the game.
