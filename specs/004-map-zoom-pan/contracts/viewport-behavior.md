# Contract: Viewport Behavior

## Purpose

Define the player-visible contract for map viewport rendering, restoration, and interaction accuracy.

## Viewport Rendering Contract

- The adventure map must render only the visible portion implied by the current zoom and pan state.
- Map tiles, heroes, pickups, and guarded locations must remain visually aligned to their true map positions after viewport adjustments.
- Small scenarios must remain readable and should not collapse into a mostly empty canvas presentation when zoom changes occur.

## Interaction Accuracy Contract

- Clicking a visible hero after zooming or panning must select that exact hero.
- Clicking a visible destination after zooming or panning must target the tile shown under the pointer.
- The same visible tile must resolve to the same game-world location in both rendering and input handling.

## Scene Restoration Contract

- Leaving the adventure map and returning in the same play session must restore the prior zoom level and pan position.
- Restored view state must remain valid for the current map bounds and continue to support accurate interaction.

## Acceptance Signals

- A player can pan and zoom, then still act on the expected visible tile.
- A player does not see off-map space at viewport edges.
- A player returns from another scene to the same map view they left.
