# Contract: Battle Formation UX

## Purpose

Define the player-visible contract for formation readability, target selection, and action controls during battle.

## Formation Presentation Contract

- The battle scene must present both sides on a readable 3x4 formation grid.
- Empty slots must read as empty positions rather than as hidden or defeated units.
- The acting unit must be visually distinguishable from non-acting units.

## Targeting Feedback Contract

- When a player-controlled unit is active, legal enemy targets must be visually understandable.
- The currently selected enemy target must be visually distinct from merely legal targets.
- Single-target units must communicate that the player should click a highlighted enemy before strike becomes available.
- If a unit has no legal strike target, the player must be told that strike is unavailable or ineffective.

## Action Feedback Contract

- Strike and defend must be visible as separate actions during a player-controlled unit's turn.
- After defend is chosen, the unit must read as protected until its next turn begins.
- When an area-of-effect action resolves, the player must be able to tell that multiple enemies were hit by one action.
- Non-player turns should advance automatically once the previous action resolves so the player returns to the next controllable turn state.

## Acceptance Signals

- A player can identify the acting unit, legal targets, selected target, and available actions without reading logs alone.
- A player can distinguish melee reach limitations from ranged reach freedom.
- A player can tell when a unit is under defend protection and when that protection has expired.
