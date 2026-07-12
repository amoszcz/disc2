# Contract: Gameplay UI

## Purpose

Define the user-visible interaction contract for the first playable browser slice.

## World Map View

### Display Contract

- The view shows a map grid or equivalent traversable playfield.
- The view shows the active hero position.
- The view shows visible resource pickups and guarded locations.
- The view shows the current side, remaining movement for the selected hero, and the player's resource totals.

### Interaction Contract

- Selecting the player's hero marks it as the active actor.
- Choosing a legal destination within remaining movement moves the hero there.
- Choosing an illegal destination leaves the hero in place and surfaces that the move is not allowed.
- Entering a pickup tile immediately updates the visible resource total and removes the pickup from view.
- Activating the end-turn control advances the game to the next side and refreshes turn-scoped values.

## Guarded Location Contract

### Pre-Battle

- A guarded location must visually indicate that access is blocked.
- Attempting to enter a blocked location must open the battle flow instead of granting access immediately.

### Post-Battle

- If the player wins, the guarded location must update to an accessible state before normal map control resumes.
- If the player loses, the location must remain blocked and the hero force state must reflect battle losses.

## Battle View

### Display Contract

- The battle view shows both forces participating in the encounter.
- The battle view shows a visible turn queue ordered by agility.
- The battle view indicates the currently active unit.

### Interaction Contract

- On a unit's turn, the player can choose exactly one legal action.
- After the chosen action resolves, the same unit cannot act again until it receives another turn.
- When one side has no remaining battle-capable units, the battle view exits and returns the outcome to scenario play.

## Victory Contract

- When the default elimination condition is met, the game must immediately present a victory state without requiring an extra manual action from the player.
