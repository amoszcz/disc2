# UI Contract: Strategy Decision Clarity

## Map

- A route preview identifies hero, destination, cost, remaining movement, known effects, and confirmation status.
- A visible control or equivalent direct action cancels an uncommitted route without cost.
- Invalid destinations and traversal-blocked end turns expose their reason in map context.
- End turn identifies known pending route, encounter, or turn-change consequence before activation.

## Battle

- Strike and defend expose availability and a specific blocking reason when unavailable.
- The selected target and action effect are shown before strike commitment.
- A target can be replaced or cleared before strike without changing battle state.

## Cross-device

- Essential decision and availability information is visible without hover.
- Keyboard focus and touch activation expose the same action and recovery paths.
- Primary controls remain named, visible, and non-overlapping on supported mobile layouts.

## Retained Rule Boundaries

- Cancelling a route or clearing a battle target only clears uncommitted player input; it never restores movement, resources, turns, or resolved combat state.
- Replacing a route continues to use existing route validation and movement-cost rules.
- Battle availability remains governed by the active unit, legal target set, and transition state.
- End turn retains its existing traversal and route-advance rules; the UI explains those outcomes without changing them.
