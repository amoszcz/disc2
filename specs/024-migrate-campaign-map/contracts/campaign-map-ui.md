# Contract: Campaign Map Presentation and Interaction

## Purpose

Defines player-visible behavior for the layered campaign-map renderer, HUD, diagnostics, and supported input modes.

## Layering and Alignment

The renderer consumes semantic map data and the established viewport transforms. Static layers appear in this order: background/terrain, biome variation, water/corruption, mountains/forests, rivers, roads/crossings, landmarks, labels/borders. Dynamic layers then draw fog, heroes/armies, route previews, selections, and optional developer overlays.

All layers use the same world-to-screen conversion. Pan, zoom, viewport resize, and touch gestures must keep terrain, labels, locations, hero, route, and selection aligned. Zoom never regenerates gameplay map data.

## Primary Movement Flow

1. Player selects an eligible hero.
2. Player chooses a destination by supported desktop or touch input.
3. A legal route visibly previews its destination and movement consequence before commitment.
4. The player can cancel or replace an uncommitted preview with no movement, resource, or turn change.
5. Confirming follows the existing legal route behavior; blocked/unavailable choices state why near the interaction context.

Essential feedback must be available without hover. Route, hero, and selection overlays remain readable above the illustrated terrain and must not disclose unexplored fog content.

## Labels and Visibility

- Important locations and regions have deterministic labels that avoid high-priority routes, locations, heroes, and other high-priority labels.
- At distant zoom, minor labels and fine decoration may simplify or hide while major region/location identity remains readable.
- At close zoom, detailed roads, landmarks, and route feedback remain legible.
- Fog-of-war keeps unexplored locations, objects, and labels hidden according to existing scenario settings.

## Caching and Diagnostics

Static cache invalidation is observable through a diagnostics seam. A pan or route/hero update must not rebuild semantic terrain or static decoration. A semantic-map revision, source asset change, relevant scale/device scale change, or developer regeneration request may invalidate the affected cache layers.

Developer overlays can reveal seeds, cell fields, traversal values, regions, graph/road paths, placement scores, validator failures, and cache boundaries only when explicitly enabled; they are absent from normal player presentation.
