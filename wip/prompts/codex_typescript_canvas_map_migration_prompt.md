# Codex Prompt: Replace Existing TypeScript Canvas Map with a Procedural 2D Dark-Fantasy Strategy Map

You are modifying an existing game codebase.

The game already exists and is implemented in:

- TypeScript
- HTML5 Canvas 2D
- an existing map system with partial procedural generation and rendering
- an existing game loop, UI, entities, and project structure

Your task is **not** to rebuild the entire game.

Your task is to inspect the existing implementation and refactor or replace the world-map generation and rendering pipeline so that the game map becomes a detailed, readable, procedural 2D dark-fantasy strategy map.

The desired result is a map that feels:

- hand-painted
- gothic
- dark fantasy
- strategic rather than simulation-heavy
- readable at a glance
- suitable for heroes traversing roads between castles, towns, shrines, ruins, swamps, and mountain passes
- visually closer to an illustrated campaign map than a tile grid

Preserve the existing UI and game systems wherever possible.

---

## First Step: Inspect Before Editing

Before changing code, inspect the repository and identify:

1. the current map generation entry point
2. the current map data model
3. the current Canvas rendering pipeline
4. camera and coordinate transforms
5. world-to-screen conversion
6. hero movement logic
7. pathfinding implementation
8. collision and walkability rules
9. save/load format
10. map-related configuration
11. existing terrain assets
12. existing debug tools
13. test setup
14. build system
15. game loop ownership of rendering

Produce a short implementation note before coding:

```text
Current architecture
Files to modify
Files to preserve
Migration risks
Proposed staged approach
```

Do not assume a new folder structure if the project already has established conventions.

Adapt to the existing codebase.

---

## Main Goal

Replace the current map presentation with a layered procedural 2D campaign-map system.

Use this conceptual pipeline:

```text
existing game state
→ strategic graph
→ terrain fields
→ biome regions
→ constrained landmarks
→ roads and rivers
→ semantic map data
→ layered Canvas renderer
→ validation
```

The map must support:

- deterministic seeds
- hero traversal
- pathfinding
- castles
- towns
- shrines
- ruins
- vaults
- resource sites
- roads
- bridges
- mountain passes
- swamps
- forests
- corrupted terrain
- faction regions
- fog of war if already supported
- existing save/load behavior

---

## Important Constraint

Do not tightly couple procedural generation to rendering.

Keep these separate:

```text
Map generation
Map gameplay data
Pathfinding and movement
Map rendering
Map decoration
UI overlay
```

The renderer must consume semantic map data.

It must not decide game rules.

---

## Target Visual Style

The map should appear as a 2D illustrated strategy map.

Avoid:

- obvious square tiles
- raw Perlin-noise gradients
- uniform procedural dots
- overly clean vector shapes
- deep 3D perspective
- isometric terrain blocks
- random decoration without composition
- excessive visual noise around roads and landmarks

Prefer:

- broad readable biome masses
- hand-shaped terrain silhouettes
- clustered forests
- elongated mountain chains
- marsh pools
- winding roads
- large landmark silhouettes
- subtle parchment or dark-earth texture
- limited animation
- layered atmospheric effects
- clear strategic labels
- small hero or army tokens

The Canvas can still be fully procedural, but it should render as though it uses painted map stamps.

---

## Architecture

Prefer interfaces similar to the following, adapted to the current codebase.

```ts
export interface MapCell {
  x: number;
  y: number;
  elevation: number;
  moisture: number;
  corruption: number;
  temperature: number;
  biome: BiomeType;
  regionId: number;
  movementCost: number;
  road: RoadType | null;
  riverFlow: number;
  walkable: boolean;
}
```

```ts
export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  worldX: number;
  worldY: number;
  factionId?: string;
  level: number;
  importance: number;
  tags: string[];
}
```

```ts
export interface MapConnection {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  path: Point[];
  travelCost: number;
  roadType: RoadType;
}
```

```ts
export interface GeneratedWorldMap {
  seed: number;
  width: number;
  height: number;
  cells: MapCell[];
  locations: MapLocation[];
  connections: MapConnection[];
  regions: MapRegion[];
  metadata: MapGenerationMetadata;
}
```

