# Research: Grid Combat Tactics

## Decision 1: Keep the existing turn queue and layer tactics on top of it

- **Decision**: Reuse the current queue-driven battle turn order instead of redesigning the battle lifecycle.
- **Rationale**: The feature request changes target choice, formation, and defend behavior, but does not require a different turn scheduler. Reusing the queue keeps scope tight and protects existing battle-entry flow.
- **Alternatives considered**:
  - Replace the queue with a new initiative system: rejected because it broadens scope beyond the requested combat improvements.
  - Let all units act freely each round: rejected because it conflicts with the existing one-unit-turn model.

## Decision 2: Represent battle formation as fixed slots on a 3x4 grid per side

- **Decision**: Model each side’s battle line as 3 rows and 4 ordered columns with units assigned to fixed slots for the duration of the battle.
- **Rationale**: The feature explicitly calls for a 3x4 grid and does not request movement between positions. Fixed slots simplify legal-target resolution and make rendering deterministic.
- **Alternatives considered**:
  - Free-position combat coordinates: rejected because they add unnecessary complexity and would complicate targeting rules.
  - Implicit front/back rows without explicit columns: rejected because the melee rules depend on column-by-column checks.

## Decision 3: Make target selection explicit state for player-controlled turns

- **Decision**: Track the acting unit, selected enemy target, and action availability as battle interaction state rather than resolving attacks immediately on button press.
- **Rationale**: The player must be able to click an enemy unit and then choose strike. That requires a stateful selection model visible in the UI.
- **Alternatives considered**:
  - Auto-target on strike as today: rejected because it removes the requested tactical choice.
  - Attack immediately on clicking a target: rejected because the requested interaction includes a separate strike action.

## Decision 4: Resolve melee reach by scanning the nearest occupied opposing column

- **Decision**: For melee units, legal targets come from the nearest opposing column that contains living enemies; if that column is empty, the next column becomes legal.
- **Rationale**: This directly encodes the requested “adjacent column or, if empty, the next column” rule while remaining deterministic.
- **Alternatives considered**:
  - Allow melee to hit only the exact mirrored slot: rejected because the request allows any enemy unit in the legal column.
  - Allow melee to hit any enemy in the front two columns at all times: rejected because it ignores the emptiness condition.

## Decision 5: Treat area-of-effect strike as one action that damages all living enemies

- **Decision**: Area-of-effect units spend their turn once and apply damage to every living enemy unit as part of that single action.
- **Rationale**: The request explicitly says area-of-effect attacks should hit all enemy units.
- **Alternatives considered**:
  - Require selecting one anchor target first: rejected because the request does not require a per-target anchor.
  - Split area damage into repeated single-target actions: rejected because it would violate the one-action-per-turn rule.

## Decision 6: Model defend as a temporary damage-mitigation state that expires on the unit’s next turn

- **Decision**: Defend sets a temporary status on the acting unit that halves incoming damage until the start of that same unit’s next turn.
- **Rationale**: This matches the requested behavior and keeps defend separate from permanent stat changes.
- **Alternatives considered**:
  - Reduce damage for a full round cycle regardless of turn order: rejected because the request anchors expiration to the unit’s next turn.
  - Let defend stack when chosen repeatedly: rejected because it creates runaway mitigation and is not requested.

## Decision 7: Keep non-player turns rule-driven but system-selected

- **Decision**: Non-player-controlled turns should obey the same targeting and defend legality rules, but the system can choose targets and actions automatically.
- **Rationale**: The feature improves player agency without requiring a manual UI for enemy turns.
- **Alternatives considered**:
  - Give enemies unrestricted target selection ignoring formation rules: rejected because it would make the rule system inconsistent.
  - Require the player to confirm enemy actions: rejected because it would interrupt battle flow unnecessarily.

## Decision 8: Render target selection and action readiness directly in the battle scene and HUD

- **Decision**: Show the active unit, selected target, legal target feedback, and strike/defend controls in battle UI rather than only in message logs.
- **Rationale**: The player needs visible state to understand whom they have selected and whether strike is currently legal.
- **Alternatives considered**:
  - Use text-only logs for selected target state: rejected because it is too easy to miss during tactical decision-making.
  - Hide legal-target feedback until strike fails: rejected because it creates trial-and-error interaction.
