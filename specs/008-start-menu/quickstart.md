# Quickstart: Start Menu Scenario Selection

## Goal

Run the browser game, verify that it opens on a main menu, start each available scenario from that menu, finish a scenario, and confirm that the player can return to the menu and start a fresh run.

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

1. Open the app and confirm the first visible screen is a main menu rather than the map.
2. Confirm the main menu presents at least the currently available scenarios as separate start options.
3. Start the `Border Watch` scenario and confirm the game enters its normal map flow.
4. Reload the app, start the `Broken Causeway` scenario, and confirm the correct scenario map and HUD load.
5. Finish one scenario through its normal victory path.
6. Confirm the completion screen offers a return-to-menu action.
7. Use that action and confirm the main menu reappears.
8. Start a scenario again from the menu and confirm the new run begins from its initial state.

## Test Commands

Run the menu-focused contract and integration coverage:

```bash
npm run test:menu
```

Run the feature-specific browser verification flow:

```bash
npm run verify:menu
```

## Notes

- The main menu is a session-entry flow, not a save/load system.
- Returning to the main menu discards the completed in-memory scenario session.
- Existing map, battle, and victory behavior should remain unchanged once a scenario has started.
