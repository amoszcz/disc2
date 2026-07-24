# Tasks: Migrate Campaign Map

**Input**: Design documents from `/specs/024-migrate-campaign-map/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Automated tests are required for every behavior-changing story under the project constitution. Prefer contract, integration, and Playwright acceptance coverage; use focused pure-geometry tests only where interaction-level evidence is insufficient.

**Organization**: Tasks are grouped by user story. US1 is the adapter-first MVP and must remain playable before generated maps replace an authored main map.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature-local seams and test commands without introducing dependencies.

- [X] T001 Create campaign-map module and render-layer directories with public barrel exports in `src/engine/campaign-map/index.ts` and `src/render/canvas/campaign-map/index.ts`
- [X] T002 [P] Add a focused campaign-map Vitest command and acceptance command to `package.json`
- [X] T003 [P] Add a Canvas cache-capable test context and deterministic test fixtures in `tests/integration/campaign-map/renderTestContext.ts` and `tests/integration/campaign-map/fixtures.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define semantic data, deterministic sources, and scenario adaptation shared by all stories.

**CRITICAL**: Complete this phase before user-story implementation.

- [X] T004 Define semantic campaign-map types, biome/location/road unions, metadata, validation, and generation-config types in `src/engine/campaign-map/types.ts`
- [X] T005 [P] Implement named deterministic seed streams and stable seed derivation in `src/engine/campaign-map/seedStreams.ts`
- [X] T006 [P] Implement coordinate keys, bounds, neighbor enumeration, path cost helpers, and deterministic comparison utilities in `src/engine/campaign-map/geometry.ts`
- [X] T007 Implement the scenario-world-map adapter that maps current cells, rectangular terrain, movement objects, guarded locations, pickups, heroes, and links to semantic map data in `src/engine/campaign-map/adaptScenarioWorldMap.ts`
- [X] T008 Integrate campaign-map resolution and map identity with loading while retaining existing authored scenario behavior in `src/engine/scenario/types.ts` and `src/engine/scenario/loadScenario.ts`
- [X] T009 Implement a semantic traversal lookup adapter that preserves current terrain, bridge, passability, and unavailable-route explanations in `src/engine/campaign-map/resolveCampaignTraversal.ts`
- [X] T010 [P] Add data-contract coverage for stable map identity, dimensions, cells, locations, connections, and schema-version boundaries in `tests/contract/campaign-map-data.contract.test.ts`
- [X] T011 [P] Add deterministic-stream and scenario-adapter integration coverage for every existing world map in `tests/integration/campaign-map/scenarioMapAdapterFlow.test.ts`
- [X] T012 Add traversal parity coverage for terrain costs, bridge crossings, blocked tiles, and inter-map links in `tests/integration/campaign-map/campaignTraversalAdapterFlow.test.ts`

**Checkpoint**: Semantic maps can be resolved from all current scenarios deterministically, and route behavior remains unchanged through the adapter.

---

## Phase 3: User Story 1 - Traverse a Readable Campaign World (Priority: P1) MVP

**Goal**: Replace the visibly dominant tile-grid presentation with a layered illustrated campaign view without changing hero selection, route preview/cancel/confirm, fog, or current UI flow.

**Independent Test**: Start a supported adapted scenario, select a hero, preview a reachable route, replace and cancel it, attempt an unavailable destination, confirm a legal route, and verify movement/fog/UI behavior is unchanged while the campaign renderer has no dominant tile border.

### Tests for User Story 1

- [X] T013 [P] [US1] Add presentation-contract coverage for semantic layers, no dominant grid borders, alignment, fog safety, and route-feedback ordering in `tests/contract/campaign-map-ui.contract.test.ts`
- [X] T014 [P] [US1] Add integration coverage for the renderer consuming semantic data while preserving hero, route-preview, fog, and location overlays in `tests/integration/campaign-map/semanticMapRenderFlow.test.ts`
- [X] T015 [P] [US1] Add integration coverage that semantic traversal keeps existing preview, replace, cancel, confirmation, and unavailable feedback semantics in `tests/integration/map/campaignMapRouteFlow.test.ts`
- [X] T016 [P] [US1] Add desktop and touch-capable acceptance coverage for readable map launch, route consequence preview, cancellation, unavailable feedback, and route commit in `tests/acceptance/campaign-map-traversal.spec.ts`

