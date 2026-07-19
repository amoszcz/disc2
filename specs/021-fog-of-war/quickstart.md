# Quickstart: Validate Configurable Fog of War

## Prerequisites

- Install project dependencies with `npm install`.
- Use a modern browser with local storage enabled for settings validation.

## Automated Validation

Run the focused fog contract and integration coverage after implementation:

```bash
npm run test:fog-of-war
npx playwright test tests/acceptance/fog-of-war.spec.ts
```

Then run existing map navigation and route validation to confirm fog remains information-only:

```bash
npm run test:viewport
npm run test:pathfinding
```

## Manual Scenario: Explore and Revisit

1. Start a scenario with fog enabled and the default six-tile radius.
2. Inspect a tile beyond hero range: terrain remains visible, but objects and locations are not shown under unexplored fog.
3. Move a hero until that tile becomes visible; confirm the tile's normal content appears.
4. Move away until the tile leaves current vision; confirm it has a 50% visited-fog overlay.
5. Pan, zoom, or resize the viewport and confirm fog remains aligned to the same world tiles.
6. Travel to another map and return; confirm visited tiles retain their visited-fog state.

## Manual Scenario: Settings

1. Open Settings and verify fog is enabled with a six-tile radius by default.
2. Change the visibility radius and confirm the fully visible boundary updates around active heroes.
3. Disable fog and confirm all terrain and map content are visible with no overlay.
4. Re-enable fog and confirm current-session exploration memory is retained.

See [data-model.md](data-model.md) for fog states and memory, and [fog-of-war-ui.md](contracts/fog-of-war-ui.md) for player-visible contracts.

## Validation Record

Validated on 2026-07-19:

- `npm run test:fog-of-war` — passed (9 tests).
- `npx vitest run tests/integration/render/fogOfWarRenderFlow.test.ts tests/integration/render/terrainTemplateFlow.test.ts tests/integration/render/unitObjectTemplateFlow.test.ts` — passed (4 tests).
- `npm run test:pathfinding` — passed (25 tests).
- `npx playwright test tests/acceptance/fog-of-war.spec.ts` — passed (1 test).
- `npm run build` — passed.

`npm run test:viewport` has one pre-existing failure in `viewport-interaction.contract.test.ts`: its expected tile is `{ x: 5, y: 10 }`, while the unchanged viewport interaction function returns `{ x: 6, y: 17 }`. This feature does not alter viewport conversion code.
