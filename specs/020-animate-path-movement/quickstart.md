# Quickstart: Validate Animated Path Movement

## Prerequisites

- Install project dependencies with `npm install`.
- Use a modern browser with local storage enabled.

## Automated validation

Run the focused test suites after implementation:

```bash
npm test -- tests/contract/game-settings.contract.test.ts tests/contract/route-traversal.contract.test.ts tests/integration/foundation/gameSettingsPersistenceFlow.test.ts tests/integration/map/routeTraversalFlow.test.ts
npx playwright test tests/acceptance/animated-route-traversal.spec.ts tests/acceptance/game-settings.spec.ts
```

Then run the existing route and template coverage to confirm compatibility:

```bash
npm run test:pathfinding
npm run test:template-selector
```

## Manual scenario: animated movement

1. Start an available scenario.
2. Plot a route of at least two legal tiles and confirm it.
3. Verify that the hero completes one tile every second in the displayed order.
4. Verify that movement points, pickups, forced stops, map travel, and remaining route state match normal route rules.

## Manual scenario: settings persistence

1. Open Settings from the main menu; select **Immediate** and a valid non-default template.
2. Return, start a scenario, and confirm a route; it should complete immediately and render using the selected template.
3. Reload the page, start a scenario, and verify both choices persist.
4. Open Settings during gameplay, select any available setting other than **Immediate**, return to the map, and confirm a new multi-tile route.
5. Verify that gameplay no longer displays a template selector and that storybook and sprite-mapping selectors still work.

See [data-model.md](data-model.md) for state and persistence rules and [game-settings-and-traversal.md](contracts/game-settings-and-traversal.md) for observable UI contracts.

## Validation record

- 2026-07-19: Immediate-only bypass validation passed: focused settings and route-traversal suites, immediate/non-immediate browser flows, and the production build all passed.
- 2026-07-19: Focused settings, traversal, pathfinding, template-selection, build, and browser acceptance flows passed.
- The repository-wide Vitest run retains one unrelated failing viewport interaction contract in `tests/contract/viewport-interaction.contract.test.ts`; no viewport module was changed by this feature.
