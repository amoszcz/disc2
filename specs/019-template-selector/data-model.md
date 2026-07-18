# Data Model: Switch Visual Templates

## Template Catalog

The Template Catalog is the single authoritative collection of visual template sources. It owns source identifiers, labels, paired asset references, availability, and diagnostics. No scene maintains a separate source list.

## Visual Template Source

| Field | Meaning | Validation |
|---|---|---|
| `templateId` | Stable catalog, session, and request identifier derived from the shared base filename | Unique, non-empty, and never supplied as an arbitrary path |
| `label` | Human-readable dropdown label | Non-empty; derived consistently for all three selectors |
| `imageUrl` | URL for the paired PNG image | Must belong to a registered pair and load as an image |
| `mapUrl` | URL for the paired JSON coordinate map | Must belong to the same registered pair and parse successfully |
| `availability` | Ready, incomplete, invalid, or error status | Only ready sources are selectable |
| `diagnostics` | Readable reason a source cannot be selected | Present for incomplete, invalid, or failed sources |

**Relationship**: One `VisualTemplateSource` owns exactly one image and one coordinate map with the same base filename. The Template Catalog owns many sources; game configuration and session state reference a source by identifier.

## Game Template Configuration

| Field | Meaning | Validation |
|---|---|---|
| `defaultTemplateId` | Catalog identifier selected when a new game session is created | Must identify one ready catalog source |

The configuration stores no image paths, map paths, frames, or screen-specific default values. An invalid configured identifier is a startup configuration error with a clear diagnostic rather than a silent first-entry fallback.

## Active Template Selection

| Field | Meaning | Validation |
|---|---|---|
| `activeTemplateId` | The session-wide selected source | Must identify a ready catalog source; initializes from `defaultTemplateId` |
| `selectionStatus` | Ready, loading, or error feedback | Rendering retains the last usable source or fallback while a new source cannot load |
| `origin` | Surface from which the last selection was made | Informational only; must not create separate per-surface selections |

**State transitions**: `default` → `loading` → `active` after a valid selector change; `loading` → `error` when the source cannot load, leaving the prior active source usable; `active` → `switch-confirmation` when mapper edits are dirty; confirmation proceeds to `loading`, cancellation returns to `active`.

## Runtime Template Catalog

| Field | Meaning | Validation |
|---|---|---|
| `source` | The ready `VisualTemplateSource` used to build the catalog | Required for dedicated rendering |
| `subjectTemplates` | Subject/state-to-frame definitions read from the source map | Unknown/missing entries resolve to existing fallbacks |
| `stateProfiles` | Supported state vocabulary for subjects | Must preserve the existing reviewable state behavior where mappings exist |
| `fallbackTemplates` | Readable placeholder definitions | Always available independent of source readiness |

**Relationship**: Gameplay and storybook share the same active runtime catalog. The mapper reads the raw coordinate map for that same source but does not mutate the active catalog until a successful reload/selection update.

## Template-Scoped Mapper Session

| Field | Meaning | Validation |
|---|---|---|
| `loadedTemplateId` | Source whose raw image and map are currently being edited | Must match a ready registered source |
| `document` | Loaded coordinate-map document | Parsed and validated against the selected image dimensions |
| `changes` | Pending source-local alignment and/or entry crop changes | Cannot be reused for another template |
| `isDirty` | Whether the selected document has pending changes | Requires discard confirmation before source replacement |

**State transitions**: `unloaded` → `loading(templateId)` → `ready(templateId)`; `ready` → `dirty`; `dirty` → `ready` through reset or successful save; `dirty` → `confirm-switch` before a requested template change; a successful save reloads only `loadedTemplateId`'s JSON map.