### Implementation for User Story 1

- [X] T017 [P] [US1] Implement illustrated base terrain, broad biome-mass, water, corruption, and texture layer functions driven only by semantic cells in `src/render/canvas/campaign-map/renderTerrainLayers.ts`
- [X] T018 [P] [US1] Implement deterministic reusable procedural stamp definitions and placement/drawing helpers for forests, mountains, swamps, and landmarks in `src/render/canvas/campaign-map/stamps.ts`
- [X] T019 [P] [US1] Implement semantic road, bridge, river, location, and faction-boundary layer functions in `src/render/canvas/campaign-map/renderStrategicLayers.ts`
- [X] T020 [P] [US1] Implement zoom-aware deterministic label candidate layout, collision avoidance, and major-label prioritization in `src/render/canvas/campaign-map/labelLayout.ts`
- [X] T021 [US1] Implement the map render cache keyed by semantic revision, scale bucket, and device scale with safe HTMLCanvas/OffscreenCanvas fallback in `src/render/canvas/campaign-map/renderCache.ts`
- [X] T022 [US1] Compose static semantic layers and existing dynamic hero, route, selection, guarded-location, visual-template, and fog overlays in `src/render/canvas/campaign-map/renderCampaignMap.ts`
- [X] T023 [US1] Refactor map render orchestration to resolve the active semantic map, use the campaign renderer, preserve viewport culling/transforms, and remove visible tile-border drawing in `src/render/canvas/renderMapScene.ts`
- [X] T024 [US1] Route current pathfinding and movement-rule terrain/crossing reads through the semantic traversal adapter without changing the public hero-action workflow in `src/engine/map/routeRules.ts`, `src/engine/map/routePathfinding.ts`, and `src/engine/map/movementObjectRules.ts`
- [X] T025 [US1] Keep map HUD/action-bar language and touch/desktop input feedback aligned with the new semantic route and location presentation in `src/app/scene-controller/mapScene.ts`, `src/ui/hud/mapHud.ts`, and `src/app/scene-controller/mapInputController.ts`
- [X] T026 [US1] Update visual-template diagnostics to distinguish semantic campaign terrain and landmark rendering while preserving existing template coverage in `src/render/sprites/visualTemplateResolver.ts`

**Checkpoint**: US1 is independently playable as an illustrated, adapted campaign map with preserved movement and recoverable route planning.

---

## Phase 4: User Story 2 - Explore a Varied, Strategic Dark-Fantasy Map (Priority: P2)

**Goal**: Generate deterministic main campaign maps with meaningful terrain, locations, routes, barriers, crossings, and validation while retaining compatibility for unmigrated maps and submaps.

**Independent Test**: Generate a migrated main map twice with the same seed/configuration; assert identical semantic data and validation, legal reachability/crossings, at least two valid starting choices, and preserved traversal of its generated roads and barriers.

### Tests for User Story 2

- [X] T027 [P] [US2] Add deterministic-generation contract coverage for named streams, semantic equality, and decoration isolation in `tests/contract/campaign-map-determinism.contract.test.ts`
- [X] T028 [P] [US2] Add validation-contract coverage for essential reachability, location spacing, crossings/passes, start choices, progression, biome diversity, and route loops in `tests/contract/campaign-map-validation.contract.test.ts`
- [X] T029 [P] [US2] Add integration coverage for generated terrain, biomes, regions, rivers, mountains, landmarks, graph routes, and road paths in `tests/integration/campaign-map/proceduralCampaignMapFlow.test.ts`
- [X] T030 [P] [US2] Add integration coverage for generated road/pass/bridge traversal and semantic route feedback in `tests/integration/map/generatedCampaignRouteFlow.test.ts`
- [X] T031 [P] [US2] Add acceptance coverage for surveying generated strategic features and completing a legal early objective route in `tests/acceptance/procedural-campaign-map.spec.ts`

### Implementation for User Story 2

