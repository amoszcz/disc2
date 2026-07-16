# Quickstart: Submap Transitions

## Goal

Run the browser game, verify that a scenario can enter a linked submap from a main-map trigger, return through a defined exit point, and preserve session continuity across repeated travel.

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

1. Open a scenario that contains at least one linked submap entry trigger on the main map.
2. Move a player-controlled hero to the configured cave, teleport, or equivalent entry trigger.
3. Confirm the game transitions into the linked submap without restarting the scenario session.
4. Confirm the hero appears at the configured arrival point and normal map play remains available there.
5. Move to a defined submap exit point and trigger the return transition.
6. Confirm the hero returns to the configured location on the parent map and can continue normal play immediately.
7. Repeat at least one entry-and-exit cycle and confirm previously changed state remains consistent across travel.
8. Validate that an invalid or unavailable link fails safely without breaking the current session.

## Test Commands

Run the linked-map contract and integration coverage:

```bash
npm run test:submaps
```

Run the browser verification flow for linked-map travel once acceptance coverage exists:

```bash
npm run verify:submaps
```

## Notes

- Submaps are part of one scenario session rather than separate scenario loads.
- The most important validation is that entering and leaving linked maps preserves scenario continuity and rule behavior.
- The first slice is about reliable connected travel, not procedural generation or a general scripting engine.
