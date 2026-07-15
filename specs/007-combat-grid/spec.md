# Feature Specification: Grid Combat Tactics

**Feature Branch**: `007-combat-grid`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "improve combat. Combat takes place on 3x4 grid. there are 4 columns. units can have different type of attacks: melee - allows to hit any enemy unit in the adjacent column or if the adjacent column is empty - any unit in the next column. Ranged - allows to atack any enemy unit. Area of effect - allows to attack all enemy units. When there is a units turn the player decides which unit he want to strike. He selects the unit and clicks and then clicks strike. He can also choose to defend in which case the damage to unit is halved until the units next turn to act."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose A Combat Target (Priority: P1)

As a player, I can choose which enemy unit to attack during my acting unit's turn so that combat decisions feel deliberate instead of automatic.

**Why this priority**: Direct target selection is the core interaction change. Without it, the combat upgrade does not deliver the intended tactical control.

**Independent Test**: Start a battle with multiple living enemy units, wait for a player-controlled unit's turn, select a legal target, press strike, and confirm only the chosen target or targets are affected according to the acting unit's attack type.

**Acceptance Scenarios**:

1. **Given** a player-controlled unit is the active unit in battle, **When** the player selects a legal enemy target and presses strike, **Then** the attack resolves against the selected target according to that unit's attack rules.
2. **Given** a player-controlled unit is the active unit in battle, **When** the player has not selected a legal target, **Then** strike cannot resolve an attack.
3. **Given** a player-controlled unit is the active unit in battle, **When** the player selects a different legal enemy target before striking, **Then** the most recently selected target becomes the attack target.

---

### User Story 2 - Use Attack Types With Different Reach (Priority: P1)

As a player, I can use melee, ranged, and area-of-effect units with distinct targeting rules so that unit roles matter during battle.

**Why this priority**: The combat grid only becomes tactically meaningful if different attack types obey different range and coverage rules.

**Independent Test**: Run battles containing each attack type and verify melee units can only strike legal columns, ranged units can strike any living enemy, and area-of-effect units hit all living enemies with one action.

**Acceptance Scenarios**:

1. **Given** a melee unit is acting, **When** the nearest opposing column contains one or more living enemies, **Then** the player may target any living enemy in that adjacent column and may not target deeper columns.
2. **Given** a melee unit is acting, **When** the nearest opposing column is empty, **Then** the player may target any living enemy in the next opposing column.
3. **Given** a ranged unit is acting, **When** the player selects any living enemy unit, **Then** that target can be struck regardless of column.
4. **Given** an area-of-effect unit is acting, **When** the player presses strike, **Then** all living enemy units are hit as part of the same action.

---

### User Story 3 - Defend Instead Of Attacking (Priority: P2)

As a player, I can choose to defend with my active unit so that I can trade offense for survivability when a better attack is not available.

**Why this priority**: Defend adds meaningful tactical depth, but the combat system still has value without it if target selection and attack types already work.

**Independent Test**: During a player-controlled unit's turn, press defend, let that unit be attacked before its next action, and confirm incoming damage is halved until that unit's next turn begins.

**Acceptance Scenarios**:

1. **Given** a player-controlled unit is the active unit, **When** the player presses defend, **Then** that unit spends its turn without attacking and gains temporary damage reduction.
2. **Given** a unit is defending, **When** it is hit before its next turn to act, **Then** the damage applied to that unit is halved.
3. **Given** a unit previously chose defend, **When** that same unit's next turn begins, **Then** the defend state ends before the player chooses its next action.

### Edge Cases

