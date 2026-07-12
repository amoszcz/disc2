# Contract: Map Navigation Input

## Purpose

Define the player-input contract for zooming and panning the adventure map.

## Input Contract

- Mouse wheel is the primary input for increasing and decreasing map zoom.
- Middle-mouse-button drag is the primary input for panning the map viewport.
- Navigation inputs apply only while the adventure map scene is active.
- Navigation inputs must not trigger unintended hero selection, movement, or other map actions.

## Zoom Interaction Contract

- Zooming should use the cursor position as its anchor.
- The map area under the cursor should remain as stable as possible while zooming.
- Zooming must stop at the supported minimum and maximum zoom levels.

## Pan Interaction Contract

- Panning must shift the viewport in the same directional sense as the user’s drag gesture.
- Panning must stop at map boundaries rather than showing empty non-map space.
- Releasing the middle mouse button must end the pan gesture cleanly.

## Acceptance Signals

- A player can pan to distant visible areas without accidental clicks.
- A player can zoom toward a hovered area without losing their place on the map.
- Navigation input remains separate from normal left-click interaction.
