# Data Model: Animate Path Movement

## Game Settings

Persisted player preferences, loaded at application startup and retained when a scenario is created, ended, or replaced.

| Field | Values | Rules |
|---|---|---|
| `movementBehavior` | `animated`, `immediate` | Defaults to `animated`; determines the next confirmed route's execution mode. |
| `visualTemplateId` | A ready template identifier | Defaults to configured default; invalid or unavailable stored values fall back to the configured default. |

**Persistence rules**:

- Store one versioned, normalized record in browser-local storage.
- Read failures, malformed records, and unavailable template IDs must not prevent the game from opening.
- A setting update is immediately written and becomes the source for later game sessions.

## Traversal State

Ephemeral state for a single in-progress animated route. It is never persisted.

| Field | Description |
|---|---|
| `heroId` | The selected hero that owns this movement action. |
| `remainingSteps` | Ordered legal route steps still to complete. |
| `destinationPosition` | Original selected route destination, used for feedback and continuation. |
| `triggerSource` | Whether the action came from manual confirmation or end-turn auto-advance. |
| `status` | `active`, `stopped`, or `completed`. |

**State transitions**:

```text
idle → active → active (one legal step completes) → completed
               ↘ stopped (unaffordable, invalid, encounter, world transition, cancellation)
```

- Only one traversal may be `active` at a time.
- The active hero cannot begin another map movement action.
- Settings changes do not alter an already active traversal.

## Settings Navigation Context

| Field | Description |
|---|---|
| `returnScene` | The menu or map scene to restore when Settings closes. |
| `returnMapView` | Existing map viewport state, retained when Settings opened from gameplay. |

`returnScene` is transient. Entering Settings must not reset scenario, route, resources, selected hero, or map view.

## Relationships

```text
Game Settings ── selects ──> Active Visual Template
Game Settings ── selects ──> Movement Behavior
Traversal State ── owns ──> Hero
Traversal State ── consumes ──> Route Steps
Settings Navigation Context ── restores ──> Menu or Map scene
```
