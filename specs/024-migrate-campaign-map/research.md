# Research: Campaign Map Migration

## Decision: Use an adapter-first semantic representation

**Rationale**: Current scenarios already encode playable maps, rectangular terrain, bridges, guarded locations, heroes, and inter-map links. An adapter can map those facts to semantic cells, regions, locations, and connections immediately, preserving behavior while the visual renderer changes. It also separates current authored maps from future procedural generation.

**Alternatives considered**:

- Replace scenario definitions and renderer in one change: rejected because it would simultaneously risk traversal, map links, fog, visual templates, and current tests.
- Keep rendering directly from scenario regions: rejected because renderer-owned interpretation would keep gameplay and decoration coupled.

## Decision: Build deterministic seeded primitives in-repository

**Rationale**: No current deterministic random system or general map generator exists. A compact seeded generator with named derived streams makes terrain, locations, roads, labels, and decoration independently stable. It avoids a dependency and ensures decoration changes do not move gameplay entities.

**Alternatives considered**:

- `Math.random()`: rejected because map replay, tests, debugging, and saved identity require reproducibility.
- A third-party noise/graph package: deferred; the current scope can use small deterministic value-noise, graph, and A* utilities. Reconsider only if profiling or terrain quality demonstrates an immediate limitation.

## Decision: Keep logical cells; render broad shapes and deterministic stamps

**Rationale**: Existing movement, fog, and route preview use grid coordinates. Semantic cells remain the discrete gameplay substrate, while the renderer combines them into biome masks, paths, clusters, silhouette stamps, labels, and cached layers so the player does not see a dominant square grid.

**Alternatives considered**:

- Change gameplay to free-form pixel collision: rejected because it would invalidate pathfinding and make decoration affect rules.
- Render raw scalar fields per frame: rejected because the prompt requires readable semantic regions and stable camera performance.

## Decision: Retain current world/screen transforms and route-preview workflow

**Rationale**: `viewportMath.ts`, `viewportRender.ts`, and `mapInputController.ts` already keep pan, zoom, touch gestures, screen-to-world targets, and canvas sizing consistent. `heroActions.ts` already implements select, preview, cancel, confirmation, continuation, and feedback. Semantic map lookups can substitute beneath those flows without redesigning controls.

**Alternatives considered**:

- New camera/input system: rejected as unrelated migration risk.
- Destination-only movement: rejected because the constitution and specification require consequences before commitment and recoverable previews.

## Decision: Cache static layers per map revision and zoom bucket

**Rationale**: Terrain, biome variation, mountains, forests, roads, landmarks, and static labels should not be regenerated during a frame. Cache them in reusable Canvas/OffscreenCanvas-compatible surfaces keyed by map identity, semantic revision, viewport scale bucket, and device scale; composite dynamic hero, route, selection, fog, and transient diagnostics each frame.

**Alternatives considered**:

- One giant permanent raster: rejected because scale, viewport, fog, labels, and device pixel ratio require controlled invalidation.
- Repaint every cell every frame: rejected because it cannot meet the responsiveness goal as maps and decoration density grow.

## Decision: Validate before a generated main map becomes playable

**Rationale**: Procedural terrain and landmark placement can create isolated objectives, blocked roads, unsafe starts, or low variety. Validation returns structured failures and metrics; generation retries bounded deterministic variants or rejects the map in developer-visible fashion. Existing authored maps also receive adapter-compatible validation without forcing procedural replacement.

**Alternatives considered**:

- Let player feedback discover invalid maps: rejected because essential scenario completion must be guaranteed.
- Treat visual plausibility as sufficient: rejected because reachability and road crossing legality are gameplay properties.

## Decision: Preserve current settings-only persistence; version campaign maps if persistent saves are added

**Rationale**: The codebase has no general game-save format—only local storage for settings. There is therefore no existing campaign save to migrate. The semantic map needs a serialization contract, schema version, seed, configuration, and generated payload only when session persistence is introduced; no silent persistence behavior should be invented during the visual migration.

**Alternatives considered**:

- Add local-storage campaign saves now: rejected as a separate product capability outside the existing save behavior.
- Ignore future serialization: rejected because deterministic replay and later saves need an explicit forward-compatible boundary.

## Decision: Expose developer diagnostics as a scoped optional overlay

**Rationale**: Existing visual-template diagnostics establish a testable diagnostic pattern. A campaign-map developer surface can expose seed, validation metrics/errors, cells, regions, graph, routes, candidate scores, and cache bounds without leaking hidden map information into normal play.

**Alternatives considered**:

- Always render debug data: rejected because it harms visual clarity and can reveal fogged content.
- Console-only diagnostics: rejected because the requirement calls for map-visible failure inspection.
