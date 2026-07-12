# Quickstart: Map Zoom and Panning

## Goal

Run the browser game, open a large scenario, and verify panning, zooming, cursor-focused scaling, and preserved map interaction after navigation.

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

1. Start the advanced terrain scenario and confirm the map loads inside the standard game canvas.
2. Hold the middle mouse button and drag to pan away from the starting hero.
3. Continue panning toward each map edge and confirm the viewport stops at the scenario boundary.
4. Hover a visible terrain feature and use the mouse wheel to zoom in, confirming the pointed-at area stays visually stable.
5. Use the mouse wheel to zoom back out and confirm a larger portion of the map becomes visible.
6. After zooming or panning, left-click the visible hero or a visible destination tile and confirm the intended tile is selected.
7. Trigger a scene transition if available, return to the adventure map, and confirm the prior zoom and pan state is restored.

## Test Commands

Run viewport contracts and engine integration coverage:

```powershell
npm run test:viewport
```

Run browser acceptance coverage:

```powershell
npx playwright test tests/acceptance/map-pan-navigation.spec.ts tests/acceptance/map-zoom-navigation.spec.ts tests/acceptance/map-view-interaction.spec.ts
```

Run the full viewport verification flow:

```powershell
npm run verify:viewport
```

## Notes

- This feature extends the existing browser game rather than creating a separate navigation sandbox.
- The primary inputs for this slice are mouse-wheel zoom and middle-mouse drag panning.
- Navigation behavior applies only to the adventure map scene in this slice.
- The preserved view state only needs to survive within the current play session, not across page reloads.
- The advanced terrain scenario is the best manual validation target because its default zoomed map requires both panning and post-navigation interaction.
