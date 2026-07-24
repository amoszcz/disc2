# Quickstart: Validate the Campaign Map Migration

## Prerequisites

- Node dependencies are installed.
- Run commands from the repository root.

## Baseline checks

```bash
npm run build
npm run test
npm run test:acceptance
```

Expected: the TypeScript build, existing feature tests, and browser acceptance suite pass. Existing menu, map, battle, submap, fog, route, and mobile behavior remain available.

## Semantic map and validation checks

Run the campaign-map contract/integration test group added by implementation. It must demonstrate:

1. The same map seed and configuration yield identical semantic cells, regions, locations, connections, traversal values, and validation result.
2. The scenario adapter preserves existing map dimensions, terrain cost/legality, bridges, locations, map links, and fog coordinates.
3. Generated candidate maps reject or repair isolated essential objectives, illegal crossings, absent passes, unsafe starts, and inadequate strategic choices.
4. Decorative changes do not alter semantic locations, road routing, or traversal output.

## Player-flow checks

Start the app with `npm run dev`, select each supported scenario, and verify:

1. The campaign view presents broad illustrated terrain and no dominant raw tile grid.
2. A hero can be selected, routed to a legal destination, previewed, cancelled/replaced, and confirmed without unintended movement loss.
3. A blocked destination reports a clear reason.
4. A bridge, pass, or linked-map crossing follows the same legal traversal rule shown in feedback.
5. Fog hides unexplored content while preserving needed route/selection feedback.
6. On desktop and a mobile-sized viewport, pan/zoom and a tap movement action remain available and aligned.

## Rendering and performance checks

Enable the developer campaign-map overlay and verify the displayed seed, validation state, graph/routes, and cache bounds match the active map. Pan and update hero routes: dynamic overlays may update, but static cache diagnostics must not report terrain regeneration. Change semantic map revision or supported scale bucket: only affected cache layers rebuild.

Refer to [data-model.md](./data-model.md), [campaign-map-data.md](./contracts/campaign-map-data.md), and [campaign-map-ui.md](./contracts/campaign-map-ui.md) for contract details.
