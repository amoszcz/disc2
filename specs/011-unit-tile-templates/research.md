# Research: Dedicated Visual Templates

## Decision 1: Use a small catalog-and-resolver layer instead of embedding asset choices directly in each renderer

**Decision**: Introduce a dedicated visual-template catalog that maps unit types, movement-object types, guarded-location states, heroes, and terrain types to dedicated assets and fallback definitions, plus a resolver helper that renderers call at draw time.

**Rationale**: The current rendering path is split across `renderMapScene.ts`, `renderBattleScene.ts`, `renderGuardedLocations.ts`, and `placeholders.ts`. A shared catalog keeps template selection consistent across map and battle scenes, avoids duplicated conditionals, and makes partial asset rollout straightforward.

**Alternatives considered**:
- Hardcode dedicated asset selection inside each render function: rejected because it would duplicate logic and make fallback behavior harder to keep consistent.
- Store fully resolved visual data directly inside scenario definitions: rejected because visuals would become content-coupled and repeated across scenarios instead of remaining type-based reusable assets.

## Decision 2: Keep the existing placeholder palette and glyph path as a first-class fallback

**Decision**: Preserve the current placeholder colors, simple shapes, and glyph-based indicators as the official fallback rendering path when no dedicated template is available.

**Rationale**: The feature explicitly requires testing to remain possible with today's simple visuals. Reusing the current placeholder behavior minimizes risk, reduces new work for incomplete assets, and gives the implementation a stable baseline for regression checks.

**Alternatives considered**:
- Require every supported entity and terrain to have a dedicated visual before enabling the system: rejected because it would block incremental delivery and testing.
- Replace placeholders with transparent or blank defaults: rejected because missing assets would become harder to detect and would reduce playability.

## Decision 3: Prefer SVG-first dedicated assets with PNG-compatible support

**Decision**: Design the asset-template system around standalone reusable image files, with SVG preferred for the first asset set and PNG remaining acceptable where needed.

**Rationale**: The feature request explicitly calls for SVG or PNG storage. SVG is well-suited to the current small, slightly-more-advanced-than-placeholder art target because it scales cleanly across desktop/mobile and across zoom levels without requiring many raster sizes. PNG remains useful for any asset that is easier to author or test as a bitmap.

**Alternatives considered**:
- Canvas-only procedural art with no asset files: rejected because it does not satisfy the request for dedicated stored templates.
- PNG-only delivery: rejected because it would make scaling flexibility weaker for the initial multi-size map and battle use cases.

## Decision 4: Keep the first slice focused on currently supported content types only

**Decision**: Scope the first catalog to the unit, object, and terrain types that already exist in the current scenarios and type definitions.

**Rationale**: The repository currently exposes a small known set of units and movement objects, and the spec explicitly positions this as an early, modest visual upgrade rather than a final art pass. Limiting the slice prevents speculative asset infrastructure for future content that does not yet exist.

**Alternatives considered**:
- Build a generic pipeline for future factions, buildings, and hundreds of asset classes now: rejected because it adds speculative complexity without immediate feature value.
- Cover only terrain or only battle units in the first slice: rejected because the spec requires units, other objects, and tiles together.

## Decision 5: Validate behavior through resolver contracts and real scene rendering flows rather than image-perfect snapshot baselines

**Decision**: Test the feature through contract and integration coverage that verifies which template path was selected, plus acceptance flows that ensure readable visuals appear in current scenarios.

**Rationale**: The project constitution prefers feature-level evidence over brittle implementation-coupled assertions. Full image snapshot testing would be sensitive to harmless visual refinements and would add maintenance cost. Resolver-level contracts plus scene-level flows provide confidence while leaving room for art iteration.

**Alternatives considered**:
- Pixel-perfect snapshot testing for every scene: rejected because it is brittle for an evolving visual layer.
- No automated visual coverage: rejected because the constitution requires automated evidence for changed behavior.
