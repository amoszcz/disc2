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
- **Validation Rules**:
  - Required gameplay actions must not depend on hover, wheel, or middle mouse input.
  - Tap and drag behavior must resolve to one clear interaction outcome at a time.

## Map View State

- **Purpose**: Represents the current visible portion of the map and its navigation state under responsive canvas sizing.
- **Fields**:
  - `viewport`
  - `panGesture`
  - `isDefaultView`
  - `lastSceneMode`
- **Relationships**:
  - Depends on responsive canvas view metrics for normalization and hit testing.
  - Is updated by map touch interactions and viewport change events.
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

### Viewport Change During Play

1. The browser viewport changes size or orientation.
2. Mobile layout state and responsive canvas view are recalculated.
3. Map viewport state is normalized and the current session remains active.

### Return To Menu On Mobile

1. The player completes a scenario and reaches the victory state.
2. The player activates the return-to-menu control on the mobile layout.
3. The app restores the menu in a mobile-friendly layout and allows another fresh scenario start.
