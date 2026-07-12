# Quickstart: Bridges and Movement Objects

## Goal

Run the browser game, open a scenario with bridge, milestone, and rubble object regions, and verify bridged crossings, stacked movement modifiers, and player-facing object feedback.

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

4. Open the local browser URL shown by the dev server, using the scenario that includes movement-object regions.

## Expected Playable Flow

1. Load a scenario containing river tiles with at least one bridge region and one unbridged river section.
2. Attempt to move onto a bridged river tile and confirm the move is legal.
3. Attempt to move onto an unbridged river tile and confirm the move is still blocked.
4. Move onto a milestone-covered tile and confirm the final movement cost is reduced.
5. Move onto a rubble-covered tile and confirm the final movement cost is increased.
6. Move onto a tile covered by more than one movement-object region and confirm the combined effect matches the scenario design.
7. Confirm the map presentation and route feedback explain why a bridge, milestone, or rubble object changed passability or movement cost.

## Test Commands

Run movement-object contracts and engine integration coverage:

```powershell
npm test
```

Run browser acceptance coverage:

```powershell
npx playwright test
```

## Notes

- This feature extends the existing terrain-aware map engine rather than creating a separate object sandbox.
- Bridges and other movement-affecting objects are authored statically in scenario content for this slice.
- Invalid bridge regions should fail scenario validation rather than be ignored at runtime.
- The first slice focuses only on bridge, milestone, and rubble examples.