Use typed enums or string unions.

Example:

```ts
export type BiomeType =
  | "plains"
  | "forest"
  | "deadForest"
  | "swamp"
  | "corruptedSwamp"
  | "wasteland"
  | "deadland"
  | "hills"
  | "mountains"
  | "snowPeaks"
  | "scorched"
  | "water";
```

---

## Deterministic Randomness

Create or reuse a seeded random-number generator.

Do not use `Math.random()` inside map generation.

Derive stable sub-seeds for:

- terrain
- regions
- landmarks
- roads
- rivers
- decoration
- labels
- ambient animation

Example API:

```ts
const terrainRng = seedStreams.get("terrain");
const roadsRng = seedStreams.get("roads");
```

Changing tree-decoration logic must not move castles or roads.

If the project already has deterministic randomness, reuse it.

---

## Strategic Graph

Generate important gameplay relationships before detailed terrain.

Nodes may represent:

- player start castle
- enemy castles
- neutral towns
- major quest locations
- resource hubs
- shrines
- vaults
- dungeon entrances
- mountain passes

Required graph properties:

- all major locations connected
- not only a tree
- at least some loops
- meaningful early choices
- increasing danger away from the player start
- optional dead ends only for rewards
- controlled chokepoints
- alternate routes to major objectives where feasible

Implement a lightweight graph utility if no graph library exists.

Avoid adding a large dependency only for minimum spanning trees or Delaunay logic if a small implementation is reasonable.

---

## Terrain Generation

Generate scalar fields:

```ts
interface TerrainFields {
  elevation: Float32Array;
  moisture: Float32Array;
  corruption: Float32Array;
  temperature: Float32Array;
}
```

Use:

- Simplex noise
- OpenSimplex noise
- value noise
- fractal Brownian motion
- low-frequency domain warping

Use independent seeds per field.

Do not render scalar fields directly.

Convert them into broad semantic regions.

Example biome logic:

```ts
function classifyBiome(
  elevation: number,
  moisture: number,
  corruption: number,
  temperature: number
): BiomeType {
  if (elevation > 0.82) return "snowPeaks";
  if (elevation > 0.7) return "mountains";
  if (elevation < 0.22) return "water";
  if (moisture > 0.72 && corruption > 0.62) return "corruptedSwamp";
  if (moisture > 0.68) return "swamp";
  if (corruption > 0.72) return "deadland";
  if (moisture > 0.52 && corruption < 0.52) return "forest";
  return "plains";
}
```

Then clean the result using neighborhood passes.

Implement functions such as:

```ts
smoothBiomeRegions();
removeTinyBiomeIslands();
mergeSmallComponents();
preserveStrategicBarriers();
```

---

## Region Generation

Create broad named regions using:

- Voronoi seeds
- weighted Voronoi
- region growing
- connected biome components
- domain-warped boundaries

Regions should support:

- biome identity
- danger level
- faction ownership
- corruption amount
- name
- optional visual tint
- landmark list

Do not create hundreds of tiny regions.

The map should have a small number of large memorable areas.

---

## Mountains

Generate elongated mountain chains rather than circular mountain blobs.

Use:

- ridge anchor points
- biased random walks
- graph edges
- splines
- elevation masks expanded around a center line

Represent mountain ranges as paths.

```ts
export interface MountainRange {
  id: string;
  path: Point[];
  width: number;
  peakStrength: number;
  passLocations: Point[];
}
```

Render individual mountain symbols or silhouettes aligned along the range path.

Keep some valid mountain passes for traversal.

---

## Rivers

Use simplified downhill flow.

Suggested approach:

1. choose elevated source points
2. inspect neighboring elevation
3. flow toward the lowest valid neighbor
4. merge streams
5. accumulate flow
6. widen based on flow
7. stop in water, swamp, or at the map boundary
8. detect road intersections
9. create bridges where required

A full erosion simulation is unnecessary.

The result only needs to look geographically plausible and support gameplay.

---

