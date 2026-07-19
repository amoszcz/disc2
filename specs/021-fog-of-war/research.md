# Research: Configurable Fog of War

## Decision 1: Separate current visibility from exploration memory

- **Decision**: Calculate tiles currently visible to active-player heroes independently from tiles seen earlier in the current scenario session.
- **Rationale**: A tile must be fully visible, visited-fogged, or unexplored-fogged based on two distinct facts; combining them would lose the required 50% visited state.
- **Alternatives considered**:
  - Store only a current visibility mask: rejected because leaving vision would make tiles indistinguishable from never-seen tiles.
  - Reveal terrain permanently: rejected because it would not provide visited fog.

## Decision 2: Use an eight-directional square-grid visibility radius

- **Decision**: A hero reveals tiles whose horizontal and vertical offsets are each no greater than the selected radius.
- **Rationale**: This matches existing eight-directional map movement and the specification assumption for six tiles.
- **Alternatives considered**:
  - Euclidean circle: rejected because diagonal boundary behavior would differ from map movement expectations.
  - Line of sight: rejected as explicitly out of scope.

## Decision 3: Render fog after terrain but before map interaction feedback

- **Decision**: Render terrain for all map tiles, suppress objects on unexplored tiles, then render fog overlays in world-tile coordinates before route and selection feedback.
- **Rationale**: This preserves terrain readability, hides unexplored content, and keeps actionable feedback usable.
- **Alternatives considered**:
  - One opaque overlay over all map visuals: rejected because unexplored terrain must stay visible.
  - Fog only in the HUD: rejected because it would not align with panning and zooming world tiles.

## Decision 4: Reuse game settings for player fog preferences

- **Decision**: Add enabled state and visibility radius to the existing settings experience, with six tiles and enabled fog as defaults.
- **Rationale**: Players already use Settings for persistent display preferences; reusing it avoids a parallel control path.
- **Alternatives considered**:
  - Per-scenario controls: rejected because the requirement is a player preference.
  - A map-only toggle: rejected because it is less discoverable and duplicates preference handling.

## Decision 5: Keep fog information-only

- **Decision**: Do not alter hit testing, route legality, movement, battle triggers, or victory evaluation when a tile is fogged.
- **Rationale**: Fog changes what players can see, not what the game rules permit.
- **Alternatives considered**:
  - Make unexplored tiles unclickable: rejected because it would change existing route and control behavior beyond the feature scope.
