# Data Model: Dedicated Visual Templates

## Visual Template Catalog

Represents the complete repository-owned mapping from supported gameplay-facing types to dedicated or fallback visual definitions.

### Fields

- `unitTemplates`: collection keyed by supported unit identity or unit role
- `heroTemplates`: collection keyed by hero identity or hero visual role
- `movementObjectTemplates`: collection keyed by supported movement object type
- `guardedLocationTemplates`: collection keyed by guarded-location access state or location role
- `terrainTemplates`: collection keyed by terrain type
- `fallbackTemplates`: collection keyed by visual category to provide a safe placeholder path

### Relationships

- Supplies visual definitions to the Visual Template Resolver
- Covers all currently supported map and battle render categories
- May reference standalone asset files and fallback drawing metadata

### Validation Rules

- Every currently supported terrain type must have either a dedicated template or a declared fallback path
- Every currently supported rendered unit and object type must have either a dedicated template or a declared fallback path
- Keys must remain stable enough for renderers to resolve templates deterministically

## Visual Template Definition

Represents one reusable visual choice for a unit, object, hero, location marker, or terrain tile.

### Fields

- `templateId`: stable identifier for the template
- `visualCategory`: broad group such as unit, hero, object, location, or terrain
- `assetKind`: dedicated asset or fallback placeholder
- `assetSource`: standalone image source reference when a dedicated asset exists
- `fallbackStyle`: simplified drawing information used when the template resolves to placeholder behavior
- `readabilityLabel`: short human-readable description of what the template represents
- `intendedContexts`: map, battle, or both

### Relationships

- Belongs to the Visual Template Catalog
- Is returned by the Visual Template Resolver
- Is consumed by map or battle renderers

### Validation Rules

- A dedicated template may omit fallback styling only if a category-level fallback still exists
- A template used in battle must remain readable at battle slot scale
- A template used on the map must remain readable at current supported zoom levels

## Visual Template Resolver Result

Represents the render-ready result of asking for the visual that should be used for a specific game element.

### Fields

- `templateId`: resolved template identifier
- `resolvedFrom`: specific source of resolution such as unit type, terrain type, or fallback category
- `assetKind`: dedicated or fallback
- `assetSource`: asset reference when available
- `fallbackStyle`: placeholder drawing information when dedicated art is unavailable
- `isFallback`: whether the resolution path used fallback behavior

### Relationships

- Produced from the Visual Template Catalog
- Consumed by `renderMapScene.ts`, `renderBattleScene.ts`, and related helpers

### Validation Rules

- Resolver results must always return something renderable for supported entities and terrain
- Fallback results must remain visually readable and non-empty

## Supported Visual Subject

Represents any current game element that needs to be mapped to a template.

### Fields

- `subjectKind`: terrain, movement-object, hero, unit, guarded-location, or resource marker
- `subjectType`: stable type identifier such as `road`, `bridge`, `Militia`, or `blocked-resource-site`
- `sceneContext`: map or battle

### Relationships

- Is the input to template resolution
- Must map to exactly one effective resolved visual at render time

### State Transitions

- `dedicated available` → resolver chooses dedicated template
- `dedicated missing` → resolver chooses fallback template
- `dedicated restored` → resolver returns to dedicated template without requiring gameplay-state changes
