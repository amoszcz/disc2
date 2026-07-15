# Contract: Battle Targeting State

## Purpose

Define the interaction-state contract for acting-unit selection, legal-target calculation, strike readiness, and defend usage in battle.

## Acting Unit Contract

An active battle turn must provide:

- The acting unit identity
- The acting unit side
- The acting unit attack category
- Whether the acting unit is player-controlled or system-driven
- Whether the acting unit has already spent its turn

## Target Selection Guarantees

- A player-controlled strike action must not resolve until the acting unit has a legal target when its attack category requires one.
- Selecting a different legal enemy target must replace the previous selection.
- Defeated units must never remain legal targets.
- Area-of-effect actions may resolve without a single selected target only if they are defined to hit all living enemies.

## Target Legality Guarantees

- Melee legality must be computed from the nearest occupied opposing column, with fallback to the next column only when the nearer one is empty.
- Ranged legality must include all living enemy units.
- Area-of-effect legality must include all living enemy units as the action’s coverage set.
- If no legal strike target exists, the state must communicate that strike is unavailable or ineffective.

## Defend Guarantees

- Defend must spend the acting unit’s turn without applying outgoing damage.
- Defend must apply half incoming damage until the defended unit’s next turn begins.
- Defend mitigation must expire before the defended unit chooses its next action.