- What happens if a melee unit has no living enemies in either the adjacent opposing column or the next opposing column? The unit should have no legal strike target and must use another available action if one exists.
- What happens if an area-of-effect unit acts when only one enemy remains? The action should still resolve successfully against that single living enemy.
- What happens if the player selects an enemy that becomes defeated before strike resolves? The action should not apply to a defeated target and the player should be required to choose again if the acting unit still has not spent its turn.
- What happens if the acting unit chooses defend while already under a defend effect from a previous turn? Defend should not stack beyond the single active reduction window.
- What happens if a battle starts with fewer than the maximum number of units on one or both sides? Empty grid cells should remain valid empty positions and not block legal targeting beyond the stated column rules.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST run battles on a formation layout with 3 rows and 4 ordered columns per side.
- **FR-002**: The system MUST place participating units into that combat formation in stable positions for the duration of battle unless future features explicitly move them.
- **FR-003**: The system MUST identify an acting unit each turn using the existing battle turn flow.
- **FR-004**: The system MUST allow the player to select a legal enemy target during a player-controlled unit's turn before resolving a strike action.
- **FR-005**: The system MUST prevent strike from resolving when no legal target is selected for an attack type that requires target selection.
- **FR-006**: The system MUST support at least three attack categories: melee, ranged, and area of effect.
- **FR-007**: The system MUST allow a melee unit to target any living enemy unit in the nearest opposing column that contains at least one living enemy.
- **FR-008**: The system MUST allow a melee unit to target any living enemy unit in the next opposing column only when the nearest opposing column contains no living enemies.
- **FR-009**: The system MUST prevent melee units from targeting enemy units deeper than the next opposing column allowed by the melee rule.
- **FR-010**: The system MUST allow a ranged unit to target any living enemy unit regardless of column.
- **FR-011**: The system MUST allow an area-of-effect unit to resolve one strike action against all living enemy units at once.
- **FR-012**: The system MUST let the player spend the acting unit's turn by pressing strike after selecting a legal target or targets.
- **FR-013**: The system MUST let the player spend the acting unit's turn by choosing defend instead of strike.
- **FR-014**: The system MUST apply a defend state that halves incoming damage to that unit until that unit's next turn to act begins.
- **FR-015**: The system MUST remove the defend state from a unit at the start of that unit's next turn.
- **FR-016**: The system MUST prevent defeated units from being selected as legal targets.
- **FR-017**: The system MUST communicate which unit is currently acting and which enemy unit is currently selected as the strike target when selection is required.
- **FR-018**: The system MUST communicate when a player-controlled unit has no legal strike target under its attack rules.
- **FR-019**: The system MUST resolve one action per acting unit turn, where that action is either strike or defend.
- **FR-020**: The system MUST keep non-player-controlled sides able to complete their turns using the same targeting and defend rules, even if their choices are system-driven.

### Key Entities *(include if feature involves data)*

- **Combat Formation Slot**: A single row-and-column position on one side of the battle grid that may hold one unit or remain empty.
- **Attack Category**: The targeting rule assigned to a unit, defining whether it attacks by melee, ranged, or area of effect.
- **Target Selection State**: The current battle interaction state that tracks the acting unit, the selected enemy target if applicable, and whether strike is available.
- **Defend State**: The temporary status on a unit that halves incoming damage until that unit's next turn begins.
- **Battle Formation**: The full arrangement of both sides' units across the 3x4 combat layout.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In battle interaction testing, 100% of player-controlled attack turns require a legal target selection before strike resolves for attack types that need a target.
- **SC-002**: In combat rules testing, 100% of sampled melee attacks obey the adjacent-column and next-column targeting restrictions.
- **SC-003**: In combat rules testing, 100% of sampled ranged attacks can hit any living enemy unit regardless of formation column.
- **SC-004**: In combat rules testing, 100% of sampled area-of-effect attacks damage all living enemy units with a single action.
- **SC-005**: In defend-state testing, 100% of sampled defended hits apply half damage until the defended unit's next turn begins.
- **SC-006**: In usability testing, at least 90% of players can correctly identify the acting unit, choose a legal target, and complete either strike or defend without additional instruction.

## Assumptions

- Battles continue to use the existing turn queue model, with this feature improving targeting and action choice rather than replacing the overall turn structure.
- Each participating unit occupies exactly one formation slot in the combat grid.
- Unit attack category is a stable property of that unit during battle.
- Non-player-controlled sides remain system-driven and do not require manual UI input from the player.
- This first slice improves battle tactics through target selection, attack reach, and defend behavior without introducing movement between combat slots.

## Out of Scope

- Moving units between battle grid slots during combat.
- Additional action types beyond strike and defend.
- New status effects other than the temporary defend reduction.
- Reaction attacks, counterattacks, or opportunity attacks.
- Reworking the broader battle victory rules, experience rewards, or adventure-map battle entry flow.
