# Feature Specification: Core Map Loop

**Feature Branch**: `001-fantasy-strategy-game`

**Created**: 2026-07-12

**Status**: Draft

**Input**: Derived from the umbrella vision in `001-fantasy-strategy-game`, focused on the first playable slice: turn passing, hero movement, map pickups, guarded sites, simple battles, and default victory.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Take a Complete Turn on the Adventure Map (Priority: P1)

As a player, I can take a full turn with a hero on the adventure map so I can move, collect resources, and end my turn with visible progress.

**Why this priority**: This is the smallest slice that creates a playable strategy loop and proves the world map interaction model.

**Independent Test**: Start a scenario with one hero, move across traversable tiles, collect map pickups, end the turn, and begin the next turn with state preserved.

**Acceptance Scenarios**:

1. **Given** a scenario has started and it is the player's turn, **When** the player selects a hero and chooses a valid destination within movement range, **Then** the hero moves to the destination and remaining movement is updated.
2. **Given** a hero enters a tile containing a one-time resource pickup, **When** movement resolves, **Then** the resource is added to the player's stockpile and the pickup disappears from the map.
3. **Given** the player has finished acting, **When** the player ends the turn, **Then** control advances to the next side and the current scenario state is preserved.

---

### User Story 2 - Defeat Guards to Open the Map (Priority: P2)

As a player, I can challenge stationary neutral guards so I can unlock blocked resource sites and continue expanding.

**Why this priority**: Guards create meaningful obstacles and introduce combat without requiring the entire city or economy layer first.

**Independent Test**: Move a hero to a guarded site, enter combat, defeat the guards, and verify the site becomes accessible afterward.

**Acceptance Scenarios**:

1. **Given** a neutral guard force blocks a location, **When** a hero attempts to enter that location, **Then** the game starts a battle instead of granting immediate access.
2. **Given** the player wins the guard battle, **When** combat ends, **Then** the guarded location becomes available for capture or entry.
3. **Given** the player loses the guard battle, **When** combat ends, **Then** the guarded location remains blocked and the player's losses are reflected on the map.

---

### User Story 3 - Resolve a Minimal Tactical Battle (Priority: P3)

As a player, I can resolve a simple turn-based battle with queue-driven unit turns so I can understand combat and earn progress through victory.

**Why this priority**: A minimal combat loop is necessary for guarded objectives and gives the first slice real strategic stakes.

**Independent Test**: Trigger a battle, verify units act in agility order, allow one action per unit turn, resolve victory or defeat, and return the outcome to the map.

**Acceptance Scenarios**:

1. **Given** two forces enter battle, **When** combat starts, **Then** all participating units are placed in a visible queue ordered by agility.
2. **Given** it is a unit's turn, **When** the player chooses one legal action, **Then** that action resolves and the unit's turn ends.
3. **Given** all units on one side are defeated, **When** the battle resolves, **Then** the game declares a winner and applies the result to the scenario.

### Edge Cases

- What happens when a player tries to move a hero farther than the remaining movement allowance? The move must be rejected.
- What happens when a hero reaches a guarded tile with no battle-capable units? Entry must be blocked and the battle must not start.
- What happens when two units have equal agility in battle? A deterministic tie-break rule must decide order consistently.
- What happens when the player ends a turn without moving every hero? The turn must still advance normally.
- What happens when the last remaining enemy force is defeated in a default elimination scenario? The scenario must end immediately with victory.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a player to start a scenario with a predefined map, at least one controllable hero, hostile or neutral forces, and a default elimination victory condition.
- **FR-002**: The system MUST support turn-based play where one side acts at a time and can explicitly end its turn.
- **FR-003**: The system MUST allow a player-controlled hero to move across valid map spaces during that side's turn.
- **FR-004**: The system MUST track and enforce a hero's movement allowance for the current turn.
- **FR-005**: The system MUST allow heroes to collect one-time map resource pickups.
- **FR-006**: The system MUST maintain a player resource stockpile that updates immediately after resource collection.
- **FR-007**: The system MUST support stationary neutral guard forces on the map.
- **FR-008**: The system MUST block access to guarded locations until their guard force is defeated.
- **FR-009**: The system MUST start a battle when a hero attempts to enter a guarded location.
- **FR-010**: The system MUST create a battle turn queue for all participating units.
- **FR-011**: The system MUST order the battle queue by unit agility with a deterministic tie-break rule.
- **FR-012**: The system MUST allow each unit to perform exactly one action on its turn.
- **FR-013**: The system MUST resolve battle end conditions when one side has no remaining battle-capable units.
- **FR-014**: The system MUST apply battle results back to the scenario state, including surviving units, defeated units, and guarded-location access.
- **FR-015**: The system MUST allow a hero to claim or enter a formerly guarded location after winning the associated battle.
- **FR-016**: The system MUST support at least one simple progression reward from successful combat, such as experience tracked for the hero.
- **FR-017**: The system MUST evaluate the default elimination victory condition after battle and at end-of-turn boundaries.
- **FR-018**: The system MUST end the scenario immediately when the default elimination victory condition is satisfied.
- **FR-019**: The system MUST display the current player's active hero, remaining movement, resource totals, turn ownership, and battle queue when relevant.
- **FR-020**: The system MUST preserve scenario state correctly across repeated turns until the scenario ends.

### Key Entities *(include if feature involves data)*

- **Scenario**: The current playable map session with sides, units, pickups, guards, and victory state.
- **Player**: The acting side with heroes, resources, and victory or defeat status.
- **Hero**: A controllable map character with movement allowance and an attached combat force.
- **Unit**: A combat participant with agility, battle actions, and defeat state.
- **Resource Pickup**: A one-time collectible map object that adds to the player's stockpile.
- **Guard Force**: A stationary neutral defender attached to a blocked location.
- **Guarded Location**: A map location that cannot be entered or claimed until its guard force is defeated.
- **Battle**: A tactical encounter with participants, queue order, actions, and outcome.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation testing, 100% of sampled turns correctly preserve hero position, remaining resources, and defeated or cleared map objects after turn end.
- **SC-002**: In usability testing, 90% of first-time testers can move a hero, collect a pickup, and end a turn without assistance.
- **SC-003**: In combat testing, 100% of sampled battles enforce one action per unit turn and follow the displayed agility-based queue order.
- **SC-004**: In map progression testing, 100% of guarded locations remain blocked before victory and become available immediately after the guards are defeated.
- **SC-005**: In scenario completion testing, 100% of runs end immediately once all enemy forces required by the default elimination rule are removed.

## Assumptions

- This slice intentionally excludes city management, building upgrades, recruitment, and multi-city economy systems.
- The first slice may use a small handcrafted scenario with a limited roster of units and a limited number of guarded objectives.
- Neutral forces remain stationary and act only when combat begins.
- Combat rewards can be minimal as long as they prove progression is being tracked.

## Out of Scope

- City construction, building upgrades, buff-granting services, and unit recruitment.
- Multi-hero army management rules beyond what is necessary to support a single playable hero force.
- Scenario-specific victory conditions beyond the default elimination rule.
- Advanced combat mechanics such as spells, retaliation chains, terrain effects, or morale systems.