## Location Placement

Use constraint-based scoring.

Each location type should define:

```ts
interface LocationPlacementRule {
  allowedBiomes: BiomeType[];
  forbiddenBiomes: BiomeType[];
  minimumSpacing: number;
  preferredElevation?: [number, number];
  preferredDistanceToRoad?: [number, number];
  preferredDistanceToSettlement?: [number, number];
  requiresRemoteArea?: boolean;
  requiresFactionRegion?: boolean;
}
```

Example constraints:

### Castle

- high or defensible terrain
- not deep swamp
- close to a major road
- minimum spacing from another castle
- sufficient surrounding walkable cells

### Shrine

- near forest, swamp, dead forest, or corruption boundary
- away from large settlements
- optional road access

### Vault

- remote
- near mountains, ruins, or deadlands
- limited accessibility
- often in a side branch

### Town

- near road intersections
- on plains or hills
- not too close to enemy castles

Use scored candidates with controlled randomness.

Do not simply select the first valid cell.

---

## Roads

Build logical road connections between locations.

Use:

1. candidate location edges
2. minimum spanning tree
3. selected extra edges
4. A* routing over terrain
5. path simplification
6. visual smoothing

Recommended terrain costs:

```ts
const biomeMovementCost: Record<BiomeType, number> = {
  plains: 1,
  hills: 1.7,
  forest: 2.2,
  deadForest: 2.5,
  swamp: 6,
  corruptedSwamp: 8,
  wasteland: 3,
  deadland: 3.5,
  mountains: 25,
  snowPeaks: 35,
  scorched: 4,
  water: Number.POSITIVE_INFINITY,
};
```

Add:

- slope cost
- turning penalty
- danger cost
- existing-road preference
- bridge preference
- mountain-pass preference

Example:

```ts
const totalCost =
  biomeCost +
  slopePenalty +
  turnPenalty +
  dangerPenalty -
  existingRoadBonus;
```

Existing roads should be cheaper so roads merge naturally.

Store road paths independently from their rendered appearance.

---

## Hero Traversal

Preserve the existing hero movement system if possible.

Map movement should use semantic roads and terrain costs.

Support:

- click destination
- path preview
- remaining movement range
- road movement bonus
- blocked terrain
- bridges
- mountain passes
- interaction radius around locations
- arrival events
- fog of war updates if applicable

Do not bind hero movement to decorative pixels.

Movement must use world coordinates and map data.

---

## Canvas Renderer

Implement the map as a layered Canvas 2D renderer.

Suggested layers:

```text
1. background texture
2. terrain base
3. biome variation
4. water and swamp pools
5. corruption overlays
6. mountain ranges
7. forest clusters
8. rivers
9. roads
10. landmarks
11. location labels
12. faction borders
13. fog of war
14. hero and army tokens
15. selection and path overlays
16. ambient effects
```

Create separate render functions.

```ts
renderTerrain(ctx, camera, map);
renderWater(ctx, camera, map);
renderMountains(ctx, camera, map);
renderForests(ctx, camera, map);
renderRoads(ctx, camera, map);
renderLocations(ctx, camera, map);
renderLabels(ctx, camera, map);
renderUnits(ctx, camera, state);
renderFog(ctx, camera, fogState);
```

Do not put the entire map renderer in one function.

---

## Rendering Strategy

The map should not visibly look like a grid.

Possible implementation:

1. Generate a lower-resolution semantic terrain grid.
2. Convert biome boundaries into larger filled polygons or cached raster layers.
3. Render details with deterministic stamps.
4. Cache static layers to offscreen canvases.
5. Render only dynamic content each frame.

Use offscreen canvases for:

- base terrain
- biome texture
- mountains
- forests
- roads
- labels if labels do not change
- fog mask if appropriate

Example:

```ts
interface MapRenderCache {
  terrainCanvas: OffscreenCanvas | HTMLCanvasElement;
  decorationCanvas: OffscreenCanvas | HTMLCanvasElement;
  roadsCanvas: OffscreenCanvas | HTMLCanvasElement;
  labelsCanvas: OffscreenCanvas | HTMLCanvasElement;
}
```

