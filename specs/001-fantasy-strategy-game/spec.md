# Feature Specification: Fantasy Strategy Game Vision

**Feature Branch**: `001-fantasy-strategy-game`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "Build a web based game (canvas 2d). Turn based. The game should be similar to Disciples 2: Traversing map, gathering, resources, conquering cities. In cities there should be buildings, which can be upgraded using resources which can either produce resources, give permanent or temporary buffs to visiting heroes or units, or allow to recruit units. The heroes travel with their units and can gather resources, occupy resource producing areas. The hero can have up to 6 units, which can be placed in 6 slots and some units take 2 slots. In battle there are turns and there is a queue in which all units are placed and position in queue depends on unit agility. When there is unit turn the unit can perform 1 action. The game is played in scenarios, each scenario may have different victory conditions, with default being eliminating all enemy players. In addition to players that move on map once per turn there should be npc units, stationary, which main purpose is to provide players with a way to gather experience for heroes and their units. They may also guard some places like resource places, empty cities and so on."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lead a Hero Across the World Map (Priority: P1)

As a player, I can control heroes on a turn-based world map so I can explore, gather resources, capture strategic locations, and push toward winning a scenario.

**Why this priority**: Hero-led exploration and conquest define the product identity and connect every other system into one strategy loop.

**Independent Test**: Play through a scenario where a hero moves across the map, claims resources and sites, conquers locations, and advances toward a defined victory condition.

**Acceptance Scenarios**:

1. **Given** a scenario is in progress, **When** a player takes actions with a hero on their turn, **Then** the hero can move, interact with map objects, and contribute to scenario progress.
2. **Given** a player captures strategic locations during play, **When** the turn resolves, **Then** ownership and control reflect the current state of the scenario.

---

### User Story 2 - Grow Power Through Cities and Armies (Priority: P2)

As a player, I can develop cities and assemble armies so I can improve my economy, strengthen my roster, and prepare for harder conflicts.

**Why this priority**: Cities, buildings, and army composition create the long-term strategy layer that separates the game from a simple skirmish experience.

**Independent Test**: Play a scenario where the player upgrades cities, unlocks useful effects, recruits units, and assigns them into a legal hero army.

**Acceptance Scenarios**:

1. **Given** a player owns a city, **When** they invest resources in development, **Then** the city grants its configured production, buff, or recruitment benefits.
2. **Given** a player recruits units for a hero, **When** army composition is updated, **Then** slot limits and unit size rules are enforced.

---

### User Story 3 - Win Battles and Gain Experience (Priority: P3)

As a player, I can fight turn-based battles against enemies and neutral guards so I can clear objectives, protect territory, and improve heroes and units over time.

**Why this priority**: Tactical combat is a central fantasy for the game and provides the main source of risk, reward, and progression.

**Independent Test**: Enter combat from the world map, resolve battle turns in queue order, defeat a guarding force, and award experience to surviving participants.

**Acceptance Scenarios**:

1. **Given** hostile forces meet in a scenario, **When** battle starts, **Then** the game resolves a turn-based combat encounter using unit order rules.
2. **Given** a player wins a battle for an objective, **When** combat ends, **Then** the map state and participant progression update to reflect the result.

### Edge Cases

- What happens when a player wins through a custom scenario objective before enemy elimination? The custom objective must immediately override the default end condition.
- What happens when a city, site, or guarded objective changes ownership repeatedly during a scenario? Only the current owner must receive ongoing benefits.
- What happens when a hero army cannot legally fit additional units because of slot limits or two-slot units? The assignment must be blocked.
- What happens when battle order includes units with identical agility? A deterministic tie-break rule must keep resolution predictable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support scenario-based play with a world map, participating sides, starting state, and victory conditions.
- **FR-002**: The system MUST support turn-based hero movement and map interaction.
- **FR-003**: The system MUST allow heroes to gather resources, capture locations, and engage hostile forces.
- **FR-004**: The system MUST support cities that can change ownership and provide strategic value to the owning player.
- **FR-005**: The system MUST support city buildings and upgrades that can produce resources, grant buffs, or unlock recruitment.
- **FR-006**: The system MUST support heroes leading armies with slot-based composition rules, including units that occupy more than one slot.
- **FR-007**: The system MUST support stationary neutral guard forces that block access to map objectives until defeated.
- **FR-008**: The system MUST support turn-based battles with queue order determined by unit agility.
- **FR-009**: The system MUST limit each unit to one action per battle turn.
- **FR-010**: The system MUST award progression benefits from successful battles, including experience for heroes or units as defined by the scenario.
- **FR-011**: The system MUST support a default victory condition of eliminating all enemy players.
- **FR-012**: The system MUST support scenario-specific victory conditions that can replace or extend the default condition.
- **FR-013**: The system MUST preserve scenario state across turns, including ownership, armies, buffs, resources, and progression.
- **FR-014**: The system MUST present players with the current scenario state, including controlled heroes, cities, resources, and objective progress.
- **FR-015**: The product roadmap MUST allow the vision to be delivered through smaller independently planable feature slices rather than as one implementation unit.

### Key Entities *(include if feature involves data)*

- **Scenario**: A self-contained game session with map layout, starting state, and victory rules.
- **Player**: A side in the scenario with resources, heroes, owned locations, and defeat status.
- **Hero**: A map unit that travels, interacts with objectives, leads armies, and enters battle.
- **Unit**: A combatant with slot size, agility, combat options, and progression.
- **Army**: A hero's assigned set of units, constrained by slot rules.
- **City**: A capturable settlement that can hold buildings, upgrades, and recruitment options.
- **Building**: A city improvement that changes production, buffs, or recruitment availability.
- **Resource Site**: A capturable location that provides ongoing value to its owner.
- **Guard Force**: A stationary non-player defender that blocks a location.
- **Battle**: A tactical encounter with participants, turn order, actions, and results.
- **Victory Condition**: A rule that determines when a scenario ends in success or failure.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The game vision is decomposed into independently planable feature specs that each describe a shippable gameplay slice.
- **SC-002**: Each planned gameplay slice can be traced back to one or more core product pillars: map conquest, city growth, army management, tactical combat, or scenario objectives.
- **SC-003**: Playtesters can identify the intended strategic loop of exploration, growth, conflict, and victory from the combined feature set.
- **SC-004**: The overall product scope remains bounded enough that at least one focused implementation slice can be planned and built without requiring every system in the vision at once.

## Assumptions

- This document serves as an umbrella product vision rather than the next implementation target.
- Detailed implementation planning will happen in smaller follow-up specs focused on narrow, testable gameplay slices.
- The first implementation slice should prioritize a playable map loop over full city management or full tactical depth.
- The long-term design remains scenario based rather than open-ended sandbox play.

## Out of Scope

- Detailed implementation sequencing for every gameplay system in one plan.
- Treating the full product vision as a single implementation milestone.
- Locking every future balance number, content list, or interface detail at the vision level.