- [X] T032 [P] [US2] Implement seeded scalar terrain fields, domain variation, biome classification, smoothing, and small-component cleanup in `src/engine/campaign-map/generateTerrain.ts`
- [X] T033 [P] [US2] Implement broad named region growing with biome identity, danger, faction, corruption, and region boundaries in `src/engine/campaign-map/generateRegions.ts`
- [X] T034 [P] [US2] Implement constrained scored landmark placement for starts, castles, towns, shrines, ruins, vaults, resource sites, and passes in `src/engine/campaign-map/placeLocations.ts`
- [X] T035 [P] [US2] Implement elongated mountain-range paths, legal passes, downhill river flow, and crossing candidates in `src/engine/campaign-map/generateBarriers.ts`
- [X] T036 [US2] Implement connected strategic graph construction with loops, early choices, reward branches, danger progression, and candidate-edge selection in `src/engine/campaign-map/buildStrategicGraph.ts`
- [X] T037 [US2] Implement terrain-aware A* road routing, path simplification, existing-road preference, bridge/pass selection, and independent semantic connections in `src/engine/campaign-map/routeConnections.ts`
- [X] T038 [US2] Implement map validation, bounded deterministic repair/retry, metrics, and developer-visible rejection state in `src/engine/campaign-map/validateCampaignMap.ts` and `src/engine/campaign-map/generateCampaignMap.ts`
- [X] T039 [US2] Add explicit generation configuration and migrate one main campaign scenario while retaining adapter fallback for other maps/submaps in `src/content/scenarios/advanced-terrain-scenario.ts`, `src/engine/scenario/types.ts`, and `src/engine/scenario/loadScenario.ts`
- [X] T040 [US2] Connect generated semantic roads, crossings, terrain costs, locations, and validation acceptance to the existing route, fog, guarded-location, and map-link seams in `src/engine/map/routeRules.ts`, `src/engine/map/fogOfWar.ts`, and `src/engine/map/guardRules.ts`

**Checkpoint**: A migrated main scenario produces a validated, deterministic strategic campaign map; unmigrated scenarios and submaps continue through the adapter.

---

## Phase 5: User Story 3 - Navigate a Polished Illustrated Map (Priority: P3)

**Goal**: Keep the map clear, aligned, responsive, and inspectable across zoom levels and desktop/mobile navigation.

**Independent Test**: On desktop and mobile viewports, pan and zoom an adapted and generated map, identify active hero/major destination, select and move without hover, and confirm cache diagnostics show no static rebuild for ordinary navigation.

### Tests for User Story 3

- [X] T041 [P] [US3] Add geometry coverage for label collision, world/screen alignment, zoom thresholds, culling, and scale-bucket cache keys in `tests/integration/campaign-map/campaignMapGeometryFlow.test.ts`
- [X] T042 [P] [US3] Add render-cache integration coverage for correct invalidation and no terrain regeneration during pan, route, hero, or fog updates in `tests/integration/campaign-map/campaignMapRenderCacheFlow.test.ts`
- [X] T043 [P] [US3] Add developer-diagnostics contract coverage for seed, validation, overlays, cache boundaries, and fog-safe normal presentation in `tests/contract/campaign-map-diagnostics.contract.test.ts`
- [X] T044 [P] [US3] Add desktop/mobile acceptance coverage for zoom simplification, label priority, aligned selection, and touch movement without hover in `tests/acceptance/campaign-map-navigation.spec.ts`

### Implementation for User Story 3

- [X] T045 [US3] Add scale-aware culling, layer simplification, and viewport-safe cache compositing while retaining existing viewport math/input behavior in `src/render/canvas/campaign-map/renderCampaignMap.ts` and `src/render/canvas/campaign-map/renderCache.ts`
- [X] T046 [US3] Implement map developer diagnostic state, seed/regeneration action boundary, and overlay definitions in `src/developer/campaign-map/campaignMapDiagnostics.ts`
- [X] T047 [US3] Render optional semantic cell, region, graph, route-search, placement, validation, and cache-boundary overlays in `src/render/canvas/campaign-map/renderDiagnostics.ts` and `src/render/canvas/campaign-map/renderCampaignMap.ts`
- [X] T048 [US3] Add a developer-facing campaign-map diagnostics panel/control that cannot expose information in ordinary gameplay in `src/ui/overlays/campaignMapDiagnosticsPanel.ts` and `src/app/scene-controller/mapScene.ts`
- [X] T049 [US3] Preserve responsive canvas sizing, two-finger zoom, and no-hover essential feedback under label and overlay changes in `src/render/canvas/viewportRender.ts` and `src/app/scene-controller/mapInputController.ts`

