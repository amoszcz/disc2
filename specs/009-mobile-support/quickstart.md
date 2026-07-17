# Quickstart: Mobile Browser Support

## Goal

Run the browser game, verify that it is usable in a mobile-sized browser viewport, confirm that each scenario starts centered on the initial hero, complete core gameplay actions with touch-capable controls including two-finger map zoom, confirm that min/max zoom tile sizes stay aligned with Border Watch across scenarios, verify diagonal movement is priced longer than orthogonal movement, and confirm the session remains playable across viewport changes and return-to-menu flow.

## Setup

1. Install project dependencies:

```bash
npm install
```

2. Install the Playwright Chromium browser used by acceptance tests:

```bash
npx playwright install chromium
```

3. Install the Linux system dependencies required by Playwright when running in a fresh container:

```bash
npx playwright install-deps chromium
```

4. Start the local development server:

```bash
npm run dev
```

5. Open the local browser URL shown by the dev server.

## Expected Playable Flow

1. Open the app in a phone-sized browser viewport and confirm the main menu is visible without horizontal scrolling.
2. Start the `Border Watch` scenario using touch-capable controls only.
3. Confirm the initial map view is centered on the starting hero as closely as map bounds allow.
4. Confirm the map view and primary action controls remain readable and reachable on the narrow viewport.
5. Use a two-finger gesture on the map to zoom in and back out, and confirm the page itself does not zoom while the map view changes.
6. Note the apparent tile size at the minimum and maximum allowed zoom in `Border Watch`.
7. Return to the menu or start another available scenario on the same viewport, then confirm the minimum and maximum allowed zoom render the same endpoint tile sizes as `Border Watch`.
8. Confirm the second scenario also opens with its starting hero centered in the initial view.
9. Select a hero and compare a mostly orthogonal route with a diagonal-heavy alternative across equivalent terrain, then confirm the diagonal-heavy route reports a longer distance or movement cost.
10. Plot a route and complete an end-turn action using touch-capable interactions only.
11. Trigger a guard encounter and complete at least one battle action using touch-capable controls only.
12. Change the viewport size or orientation during play and confirm the active session remains usable.
13. Finish a scenario through its normal victory path.
14. Confirm the completion state exposes a mobile-usable return-to-menu action.
15. Return to the menu and start another fresh scenario run on the same mobile-sized viewport.

## Test Commands

Run the mobile-focused contract and integration coverage:

```bash
npm run test:mobile
```

Run the browser verification flow, including mobile-sized acceptance scenarios:

```bash
npm run verify:mobile
```

## Notes

- This feature keeps the existing game rules and scenario content unchanged.
- Mobile support is browser-based and does not include native app packaging.
- The most important validation is that the game remains playable end-to-end on a phone-sized viewport without mouse or keyboard input, including initial hero-centered framing, direct two-finger zoom on the map surface, Border Watch-aligned zoom endpoints across scenarios, and diagonal route steps costing more than orthogonal steps.
