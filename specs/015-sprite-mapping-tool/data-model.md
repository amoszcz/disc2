# Data Model: Sprite Mapping Tool

## Sprite Atlas Source

| Field | Meaning | Validation |
|---|---|---|
| `imageReference` | The WIP PNG paired with the coordinate map | Must resolve to the configured atlas image |
| `actualWidth`, `actualHeight` | Dimensions decoded from the loaded PNG | Both must be positive; used for all crop bounds checks |
| `declaredWidth`, `declaredHeight` | Sheet dimensions declared in the coordinate JSON | Both must be positive; mismatch is a visible warning, not silently replaced |
| `entries` | Coordinate-map records | Must contain at least one entry to be reviewable |
| `sourceStatus` | Loading, ready, or error state | Save is unavailable unless ready and valid |

## Sprite Mapping Entry

| Field | Meaning | Validation |
|---|---|---|
| `entryId` | Stable identity derived from subject, state, direction, and record position | Unique within an atlas source |
| `subjectKind`, `subjectId`, `displayName` | Developer-visible identity | Subject identity must be non-empty |
| `state`, `direction` | Optional animation/context identity | Preserved during save |
| `x`, `y`, `width`, `height` | Current crop rectangle in source-image coordinates | Width/height must be positive; rectangle must remain inside actual image bounds after offset |
| `anchors`, `notes`, extra metadata | Existing mapping details not being edited | Preserved byte-for-value in the saved mapping apart from adjusted x/y |
| `validation` | Current valid/warning/invalid result | Includes invalid dimensions, out-of-bounds crop, and source mismatch context |

## Alignment Offset

| Field | Meaning | Validation |
|---|---|---|
| `offsetX` | Unsaved horizontal source-image translation | Applies identically to every entry x coordinate at preview/save |
| `offsetY` | Unsaved vertical source-image translation | Applies identically to every entry y coordinate at preview/save |
| `isDirty` | Whether an unsaved offset differs from zero | Used for reset, navigation warning, and Save enablement |

**State transitions**: `zero` → `adjusted` through pan; `adjusted` → `zero` through reset; `adjusted` → `saving` → `zero` after validated success; `adjusted` → `invalid` when any adjusted crop fails whole-map validation.

## Amendment: Per-Entry Crop Overrides and Review View

Each entry may have a pending override containing `x`, `y`, `width`, and `height`. Effective crop fields use the override when present and otherwise use the loaded mapping (plus any applicable bulk alignment). The effective rectangle is used consistently for preview, boundary, validation, and persistence.

`zoom` and `viewPan` are review-only state: they alter neither loaded values nor pending crop overrides. A selected-crop canvas drag updates only the selected override's x/y through the current zoom conversion. Width and height are positive integer slider values.

## Mapping Validation Result

| Field | Meaning |
|---|---|
| `scope` | Source-level or entry-level validation |
| `severity` | Valid, warning, or invalid |
| `message` | Developer-readable explanation |
| `entryId` | Affected entry when validation is entry-scoped |

## Saved Mapping Revision

The persisted coordinate map after all entry x/y values receive a valid shared offset. Save preserves entry count, order, crop sizes, anchors, states, directions, labels, notes, and unrelated JSON fields.

## Resolved Mapping Export

| Field | Meaning | Validation |
|---|---|---|
| `document` | Complete mapping document after applying all pending crop overrides | Must be serializable as well-formed JSON; includes loaded data even when no edits are pending |
| `filename` | Developer-visible name for the downloaded JSON file | Must use a `.json` extension |
| `status` | Ready, downloaded, or error feedback | Download is unavailable without a loaded document; failure retains all editor state |

**State transition**: `ready` → `downloaded` after a browser accepts the export action; `ready` → `error` if the browser cannot start it. Neither transition changes mapping edits, validation, selection, or persistence state.
