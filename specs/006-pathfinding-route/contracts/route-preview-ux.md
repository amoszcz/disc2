# Contract: Route Preview UX

## Purpose

Define the player-visible contract for plotted route readability and click behavior.

## Map Presentation Contract

- A successful route preview must appear as a visible dotted path from the selected hero toward the chosen destination.
- The destination of the previewed route must be visually distinguished from intermediate steps.
- An unfinished route that remains active across turns must continue to be visible until completed, cleared, replaced, or invalidated.

## Interaction Feedback Contract

- The first destination click must be understandable as a preview action rather than immediate movement.
- The second click on the same active destination must be understandable as movement confirmation.
- Clicking the hero that owns the active route must be understandable as route cancellation.
- If a hero cannot finish the whole route this turn, the game must make it understandable that only part of the route will be traversed now.
- If end turn advances the hero automatically, the game must make it understandable that the route progressed because of end-turn behavior.
- If no legal route exists, the game must communicate that the destination cannot currently be reached.

## Acceptance Signals

- A player can distinguish a plotted route from normal terrain, object, and hero rendering.
- A player can tell which destination is currently armed for confirmation.
- A player can tell whether the next click will continue the same journey, clear it, or replace it with a new route.
