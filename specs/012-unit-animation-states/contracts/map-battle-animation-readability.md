# Contract: Map And Battle Animation Readability

## Purpose

Define the player-visible readability contract for introducing hero, battle-unit, and object animation states without harming the clarity of current gameplay.

## Map Animation Readability Contract

- A player should be able to tell whether the hero is standing, beginning movement, moving, stopping, interacting, getting hurt, or perishing.
- Directional hero motion should remain understandable for `up`, `down`, `left`, and `right` travel on the map.
- Direction changes during route following should not make the hero's state ambiguous.
- Animated or stateful map objects should remain readable above their terrain and should not hide interaction meaning.
- Route plotting should read as `start-move` before travel is confirmed, and route execution should read as `walk`, `stop-move`, or `interact` depending on the move result.
- Clicking a selected hero with an owned route preview should clear the preview and restore an idle-readable hero state.
- Active teleports, caves, and exits should remain visually distinct from idle-only bridge, rubble, and milestone objects.

## Battle Animation Readability Contract

- A player should be able to distinguish waiting, acting, defending, taking damage, winning, and perishing moments during battle.
- Action states should communicate the difference between direct attack, ranged attack, and spell-like or area action where the unit role requires it.
- Animated unit states must not obscure active-unit, target-selection, legal-target, or defend-state cues already used by the battle UI.
- Outcome states must remain readable even when the first animated art pass is still relatively simple.
- The active unit should resolve to `ready` at turn start, switch to `attack`, `shoot`, or `cast` when acting, and settle to `wait` when the queue advances.
- Targets that survive a strike should resolve to `hit`; defeated targets should resolve to `perish`.
- Defend should remain a separate readable state from waiting so the HUD and the sprite both reinforce the mitigation choice.

## Fallback Readability Contract

- A scene containing both dedicated animated states and fallback states must still read as intentional and playable.
- Missing dedicated states must degrade gracefully rather than producing blank, broken, or semantically misleading moments.
- Transitional states that are unavailable should fall back to a stable nearby meaning rather than disappearing mid-action.
- Incremental rollout must preserve readable hero, unit, and object moments even when the full state set is not yet complete.
- Placeholder-backed results should still emit diagnostics showing the originally requested state so test coverage can prove the fallback remained semantically correct.

## Acceptance Signals

- A player can watch current map and battle flows and correctly identify the broad gameplay meaning of major animation states.
- A tester can verify that fallback coverage still communicates idle, movement, attack, defend, victory, and perish moments for supported content.
