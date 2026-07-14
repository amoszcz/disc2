# Quickstart: Pathfinding Route Preview

## Goal

Run the browser game, plot a route for a hero with one click, confirm movement with a second click, clear a route by clicking the hero, and verify end-turn auto-advance plus cross-turn continuation.

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
5. Click the hero that owns the plotted route and confirm the active route is cleared without moving the hero.
6. Plot a long route again, end the turn, and confirm the hero auto-advances as far as possible along that route.
7. Confirm any unfinished route remains visible after the auto-advance.
8. Return to the player's turn, click the same destination again, and confirm the hero continues toward it.
9. Click a different destination while a route is active and confirm the previous route is replaced by a newly plotted one.

## Test Commands

Run the pathfinding-focused contracts and integration coverage:

```powershell
npm run test:pathfinding
```

Run the full pathfinding verification flow, including browser acceptance coverage:

```powershell
npm run verify:pathfinding
```

## Notes

- The first slice focuses on one selected hero at a time.
- Routefinding should respect the same legal-movement and movement-cost rules used by real hero movement.
- Route persistence across turns is limited to the current scenario session.
- End-turn movement may automatically continue an active route for its owning hero until legal movement runs out or the route is interrupted.
