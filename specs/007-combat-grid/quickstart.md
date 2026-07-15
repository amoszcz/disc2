# Quickstart: Grid Combat Tactics

## Goal

Run the browser game, enter a battle, verify formation-based target selection, confirm different attack-category behaviors, and validate the defend action.

## Setup

1. Install project dependencies:

```powershell
npm install
```

2. Install the Playwright Chromium browser used by acceptance tests:

```powershell
npx playwright install chromium
```

3. Start the local development server:

```powershell
npm run dev
```

4. Open the local browser URL shown by the dev server:

```text
/
```

## Expected Playable Flow

1. Move the starting hero into a guarded location to trigger battle.
2. Confirm the battle scene shows both sides on a 3x4 formation layout.
3. Wait for a player-controlled unit to become active and confirm legal enemy targets are visually clear.
4. Select one legal enemy target and press strike.
5. Confirm the selected target takes damage according to the active unit’s attack category.
6. Repeat with a melee unit and verify only the nearest legal enemy column can be targeted unless that column is empty.
7. Repeat with a ranged unit and verify any living enemy can be targeted.
8. Repeat with an area-of-effect unit and verify one strike damages all living enemies.
9. On a later player-controlled turn, choose defend instead of strike.
10. Confirm the defended unit takes half damage until its next turn begins, then loses the defend state before acting again.

## Test Commands

Run the combat-focused contract and integration coverage:

```powershell
npm run test:combat
```

Run the full combat verification flow, including browser acceptance coverage:

```powershell
npm run verify:combat
```

## Notes

- This first slice keeps units in fixed battle slots for the full encounter.
- Non-player-controlled turns still resolve automatically, but must obey the same strike and defend legality model.
- The feature changes tactical combat interaction, not the map-to-battle encounter trigger.
