# Feature Specification: Unit And Object Animation States

**Feature Branch**: `012-unit-animation-states`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "lets go with your suggestions in your last response"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Read Hero Movement On The Map (Priority: P1)

As a player, I can see the active hero change animation state while standing, starting movement, walking, stopping, interacting, getting hurt, and perishing so that map movement feels intentional and directionally readable.

**Why this priority**: Hero movement is the most frequently observed animated behavior in the exploration loop, and directional state clarity will influence every later animation asset decision.

**Independent Test**: Start a scenario, move a hero in each supported direction, trigger at least one interaction, and verify through acceptance-style rendering checks that the correct hero animation state is selected and remains readable without changing gameplay rules.

**Acceptance Scenarios**:

1. **Given** a hero is standing still on the map, **When** the map scene renders, **Then** the hero is shown in a directional idle state rather than a generic static pose.
2. **Given** a hero begins moving upward, downward, leftward, or rightward, **When** the movement begins and continues, **Then** the hero transitions through a movement start state and a directional walking state for that direction.
3. **Given** a moving hero finishes a route or movement is interrupted, **When** movement ends, **Then** the hero transitions through a directional stop state and returns to an idle state.
4. **Given** a hero claims, enters, or otherwise interacts with a relevant map location, **When** that interaction is shown, **Then** the hero uses an interaction-oriented state rather than remaining visually identical to idle movement.

---

### User Story 2 - Read Combat And Defeat States Clearly (Priority: P1)

As a player, I can see battle units communicate readiness, attacks, ranged actions, spell-like actions, defending, taking damage, victory, and perishing so that combat turns are easier to follow at a glance.

**Why this priority**: Battle readability depends on knowing what the acting unit is doing now and what just happened to the target, especially once the game includes more visual variety.

**Independent Test**: Run battle-focused rendering and gameplay checks that exercise ready, attack, defend, hit, victory, and perish behaviors and confirm that the system selects the expected unit state without changing battle resolution.

**Acceptance Scenarios**:

1. **Given** a battle unit is waiting for its turn, **When** the battle scene renders, **Then** the unit is shown in a stable idle or ready state rather than sharing the same presentation as an active attack.
2. **Given** a melee, ranged, or area-attacking unit performs its action, **When** the action is shown, **Then** the acting unit uses an appropriate attack-oriented state that distinguishes the action from defending or waiting.
3. **Given** a unit receives damage or chooses to defend, **When** the result is shown, **Then** the unit uses a hit or defend state that remains readable to the player.
4. **Given** a unit wins or is defeated, **When** battle outcome states are shown, **Then** victory and perish states are visually distinct from idle and attack states.

---

### User Story 3 - Maintain A Shared State Vocabulary For Assets (Priority: P2)

As a developer or asset creator, I can rely on a clear list of supported animation states for heroes, battle units, and map objects so that new art can be prepared consistently without guessing what the game expects.

**Why this priority**: A shared animation vocabulary prevents asset churn, keeps rendering rules aligned with gameplay meaning, and reduces rework before more advanced art production begins.

**Independent Test**: Review the state catalog against the current supported heroes, units, and map objects and verify through contract-style checks that each supported subject category can resolve either a dedicated state or a documented fallback for required moments.

**Acceptance Scenarios**:

1. **Given** a new hero animation set is prepared, **When** the asset creator checks the supported state catalog, **Then** the required map states and directional variants are explicitly defined.
2. **Given** a new battle unit animation set is prepared, **When** the asset creator checks the supported state catalog, **Then** the required combat states are explicitly defined.
3. **Given** a static or interactable map object is prepared, **When** the asset creator checks the supported state catalog, **Then** the object state variants such as idle, active, blocked, open, claimed, or depleted are defined only where they matter to gameplay.
4. **Given** a dedicated animation state is missing during incremental rollout, **When** the game renders that moment, **Then** a stable fallback state remains available instead of leaving the subject blank or undefined.

### Edge Cases

