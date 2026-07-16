# Feature Specification: Dedicated Visual Templates

**Feature Branch**: `011-unit-tile-templates`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "for each unit and other objects there should be a dedicated template of how the unit looks like - stored as svg or png. For testing we can keep very simple objects as they are now but for the game they should use dedicated template - as for now only slightly more advanced then the current. As for tiles there also should be a template of how the tile looks like - stored as svg or template."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recognize Units And Map Objects Visually (Priority: P1)

As a player, I can see dedicated visuals for units and interactable map objects so that the game world reads as intentional game art instead of generic placeholder blocks.

**Why this priority**: Unit and object readability is the most visible missing part of the current presentation. Without it, the game still functions, but it does not feel like a cohesive strategy game.

**Independent Test**: Start each current scenario and verify through acceptance-style rendering checks that every visible unit and supported map object is drawn from a dedicated visual template rather than the generic fallback style when the dedicated asset is available.

**Acceptance Scenarios**:

1. **Given** a scenario contains a hero unit, enemy unit, or supported map object, **When** the scene renders, **Then** that entity is shown with its own dedicated visual template instead of the generic placeholder look.
2. **Given** multiple unit or object types are visible at the same time, **When** the player views the map or battle scene, **Then** the different entity types remain visually distinguishable from one another.
3. **Given** a dedicated visual template is not yet available for a supported entity, **When** the scene renders during testing or incomplete content development, **Then** the entity still remains visible through a clear fallback presentation instead of disappearing.

---

### User Story 2 - Read Terrain From Tile Artwork (Priority: P1)

As a player, I can distinguish terrain tiles by their own visual templates so that roads, plains, grass, woods, mud, rivers, lakes, and mountains are easier to read at a glance.

**Why this priority**: Terrain readability directly affects movement planning and map comprehension, especially now that terrain cost and passability matter.

**Independent Test**: Load the terrain-heavy scenario and confirm that each supported terrain type renders with a dedicated tile template that stays recognizable during ordinary map play.

**Acceptance Scenarios**:

1. **Given** the map contains multiple terrain types, **When** the player views the map, **Then** each supported terrain type is shown with its own dedicated tile template.
2. **Given** traversable and non-traversable terrain are adjacent, **When** the player inspects the map visually, **Then** the difference between them remains understandable without relying only on text overlays.
3. **Given** the map is viewed at the currently supported zoom levels, **When** the player pans or zooms the map, **Then** tile visuals remain readable enough to support navigation decisions.

---

### User Story 3 - Keep A Lightweight Placeholder Path For Testing (Priority: P2)

As a developer or tester, I can keep using simple placeholder visuals while improved templates are being introduced so that content work and gameplay testing do not block each other.

**Why this priority**: This keeps the feature deliverable in small slices and avoids forcing polished art completion before gameplay work can continue.

**Independent Test**: Run rendering flows with incomplete or intentionally simplified asset coverage and verify the game still renders usable visuals for required entities and tiles.

**Acceptance Scenarios**:

1. **Given** the polished visual set is incomplete, **When** a tester loads the game, **Then** fallback placeholder visuals continue to render for any missing unit, object, or tile template.
2. **Given** a dedicated template exists for one entity type but not another, **When** both appear in the same scene, **Then** the dedicated template is used where available and the fallback is used only for the missing one.
3. **Given** the project is being tested before final art polish, **When** the player runs the current scenarios, **Then** the visual system remains stable and does not require every asset to be final-quality before the game can be played.

### Edge Cases

- What happens when a supported unit, object, or tile type has no dedicated visual template yet? A clear fallback visual should appear so the scene stays playable.
- What happens when two entities share similar gameplay roles but need to remain distinguishable? Their dedicated templates should still preserve visual differentiation.
- What happens when a tile template is visually busy at small on-screen sizes? The template should still preserve the terrain's identity at ordinary play zoom levels.
- What happens when a dedicated visual template is temporarily unavailable or fails to load? The player should still see a readable fallback instead of a blank or broken scene element.
- What happens when testing still depends on today's simple visuals? The placeholder path should remain available until the dedicated set is ready.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support a dedicated visual template for each supported unit type shown in the game.
- **FR-002**: The system MUST support a dedicated visual template for each supported non-unit map object type shown in the game.
- **FR-003**: The system MUST support a dedicated visual template for each supported terrain tile type shown in the game.
- **FR-004**: The system MUST use the dedicated visual template for a supported entity or tile whenever that template is available.
- **FR-005**: The system MUST preserve a fallback visual presentation for units, objects, and tiles when a dedicated template is unavailable during testing or incomplete content development.
- **FR-006**: The system MUST keep supported unit types visually distinguishable from other unit types during normal play.
- **FR-007**: The system MUST keep supported map object types visually distinguishable from surrounding terrain during normal play.
- **FR-008**: The system MUST keep supported terrain tile types visually distinguishable from one another during normal play.
- **FR-009**: The system MUST allow dedicated visual templates to be stored as standalone reusable image assets for units, objects, and tiles.
- **FR-010**: The system MUST support the project's initial dedicated visual templates being simple, slightly more advanced evolutions of the current placeholder style rather than requiring final polished artwork immediately.
- **FR-011**: The system MUST render scenes successfully even when the available visual set mixes dedicated templates and fallback placeholders.
- **FR-012**: The system MUST keep battle scenes, map scenes, and terrain-heavy scenarios readable when dedicated visual templates are introduced.

### Key Entities *(include if feature involves data)*

- **Unit Visual Template**: The dedicated reusable visual definition for a unit type such as a militia, archer, mage, or guard creature.
- **Object Visual Template**: The dedicated reusable visual definition for a supported map object type such as a bridge, milestone, cave, teleport, exit, or guarded location marker.
- **Tile Visual Template**: The dedicated reusable visual definition for a terrain tile type such as road, plains, grass, mud, woods, mountains, lakes, or rivers.
- **Fallback Visual Template**: A simplified placeholder presentation used when a dedicated template is not yet available or not currently being used for testing.
- **Visual Template Mapping**: The content mapping that determines which dedicated or fallback template is used for each supported unit, object, or tile type.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In scenario rendering checks, 100% of supported current unit types display with a dedicated template whenever that template is available.
- **SC-002**: In scenario rendering checks, 100% of supported current map object types display with a dedicated template whenever that template is available.
- **SC-003**: In terrain scenario checks, 100% of supported current terrain tile types display with a dedicated template whenever that template is available.
- **SC-004**: In fallback coverage checks, 100% of supported units, objects, and tiles remain visible and readable when a dedicated template is missing.
- **SC-005**: In visual readability review, at least 90% of tested players can correctly distinguish the current supported unit roles and terrain categories without relying only on text overlays.

## Assumptions

- The current scenarios and gameplay rules remain unchanged; this feature improves presentation and readability rather than adding new mechanics.
- The first slice only needs slightly more advanced dedicated templates than the current placeholders and does not require final production-grade art.
- The current placeholder visuals remain acceptable as temporary fallback content for testing and incomplete asset coverage.
- The initial dedicated visual set is intended for the currently supported units, map object types, and terrain tile types already present in the repository.
- Reusable image asset files may be provided in project-supported formats such as SVG or PNG as long as they serve the dedicated-template and fallback goals of this feature.

## Out of Scope

- Final high-fidelity art polish for every future faction, creature, building, or scenario.
- Animation systems, particle effects, or combat motion improvements.
- Expanding the creature roster, adding recruitment content, or changing unit balance.
- A full art-pipeline toolchain, editor, or external content-management workflow.
- Reworking map layout, battle rules, or terrain mechanics beyond the visual representation needed to read them.
