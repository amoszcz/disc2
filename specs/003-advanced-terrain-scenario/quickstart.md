# Quickstart: Advanced Terrain Scenario

## Goal

Run the terrain-enhanced scenario, verify movement over a 64x64 map with region-defined terrain, and validate blocked rivers or lakes plus terrain readability.

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

4. Open `http://127.0.0.1:4173/?scenario=advanced-terrain-scenario` in the browser.

## Expected Playable Flow

1. Start the advanced terrain scenario with a 64x64 map.
2. Move the hero along a road and confirm the move spends only 1 movement.
3. Move onto grass or plains and confirm the move spends 2 movement.
4. Move onto mud or woods and confirm the move spends 3 movement.
5. Attempt a diagonal move and confirm it uses the destination tile's normal terrain cost.
6. Attempt to move into mountains, rivers, or lakes and confirm the move is rejected without spending movement.
7. Confirm the map presentation clearly distinguishes road, standard, difficult, and blocked terrain.

## Test Commands

Run terrain contracts and engine integration coverage:

```powershell
npm run test:terrain
```

Run browser acceptance coverage:

```powershell
npx playwright test tests/acceptance/advanced-terrain-movement.spec.ts tests/acceptance/blocked-terrain-boundaries.spec.ts tests/acceptance/terrain-readability.spec.ts
```

Run the full verification flow:

```powershell
npm run verify:terrain
```

## Notes

- This feature extends the current browser game rather than creating a separate terrain simulator.
- Roads do not create implicit crossings over rivers or lakes in this slice.
- Bridges, boats, and other traversal exceptions remain deferred.
- The original core scenario remains available at `http://127.0.0.1:4173/` and keeps its legacy movement rules for regression safety.
