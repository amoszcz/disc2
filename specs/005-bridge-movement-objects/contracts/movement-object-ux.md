# Contract: Movement Object UX

## Purpose

Define the player-visible contract for movement-object readability and route explanation.

## Map Presentation Contract

- Bridge, milestone, and rubble objects must be visually distinguishable from the base terrain beneath them.
- Overlapping or adjacent object regions must still produce understandable tile outcomes.
- Bridged river crossings must read as intentionally legal crossings without implying that nearby unbridged water is also passable.

## Movement Feedback Contract

- Legal movement must explain when a bridge made a river crossing possible.
- Movement feedback must explain when milestone or rubble changed the final movement cost.
- When more than one movement object affects a tile, the feedback must communicate the combined result clearly enough to avoid guesswork.

## Acceptance Signals

- A player can tell which water tiles are bridged and which remain blocked.
- A player can distinguish cheaper, more expensive, and newly traversable routes caused by movement objects.
- A player can understand why a stacked movement-object tile produced its final route cost or passability.