- What happens when a hero changes direction multiple times during one route? The chosen directional state should update cleanly to the most recent movement direction without losing readability.
- What happens when a state exists for one direction but not another? The system should still present a readable fallback rather than leaving the hero or unit without a valid visible state.
- What happens when a unit type cannot logically use every combat action style? The state catalog should require only the action states relevant to that unit's combat role.
- What happens when an object has no meaningful active variation? The object should be allowed to remain on a stable idle state without forcing unnecessary variants.
- What happens when gameplay events resolve too quickly to show every transitional state for long? The state system should still preserve a valid sequence that communicates the event clearly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST define a supported animation-state catalog for map heroes, battle units, and eligible map objects.
- **FR-002**: The system MUST support directional hero map states for `idle`, `start-move`, `walk`, and `stop-move` in the directions `up`, `down`, `left`, and `right`.
- **FR-003**: The system MUST support non-directional hero map states for `interact`, `victory`, `hurt`, and `perish`.
- **FR-004**: The system MUST support battle-unit states for `idle`, `ready`, `attack`, `cast`, `shoot`, `hit`, `defend`, `wait`, `victory`, and `perish`.
- **FR-005**: The system MUST allow a battle unit to use only the subset of supported combat states that match its gameplay role, while preserving a documented fallback for unsupported states.
- **FR-006**: The system MUST support object-state variants where gameplay meaning benefits from them, including `idle`, `active`, `inactive`, `blocked`, `open`, `claimed`, `depleted`, `damaged`, `destroyed`, `highlighted`, and `selected`.
- **FR-007**: The system MUST define which state variants are required versus optional for each supported subject category so asset creators can prepare content consistently.
- **FR-008**: The system MUST keep the animation-state vocabulary aligned with current gameplay meaning and MUST NOT require new gameplay rules in order to adopt the catalog.
- **FR-009**: The system MUST preserve a readable fallback visual state when a dedicated animation state is unavailable during incremental rollout or testing.
- **FR-010**: The system MUST keep hero, unit, and object state presentations visually distinguishable enough for players to understand standing, moving, acting, defending, winning, and defeat moments.
- **FR-011**: The system MUST allow the project to defer detailed frame-count decisions per state until asset planning and implementation, without changing the approved state vocabulary.
- **FR-012**: The system MUST support an MVP animation scope in which heroes use `idle`, `walk`, `attack`, and `perish`, battle units use `idle`, `attack`, `hit`, and `perish`, and objects use `idle` plus one gameplay-relevant variant where needed.

### Key Entities *(include if feature involves data)*

- **Animation State Catalog**: The approved list of named states that the game can request for heroes, battle units, and map objects.
- **Hero Directional State**: A map-hero state that combines a motion meaning such as idle or walk with one of the supported facing directions.
- **Battle Unit State Profile**: The set of combat-oriented states relevant to a given unit type, such as attack, shoot, defend, hit, victory, or perish.
- **Object State Variant**: A gameplay-relevant visual state for a static or interactable map object, such as blocked, open, active, claimed, or depleted.
- **Fallback State**: A stable backup presentation used when a dedicated state variant is not yet available.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In state-catalog review, 100% of currently supported hero map behaviors are covered by an approved named state without requiring ad hoc one-off state definitions.
- **SC-002**: In battle-state review, 100% of currently supported combat action categories map to an approved battle-unit state or documented fallback.
- **SC-003**: In object-state review, 100% of current interactable map object types are assigned either a required state set or an explicit idle-only decision.
- **SC-004**: In rendering validation, 100% of required hero, unit, and object moments remain visible and readable even when some dedicated animation states are missing.
- **SC-005**: In readability checks, at least 90% of tested observers can correctly tell the difference between idle, movement, attack, defend, victory, and perish moments for currently supported content.

## Assumptions

- The existing gameplay rules for map travel, battle turns, defending, interaction, and defeat remain unchanged; this feature only defines the visual state vocabulary that future animation assets should follow.
- Directional hero variants are only required for the four cardinal directions because current map movement is communicated through those directions clearly enough for the first slice.
- Battle units do not currently require directional facing variants because the most important near-term need is action readability rather than orientation complexity.
- Not every object needs every possible state variant; only states with gameplay meaning for that object type need to be supported.
- Detailed frame counts, timing, interpolation style, and asset packing decisions can be made later during planning and implementation as long as they respect the approved state catalog.

## Out of Scope

- Final frame counts, playback timing, and sprite-sheet packing rules for every state.
- New gameplay mechanics created only to justify additional animation states.
- Cinematic transitions, particle systems, screen shake, or advanced VFX polish.
- Full animation coverage for future factions, creatures, buildings, or object types not yet supported in the current game.
- Audio synchronization, lip-sync, or cutscene choreography.
