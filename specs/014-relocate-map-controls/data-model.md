# Data Model: Relocate Map Controls

## Map Action Presentation

The following is a UI projection of existing map state, not a new persisted game entity.

| Field | Meaning | Source / Validation |
|---|---|---|
| `actionId` | Stable identifier for a map action such as End Turn, Zoom In, or Zoom Out | Unique within the active action bar |
| `actionName` | Player-facing name used by tooltip and accessible control name | Must be non-empty and match the action it invokes |
| `icon` | Compact visible representation for the action | Must remain visually distinguishable from other active map actions |
| `isAvailable` | Whether the action may be invoked in the current scene/state | Derived from existing scene and action rules; unavailable controls are disabled |
| `placement` | Vertical position in the map action bar | Preserves a predictable order without altering action rules |

**Relationships**: The action bar contains ordered Map Action Presentations. Each presentation delegates to the existing map action handler; it does not own game-state mutations.

**State transitions**: An action can transition between available and unavailable as the active scene or game state changes. Activation delegates to existing game behavior only when available.

## Battle Queue Entry Presentation

The following is a view of the existing battle queue, not a new combat state.

| Field | Meaning | Source / Validation |
|---|---|---|
| `unitId` | Identifier of the queued battle participant | Must reference a current battle participant eligible to act |
| `queueIndex` | Zero-based current position in turn order | Derived from `battle.turnQueue`; must preserve its order |
| `unitName` | Tooltip and accessible label text | Derived from the current scenario unit; must be non-empty |
| `isActive` | Whether this entry is the current acting unit | True only when `unitId` equals `battle.activeUnitId` |
| `visualTemplate` | Dedicated visual template or fallback visual descriptor | Resolved through the existing unit visual-template resolver in battle context |

**Relationships**: A Battle Turn Queue contains ordered Battle Queue Entry Presentations. Each entry references one scenario unit and one resolved visual-template descriptor.

**State transitions**: When the battle engine advances, removes a defeated unit, or ends the battle, the presentation is recalculated from the current battle state. The UI never advances or removes queue entries itself.

## Tooltip Presentation

| Field | Meaning | Validation |
|---|---|---|
| `subjectType` | Whether the tooltip describes a map action or battle unit | Must correspond to a rendered control or queue entry |
| `label` | Visible hover text | For action icons: action name. For queue entries: unit name. Must be non-empty. |
| `isHoverCapable` | Whether the current device can trigger hover behavior | Tooltip remains supplemental; no required action depends on it. |
