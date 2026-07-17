# Contract: Touch Session Controls

## Purpose

Define the touch-capable interaction contract for mobile gameplay sessions.

## Touch Input Contract

- Every action required to start, play, complete, and replay a scenario must be possible through touch-capable controls.
- Required interactions must not depend on hover-only feedback, mouse wheel input, or middle mouse button input.
- Tap interactions must resolve cleanly to one gameplay action at a time, while drag interactions must pan the map without accidentally confirming a move.
- Touch input must map cleanly to the existing gameplay flow rather than introducing a separate ruleset.

## Map Interaction Contract

- A player must be able to tap heroes, tap map tiles, and progress route selection from a mobile browser.
- A fresh scenario start must frame the selected starting hero in the initial map view before the player performs any map interaction.
- A player must be able to navigate the map view on mobile when the default visible area is insufficient.
- Mobile map navigation must allow a two-finger gesture on the play surface to zoom the map in and out during active play.
- Mobile map navigation may combine drag-to-pan with explicit zoom buttons, but route selection, pan gestures, and two-finger zoom gestures must remain distinguishable.
- Touch navigation must not corrupt selection, route, or turn state while the player is interacting with the map.
- When two routes differ only by diagonal versus orthogonal steps across equivalent terrain, the diagonal-heavy route must report a longer distance or movement cost.
- A two-finger zoom gesture performed on the play surface must update the in-game map zoom instead of the browser page zoom.
- Reaching the minimum or maximum allowed zoom in one scenario must produce the same tile-size endpoints as reaching those bounds in Border Watch.

## Battle Interaction Contract

- A player must be able to select battle targets and trigger battle actions through touch-capable controls.
- Touch targeting must continue to work after the battle canvas is resized for a different mobile viewport.
- Battle action availability and target-selection feedback must remain understandable on a small screen.
- Completing a battle on mobile must return the player to the normal post-battle scene flow.

## Session Continuity Contract

- Viewport changes during a mobile session must preserve current scenario progress.
- Returning to the main menu after completion on mobile must dispose of the finished session and allow a fresh replay.
- Starting a new scenario from the menu must retain the current mobile layout state instead of reverting to a desktop-only shell.
- Starting a scenario again after a mobile return-to-menu flow must create a clean new session state.
- Entering a different scenario after using map zoom in Border Watch must preserve the shared zoom-bound rules rather than recalculating larger or smaller endpoint tile sizes from map dimensions alone.
