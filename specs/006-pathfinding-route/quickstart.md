# Quickstart: Pathfinding Route Preview

## Goal

Run the browser game, plot a route for a hero with one click, confirm movement with a second click, and verify partial traversal plus cross-turn continuation.

## Setup

1. Install project dependencies:

```powershell
npm install
```

2. Install the Playwright Chromium browser used by the acceptance suite:

```powershell
npx playwright install chromium
```

3. Start the local development server:

```powershell
npm run dev
```

4. Open the local browser URL shown by the dev server with the advanced terrain scenario:

```text
/?scenario=advanced-terrain-scenario
```

## Expected Playable Flow

1. Select the player hero if it is not already selected.
2. Click a reachable distant tile once and confirm that a dotted route preview appears with a marked destination.
3. Click that same destination again and confirm the hero follows the plotted route instead of moving directly by one tile.
4. Plot a route that costs more movement than the hero has remaining and confirm the hero stops on the last affordable tile.
5. End the turn and confirm the unfinished route remains visible.
6. Return to the player's turn, click the same destination again, and confirm the hero continues toward it.
7. Click a different destination while a route is active and confirm the previous route is replaced by a newly plotted one.

## Test Commands

Run the pathfinding-focused contracts and integration coverage:

```powershell
npm test
```

Run browser acceptance coverage:

```powershell
npx playwright test
```

## Notes

- The first slice focuses on one selected hero at a time.
- Routefinding should respect the same legal-movement and movement-cost rules used by real hero movement.
- Route persistence across turns is limited to the current scenario session.
