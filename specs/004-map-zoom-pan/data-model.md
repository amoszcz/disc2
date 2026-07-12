# Data Model: Map Zoom and Panning

## Map Viewport

- **Purpose**: Represents the visible portion of the adventure map and the navigation state needed to render and interact with it.
- **Fields**:
  - `zoomLevel`
  - `panOffsetX`
  - `panOffsetY`
  - `visibleWorldWidth`
  - `visibleWorldHeight`
- **Relationships**:
  - Belongs to the active `GameState`.
  - Depends on the current scenario map dimensions and canvas size.
- **Validation Rules**:
  - Zoom level must stay within the supported min/max range.
  - Pan offsets must keep the visible world area inside map bounds after normalization.

## Zoom Level

- **Purpose**: Captures the current map scale used to make world-space tiles appear larger or smaller on screen.
- **Fields**:
  - `value`
  - `minimum`
  - `maximum`
  - `step`
- **Relationships**:
  - Shapes visible-world size inside the viewport.
  - Used by render and input remapping calculations.
- **Validation Rules**:
  - Must clamp to the supported range.
  - Must change in consistent increments when wheel navigation occurs.

## Zoom Anchor

- **Purpose**: Defines the world-space point the viewport attempts to preserve while zooming.
- **Fields**:
  - `screenX`
  - `screenY`
  - `worldX`
  - `worldY`
- **Relationships**:
  - Derived from pointer position and current viewport state.
  - Applied during zoom recalculation before viewport clamping.
- **Validation Rules**:
  - Must reflect the visible cursor location at the moment zoom starts.
  - Must keep the pointed-at map area as stable as possible after zoom is applied.

## Pan Gesture

- **Purpose**: Represents an active middle-mouse drag interaction that shifts the viewport.
- **Fields**:
  - `originScreenX`
  - `originScreenY`
  - `startingPanOffsetX`
  - `startingPanOffsetY`
  - `isActive`
- **Relationships**:
  - Uses the current viewport as the base for drag updates.
  - Produces updated pan offsets while the gesture is active.
- **Validation Rules**:
  - Only one pan gesture may be active at a time.
  - Gesture updates must not trigger hero selection or movement.

## Map View State

- **Purpose**: The persisted navigation state restored when the adventure map scene becomes active again.
- **Fields**:
  - `viewport`
  - `lastSceneMode`
  - `isDefaultView`
- **Relationships**:
  - Stored in `GameState`.
  - Read by map rendering and input code after scene transitions.
- **Validation Rules**:
  - Must survive transitions away from and back to the adventure map in the same session.
  - Must remain valid for the current scenario dimensions and canvas size.

## Interaction Target

- **Purpose**: The world-space tile or map object selected after converting visible screen coordinates through the viewport.
- **Fields**:
  - `screenPosition`
  - `worldPosition`
  - `targetKind`
  - `targetId`
- **Relationships**:
  - Derived from pointer input and viewport state.
  - Consumed by selection and movement logic.
- **Validation Rules**:
  - The world position must match the tile visually shown under the pointer after zoom/pan.
  - Navigation inputs must not create false interaction targets.

## State Transitions

### Pan Update

1. Player presses the middle mouse button on the map.
2. A `Pan Gesture` records the starting pointer position and current pan offsets.
3. Pointer movement updates the viewport pan offsets.
4. Viewport normalization clamps the visible area to legal map bounds.
5. Releasing the middle mouse button ends the gesture while preserving the new viewport state.

### Zoom Update

1. Player scrolls the mouse wheel over the map.
2. A `Zoom Anchor` resolves the current cursor location in world space.
3. The viewport applies the next zoom level.
4. Pan offsets are recalculated so the anchored world point remains as stable as possible.
5. Viewport normalization clamps the result within legal map bounds.

### Scene Return

1. Player leaves the adventure map for another scene.
2. `Map View State` remains stored in `GameState`.
3. Player returns to the adventure map.
4. Rendering and input reuse the stored viewport state instead of resetting to defaults.