Invalidate only affected layers.

---

## Painted Stamp System

Create a reusable stamp interface.

```ts
export interface MapStamp {
  id: string;
  category:
    | "mountain"
    | "forest"
    | "deadForest"
    | "swamp"
    | "ruin"
    | "town"
    | "castle"
    | "shrine"
    | "vault";
  image: CanvasImageSource;
  anchorX: number;
  anchorY: number;
  nominalWidth: number;
  nominalHeight: number;
}
```

Create a stamp renderer:

```ts
export function drawStamp(
  ctx: CanvasRenderingContext2D,
  stamp: MapStamp,
  position: Point,
  scale: number,
  rotation: number,
  alpha: number
): void;
```

Use small variation ranges.

Avoid arbitrary full rotations for architecture and mountains.

For example:

```ts
rotation = randomRange(-0.08, 0.08);
scale = randomRange(0.9, 1.1);
```

Allow placeholder procedural stamps until final assets exist.

---

## Forest Rendering

Do not draw one tree per cell.

Instead:

1. derive forest-region polygons or masks
2. Poisson-sample cluster anchors
3. render groups of trees
4. reduce density near roads
5. leave readable clearings around landmarks
6. vary silhouettes by biome

Use distinct styles for:

- living forest
- dead forest
- corrupted forest
- sparse wasteland trees

---

## Swamp Rendering

Swamps should include:

- irregular dark pools
- reeds
- dead trees
- fog patches
- ruined pillars
- muddy boundaries
- occasional green or blue highlights

Use region masks and clustered decoration.

Do not fill every swamp cell with an object.

---

## Road Rendering

Render roads as layered strokes.

Example:

```ts
ctx.lineCap = "round";
ctx.lineJoin = "round";
```

Use:

1. wide dark outer stroke
2. narrower earth-colored middle stroke
3. thin highlight
4. occasional broken texture
5. junction widening
6. bridge sprite or line treatment

Road width should vary by type:

- primary road
- secondary road
- trail

Roads should remain readable over every biome.

---

## Labels

Create a label layout system.

Labels should:

- avoid covering major roads
- avoid overlapping other labels
- remain readable over terrain
- scale or hide by zoom level
- use a dark backing plaque or outline
- prefer stable deterministic placement

Possible label fields:

```ts
interface MapLabel {
  id: string;
  text: string;
  worldPosition: Point;
  priority: number;
  minZoom: number;
  maxZoom: number;
}
```

At minimum, prioritize:

1. castles
2. towns
3. regions
4. shrines
5. optional landmarks

---

## Camera and Scaling

Preserve the existing camera system where possible.

The renderer should support:

- pan
- zoom
- world-to-screen conversion
- screen-to-world conversion
- culling
- UI-safe areas

Do not regenerate map data when zoom changes.

At distant zoom:

- simplify forests
- simplify roads
- show large region labels
- hide minor landmarks

At close zoom:

- show decoration
- show detailed roads
- show smaller landmarks
- show hero path previews

---

## Performance

The map may be large, but most visual layers are static.

Use:

- offscreen canvases
- cached raster layers
- spatial indexing
- chunk rendering if necessary
- viewport culling
- pooled temporary arrays
- typed arrays for fields
- requestAnimationFrame for dynamic rendering

Avoid:

- recalculating terrain every frame
- running noise functions during normal rendering
- drawing every cell independently every frame
- allocating large objects inside render loops
- rebuilding all labels every frame

Target:

- stable 60 FPS for normal camera movement
- map generation outside the frame loop
- progress reporting for longer generation

---

## Progressive Migration Plan

Do not replace everything in one unreviewable change.

### Phase 1: Adapter

Create an adapter from the current map model to the new semantic map representation.

Preserve existing gameplay behavior.

### Phase 2: New Static Renderer

Replace the visible terrain renderer while continuing to use current map data.

Prove that the new visual style works before replacing generation.

### Phase 3: Terrain Fields and Biomes

Introduce new procedural terrain fields and classification.

Keep location and road positions compatible where possible.

