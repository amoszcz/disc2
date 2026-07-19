# UI Contract: Fog of War

## Map Presentation

| Situation | Required observable behavior |
|---|---|
| Current hero visibility | Terrain and map content are fully visible without fog. |
| Never-visible tile | Terrain remains readable; map objects, resources, guarded locations, and concealed units are not shown; a 15% unexplored fog overlay is visible. |
| Previously visible tile outside current range | A 50% visited-fog overlay is visible. |
| Fog disabled | No fog overlay is drawn and all normal map content is visible. |
| Pan, zoom, resize, or orientation change | Fog stays registered to the same world tiles. |
| Map travel and return | The returned map restores its current-session visited-fog state. |

## Settings Presentation

| Element / behavior | Contract |
|---|---|
| Fog enabled control | Identifies whether fog is enabled and allows the player to disable or enable it. |
| Visibility-radius control | Displays the selected radius and allows the player to choose a supported positive whole-tile radius. |
| Default | A new setting uses enabled fog with a six-tile radius. |
| Immediate update | A changed fog preference is reflected on the active map without resetting the scenario. |

Suggested stable test identifiers:

```text
fog-of-war-enabled-control
fog-visibility-radius-control
fog-of-war-status
```

## Compatibility Requirements

- Fog does not alter existing map input, route legality, movement, battle, map travel, or victory behavior.
- Route previews, selected-hero indicators, and other player-facing interaction feedback remain visible above fog.
- Terrain remains visible on unexplored tiles while map content is concealed.
