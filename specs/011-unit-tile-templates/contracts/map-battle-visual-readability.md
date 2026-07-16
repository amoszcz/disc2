# Contract: Map And Battle Visual Readability

## Purpose

Define the player-visible contract for introducing dedicated visual templates without harming the readability of current map and battle scenes.

## Map Readability Contract

- Terrain tiles must remain distinguishable from one another during ordinary map navigation.
- Movement objects and guarded-location markers must remain visually separable from the terrain beneath them.
- Hero and pickup visibility must remain readable after dedicated tile visuals are introduced.
- A player should still be able to read the broad structure of roads, difficult terrain, and blocked terrain during normal map play.

## Battle Readability Contract

- Units on both sides must remain visually distinguishable inside the current fixed battle slots.
- Active-unit, target-selection, legal-target, and defend-state feedback must remain readable when dedicated unit visuals replace flat placeholder cards.
- Unit role differences should remain understandable even when the first dedicated art pass is still relatively simple.

## Fallback Readability Contract

- A scene containing both dedicated templates and fallback placeholders must still read as intentional and playable.
- Fallback visuals must remain obviously visible and must not blend into the background more than the current placeholder system does.
- Missing dedicated templates must degrade gracefully rather than producing empty, broken, or ambiguous scene elements.
- When a dedicated asset loads after an initial fallback draw, the refreshed scene should remain readable and should not lose player-facing state cues such as selection, guarding, or battle-target markers.

## Acceptance Signals

- A player can still identify units, terrain, and supported objects without depending only on overlay text.
- A tester can compare a mixed dedicated/fallback scene and still understand what every currently supported visual subject represents.