**Checkpoint**: Desktop and mobile campaign navigation remain responsive and readable, with developer diagnostics available only on demand.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete compatibility, quality, and delivery validation across all stories.

- [X] T050 [P] Document semantic-map schema/version behavior, adapter scope, generation seed behavior, and future save compatibility in `specs/024-migrate-campaign-map/quickstart.md` and `specs/024-migrate-campaign-map/data-model.md`
- [X] T051 [P] Add regression coverage that current core map, submap transitions, fog, visual templates, and route persistence remain compatible with campaign-map resolution in `tests/integration/campaign-map/legacyScenarioCompatibilityFlow.test.ts`
- [X] T052 Add the campaign-map suites to the appropriate aggregate verify scripts in `package.json`
- [X] T053 Run `npm run build`, the campaign-map Vitest group, existing route/fog/mobile suites, and campaign-map Playwright acceptance flows; record results and any accepted limitations in `specs/024-migrate-campaign-map/quickstart.md`
- [X] T054 Reconcile implementation with [spec.md](./spec.md), [plan.md](./plan.md), and [contracts/](./contracts/) and append any remaining work before handoff in `specs/024-migrate-campaign-map/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on T001–T003 and blocks all user stories.
- **US1 (Phase 3)**: Depends on T004–T012. This is the MVP.
- **US2 (Phase 4)**: Depends on T004–T012 and integrates with the semantic renderer/traversal seams completed in T022–T024; it retains adapter fallback for independent scenario compatibility.
- **US3 (Phase 5)**: Depends on T021–T023 and can refine either adapted or generated map presentation. It should follow US2 for final generated-map diagnostics.
- **Polish (Phase 6)**: Depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on generated terrain. It independently delivers the adapted illustrated map and preserved route workflow.
- **US2 (P2)**: Requires the semantic foundation and renderer/traversal integration points from US1, but generation/validation logic is independently testable with fixtures.
- **US3 (P3)**: Requires the cached renderer from US1; its diagnostic overlays additionally consume US2 validation data when available.

### Parallel Opportunities

- T002–T003 can run together; T005–T006 and T010–T011 can run in parallel after types are agreed.
- Within US1, T013–T016 and T017–T020 are parallel file-isolated work; T021–T026 then integrate them.
- Within US2, T027–T031 and T032–T035 are parallel; T036–T040 compose the graph, validation, scenario migration, and traversal integration.
- Within US3, T041–T044 are parallel; T045–T049 integrate cache, overlay, panel, and input behavior.

## Parallel Example: User Story 1

```text
T013  Contract coverage: tests/contract/campaign-map-ui.contract.test.ts
T014  Renderer integration: tests/integration/campaign-map/semanticMapRenderFlow.test.ts
T017  Terrain layers: src/render/canvas/campaign-map/renderTerrainLayers.ts
T018  Stamp system: src/render/canvas/campaign-map/stamps.ts
T019  Strategic layers: src/render/canvas/campaign-map/renderStrategicLayers.ts
T020  Label layout: src/render/canvas/campaign-map/labelLayout.ts
```

## Implementation Strategy

### MVP First

1. Complete setup and the semantic adapter foundation.
2. Complete US1: adapter-backed illustrated layers, render cache, preserved route input/feedback, and its behavior tests.
3. Run the US1 independent test and acceptance flow before starting procedural generation.

### Incremental Delivery

1. Deliver adapter-backed campaign presentation (US1).
2. Migrate one main scenario to deterministic terrain/landmarks/routes plus validation (US2), preserving other maps through the adapter.
3. Add responsive visual refinement and developer diagnostics (US3).
4. Run compatibility and full quickstart validation (Phase 6).

## Notes

- Every task follows the required checkbox, sequential ID, optional parallel marker, story label, and exact-path format.
- No new external dependency is planned. If implementation discovers one is needed, justify it in the plan and add a real-integration validation task before adoption.
- The existing settings-only storage remains unchanged; versioned semantic-map persistence is documented as a future boundary rather than added outside scope.
