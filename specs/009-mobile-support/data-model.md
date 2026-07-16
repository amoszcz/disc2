# Data Model: Mobile Browser Support

## Mobile Session

- **Purpose**: Represents one game session being played in a mobile browser from menu entry through scenario completion and return to menu.
- **Fields**:
  - `sceneMode`
  - `availableScenarioOptions`
  - `selectedHeroId`
  - `activePlayerId`
  - `messageLog`
  - `winnerPlayerId`
- **Relationships**:
  - Owns one active menu, map, battle, or victory scene at a time.
  - Uses one mobile layout state and one viewport interaction mode while active on a mobile browser.
- **Validation Rules**:
  - The session must stay playable without mouse or keyboard input.
  - Viewport changes must not discard the session unless the player intentionally starts a new run.

## Mobile Layout State

- **Purpose**: Represents how the game shell is arranged for the current mobile viewport.
- **Fields**:
  - `viewportWidth`
  - `viewportHeight`
  - `layoutMode`
  - `sidebarPlacement`
  - `canvasDisplayWidth`
  - `canvasDisplayHeight`
- **Relationships**:
  - Shapes how menu, map, battle, and victory UI are presented.
  - Feeds canvas sizing and viewport normalization behavior.
- **Validation Rules**:
  - The layout must keep required controls visible or reachable on narrow screens.
  - `layoutMode` must switch predictably for supported narrow viewports.
  - Canvas display dimensions must stay in sync with the visible container.

## Responsive Canvas View

- **Purpose**: Represents the live canvas metrics used for rendering and hit testing across mobile and desktop layouts.
- **Fields**:
  - `pixelWidth`
  - `pixelHeight`
  - `displayWidth`
  - `displayHeight`
  - `deviceScaleFactor`
- **Relationships**:
  - Works with map viewport state and battle hit testing.
  - Is recalculated from the current layout state when viewport size changes.
- **Validation Rules**:
  - Rendering and input translation must use the same effective canvas metrics.
  - Canvas metrics must update when the viewport changes size.

## Touch Interaction

- **Purpose**: Represents a player input on a touch-capable device that must map to an existing game action.
- **Fields**:
  - `interactionType`
  - `screenPosition`
  - `targetKind`
  - `targetId`
  - `gesturePhase`
- **Relationships**:
  - Can select menu options, heroes, map tiles, battle targets, or action buttons.
  - May update map viewport state when used for navigation gestures.
  - May contribute one touch point within a multi-touch mobile zoom gesture.
- **Validation Rules**:
  - Required gameplay actions must not depend on hover, wheel, or middle mouse input.
  - Tap and drag behavior must resolve to one clear interaction outcome at a time.

## Mobile Zoom Gesture

- **Purpose**: Represents a two-finger gesture on the main play surface that changes map zoom during active mobile play.
- **Fields**:
  - `firstTouchPosition`
  - `secondTouchPosition`
  - `initialDistance`
  - `currentDistance`
  - `zoomDirection`
  - `anchorScreenPosition`
- **Relationships**:
  - Uses two touch interactions as inputs.
  - Updates map view state through the same viewport zoom model used by other navigation inputs.
- **Validation Rules**:
  - The gesture must only affect the map when both touches are on the play surface.
  - The gesture must remain bounded by the existing map zoom limits.
  - The gesture must not trigger browser page zoom while interacting with the play surface.

## Map View State

- **Purpose**: Represents the current visible portion of the map and its navigation state under responsive canvas sizing.
- **Fields**:
  - `viewport`
  - `panGesture`
  - `zoomGesture`
  - `isDefaultView`
  - `lastSceneMode`
- **Relationships**:
  - Depends on responsive canvas view metrics for normalization and hit testing.
  - Is updated by map touch interactions, mobile zoom gestures, and viewport change events.
- **Validation Rules**:
  - Hit testing must stay correct after resize and orientation change.
  - Map pan and zoom behavior must remain bounded by scenario map dimensions.

## Viewport Change Event

- **Purpose**: Represents a runtime change in visible browser size that can affect layout and canvas sizing.
- **Fields**:
  - `previousWidth`
  - `previousHeight`
  - `nextWidth`
  - `nextHeight`
  - `orientationKind`
- **Relationships**:
  - Triggers mobile layout recalculation.
  - Triggers map viewport normalization without resetting scenario progress.
- **Validation Rules**:
  - Applying a viewport change must preserve scenario and battle state.
  - Required controls must remain reachable after recalculation.

## State Transitions

### Mobile Launch

1. The player opens the game in a mobile browser.
2. The game shell derives mobile layout state from the current viewport.
3. The main menu appears in a mobile-friendly arrangement.

### Scenario Start On Mobile

1. The player taps a scenario option in the main menu.
2. A fresh scenario session starts.
3. Responsive canvas metrics and map viewport state are initialized for the current mobile viewport.

### Touch Gameplay Interaction

1. The player taps or drags within the canvas or action controls.
2. The input layer resolves the interaction into an existing menu, map, battle, or viewport action.
3. The active scene updates without requiring desktop-only controls.

### Two-Finger Zoom Interaction

1. The player places two touches on the map canvas during an active mobile scenario.
2. The input layer identifies the gesture as zoom input and measures the change in finger spacing around the active anchor point.
3. The map viewport zoom level updates without invoking browser page zoom or discarding current session state.

### Viewport Change During Play

1. The browser viewport changes size or orientation.
2. Mobile layout state and responsive canvas view are recalculated.
3. Map viewport state is normalized and the current session remains active.

### Return To Menu On Mobile

1. The player completes a scenario and reaches the victory state.
2. The player activates the return-to-menu control on the mobile layout.
3. The app restores the menu in a mobile-friendly layout and allows another fresh scenario start.
