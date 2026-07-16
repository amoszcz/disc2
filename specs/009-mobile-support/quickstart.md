# Quickstart: Mobile Browser Support

## Goal

Run the browser game, verify that it is usable in a mobile-sized browser viewport, complete core gameplay actions with touch-capable controls including two-finger map zoom, and confirm the session remains playable across viewport changes and return-to-menu flow.

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
3. Confirm the map view and primary action controls remain readable and reachable on the narrow viewport.
4. Use a two-finger gesture on the map to zoom in and back out, and confirm the page itself does not zoom while the map view changes.
5. Select a hero, plot a route, and complete an end-turn action using touch-capable interactions only.
6. Trigger a guard encounter and complete at least one battle action using touch-capable controls only.
7. Change the viewport size or orientation during play and confirm the active session remains usable.
8. Finish a scenario through its normal victory path.
9. Confirm the completion state exposes a mobile-usable return-to-menu action.
10. Return to the menu and start another fresh scenario run on the same mobile-sized viewport.

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
- The most important validation is that the game remains playable end-to-end on a phone-sized viewport without mouse or keyboard input, including direct two-finger zoom on the map surface.