### Phase 4: New Roads and Landmarks

Add constrained landmark placement and A* road routing.

Migrate hero movement to the semantic path model if required.

### Phase 5: Validation and Save Migration

Add validation and update save formats carefully.

Support old saves if reasonably possible.

If old-save compatibility cannot be maintained, document the migration and version the save schema.

---

## Validation

Implement structured map validation.

```ts
export interface MapValidationResult {
  valid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  metrics: Record<string, number>;
}
```

Required checks:

- all major locations reachable
- starting area has at least two early objectives
- castles are correctly spaced
- high-level enemies are not adjacent to start
- roads connect expected endpoints
- no road crosses impassable terrain without a bridge
- required mountain passes exist
- no essential location is isolated
- biome diversity is acceptable
- no biome dominates excessively
- location density is reasonable
- optional paths and loops exist

Add a debug overlay displaying failures on the map.

---

## Debug Tools

Add a debug mode or developer panel with toggles for:

- biome IDs
- terrain costs
- elevation
- moisture
- corruption
- region boundaries
- strategic graph
- road nodes
- A* explored cells
- location candidate scores
- walkability
- river flow
- validation errors
- chunk boundaries
- render-cache boundaries

Include seed display and a “regenerate with seed” control if the game already has developer UI.

---

## Testing

Use the project’s existing test framework.

Add tests for:

### Determinism

```ts
same seed + same config = same semantic map
```

### Connectivity

```ts
all required landmarks are reachable
```

### Placement

```ts
castles and landmarks respect terrain and spacing constraints
```

### Roads

```ts
roads connect endpoints and avoid impassable cells
```

### Save Data

```ts
map can serialize and deserialize without semantic changes
```

### Rendering Utilities

Test pure geometry functions separately:

- path smoothing
- polygon generation
- label collision
- world-to-screen transforms
- spatial queries

Do not attempt pixel-perfect Canvas snapshot tests unless the project already uses them successfully.

---

## Required Deliverables

Implement:

1. analysis of the current map architecture
2. migration plan
3. semantic map model
4. seeded random streams
5. terrain-field generation
6. biome classification
7. region generation
8. constrained landmark placement
9. road graph and A* routing
10. simplified river generation
11. layered Canvas renderer
12. static render caching
13. hero traversal integration
14. map validation
15. debug overlays
16. tests
17. documentation

---

## Acceptance Criteria

The task is complete when:

1. The existing game still runs.
2. Existing UI remains intact unless changes are necessary.
3. The map appears as a coherent 2D illustrated dark-fantasy campaign map.
4. The visible map no longer resembles a raw grid or basic noise field.
5. Roads, settlements, and terrain are strategically readable.
6. Hero traversal still works.
7. Map generation is deterministic.
8. Major locations are reachable.
9. Static rendering is cached.
10. Camera movement remains performant.
11. Map data is separated from rendering.
12. Tests cover deterministic generation and essential navigation.
13. Existing save behavior is preserved or explicitly migrated.
14. The implementation follows the project’s current conventions.

---

## Codex Working Rules

- Inspect before editing.
- Reuse existing systems where reasonable.
- Do not rewrite unrelated game systems.
- Keep changes incremental.
- Prefer small focused commits or clearly separated patches.
- Explain architectural changes.
- Do not introduce dependencies without justification.
- Preserve TypeScript strictness.
- Avoid `any`.
- Keep Canvas rendering code modular.
- Use semantic world coordinates.
- Do not use decorative pixels for gameplay collision.
- Keep generation deterministic.
- Run the project’s type checker, tests, and build after changes.
- Fix regressions caused by the map migration.
- Document any remaining limitations.

---

## Final Response Format

After implementation, report:

```text
Summary
Architecture changes
Files changed
Generation pipeline
Rendering pipeline
Migration notes
Save compatibility
Tests run
Performance notes
Known limitations
Recommended next steps
```

The central design principle is:

```text
strategic gameplay structure
→ semantic procedural world
→ layered 2D Canvas rendering
```

Do not generate a visually random map first and force gameplay to fit it afterward.
