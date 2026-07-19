# Data Model: Configurable Fog of War

## Fog Settings

| Field | Values | Rules |
|---|---|---|
| `isEnabled` | enabled or disabled | Defaults to enabled; disabled renders no fog and exposes all normal map content. |
| `visibilityRadius` | positive whole-number tile radius | Defaults to 6; applies to each active-player available hero. |

## Fog Tile State

| State | Definition | Presentation |
|---|---|---|
| Fully visible | Currently inside at least one active-player hero visibility range | Terrain and normal map content visible; no fog. |
| Visited fog | Seen earlier in this scenario session but not currently visible | 50% fog overlay. |
| Unexplored fog | Never visible in this scenario session | Terrain only, objects concealed, 15% fog overlay. |

## Exploration Memory

| Field | Description |
|---|---|
| `visitedTilesByMapId` | Set of world-tile coordinates seen at least once, keyed by scenario map identifier. |
| `currentVisibleTiles` | Derived set for the active map; not persisted as a preference. |

**Validation rules**:

- A coordinate is valid only within its map bounds.
- Current visibility is the union of all active-player available heroes on the active map.
- Newly current-visible tiles are immediately added to that map's visited set.
- Starting a fresh scenario resets exploration memory; map travel within that session does not.
- Disabled fog bypasses presentation state but does not discard current-session exploration memory.

## State Transitions

```text
unexplored ── hero vision ──> fully visible
fully visible ── leaves vision ──> visited fog
visited fog ── hero vision ──> fully visible
fog disabled ──> all content visible (memory retained)
```

## Relationships

```text
Fog Settings ── controls ──> Fog Tile State presentation
Active-player heroes ── derive ──> Current Visibility Area
Current Visibility Area ── adds to ──> Exploration Memory
Exploration Memory + Current Visibility ── resolve ──> Fog Tile State
```
