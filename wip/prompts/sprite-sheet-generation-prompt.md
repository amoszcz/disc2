Create a complete 2D sprite package for my turn-based fantasy strategy game.

Output requirements:
1. Generate a single master sprite sheet PNG with every sprite for every game subject and every supported state.
2. Generate a machine-readable metadata file alongside it as JSON.
3. The JSON must list, for every sprite on the sheet:
   - `sheet`
   - `subject_kind`
   - `subject_id`
   - `display_name`
   - `scene_context`
   - `exact_state_name`
   - `direction` (if applicable, otherwise `null`)
   - `x`
   - `y`
   - `width`
   - `height`
   - `anchor_x`
   - `anchor_y`
   - `notes`
4. Coordinates must be exact pixel coordinates within the final sprite sheet.
5. Do not omit any state. Use the exact identifiers below.
6. Keep naming stable and engine-friendly. Do not rename states.
7. Visual style must be consistent across all assets:
   - top-down / tactical fantasy
   - readable at small size
   - strong silhouette clarity
   - restrained but rich color palette
   - slightly stylized, not photorealistic
   - suitable for both map and battle UI
   - transparent background for each sprite region
8. Layout the sprite sheet cleanly with padding between sprites and no overlaps.
9. Every sprite must be production-usable, not placeholder art.
10. Also include a compact human-readable manifest table in Markdown after the JSON.

Art direction:
- Theme: classic fantasy strategy game
- Mood: adventurous, tactical, slightly gritty but colorful
- Readability first: each unit/object must be immediately recognizable
- Prioritize strong silhouettes and clear state changes
- State changes should be visually obvious:
  - hurt/hit/perish states must look damaged or collapsing
  - defend should look braced
  - ready should look alert
  - victory should look celebratory
  - active/highlighted states should feel energized/interactive
  - inactive should feel dormant
  - blocked/open/claimed must be distinct at a glance

Technical constraints:
- Output a single atlas-style sprite sheet
- Use consistent framing and scale within each category
- Keep battle units framed for battle scene readability
- Keep map objects and hero sprites framed for map readability
- Terrain tiles should be tileable-looking and visually distinct
- Resource pickups should be clear and compact
- If a subject needs directional variants, include all listed directions as separate atlas entries

Generate sprites for all of these subjects and exact state names:

HEROES
1. `hero-aren`
   - subject_kind: `hero`
   - display_name: `Aren`
   - scene_context: `map`
   - directional states:
     - `idle` with directions `up`, `down`, `left`, `right`
     - `start-move` with directions `up`, `down`, `left`, `right`
     - `walk` with directions `up`, `down`, `left`, `right`
     - `stop-move` with directions `up`, `down`, `left`, `right`
   - non-directional event states:
     - `interact`
     - `victory`
     - `hurt`
     - `perish`

BATTLE UNITS
2. `unit-militia`
   - subject_kind: `unit`
   - display_name: `Militia`
   - scene_context: `battle`
   - states:
     - `idle`
     - `ready`
     - `attack`
     - `hit`
     - `defend`
     - `wait`
     - `victory`
     - `perish`

3. `unit-archer`
   - subject_kind: `unit`
   - display_name: `Archer`
   - scene_context: `battle`
   - states:
     - `idle`
     - `ready`
     - `shoot`
     - `hit`
     - `defend`
     - `wait`
     - `victory`
     - `perish`

4. `unit-mage`
   - subject_kind: `unit`
   - display_name: `Mage`
   - scene_context: `battle`
   - states:
     - `idle`
     - `ready`
     - `cast`
     - `hit`
     - `defend`
     - `wait`
     - `victory`
     - `perish`

5. `unit-skeleton`
   - subject_kind: `unit`
   - display_name: `Skeleton`
   - scene_context: `battle`
   - states:
     - `idle`
     - `ready`
     - `attack`
     - `hit`
     - `defend`
     - `wait`
     - `victory`
     - `perish`

6. `unit-skeleton-archer`
   - subject_kind: `unit`
   - display_name: `Skeleton Archer`
   - scene_context: `battle`
   - states:
     - `idle`
     - `ready`
     - `shoot`
     - `hit`
     - `defend`
     - `wait`
     - `victory`
     - `perish`

7. `unit-stone-watcher`
   - subject_kind: `unit`
   - display_name: `Stone Watcher`
   - scene_context: `battle`
   - states:
     - `idle`
     - `ready`
     - `attack`
     - `hit`
     - `defend`
     - `wait`
     - `victory`
     - `perish`

MOVEMENT OBJECTS
8. `object-bridge`
   - subject_kind: `movement-object`
   - display_name: `Bridge`
   - scene_context: `map`
   - states:
     - `idle`
     - `damaged`

9. `object-milestone`
   - subject_kind: `movement-object`
   - display_name: `Milestone`
   - scene_context: `map`
   - states:
     - `idle`
     - `highlighted`

10. `object-rubble`
   - subject_kind: `movement-object`
   - display_name: `Rubble`
   - scene_context: `map`
   - states:
     - `idle`
     - `damaged`

11. `object-cave`
   - subject_kind: `movement-object`
   - display_name: `Cave`
   - scene_context: `map`
   - states:
     - `idle`
     - `active`
     - `highlighted`

12. `object-teleport`
   - subject_kind: `movement-object`
   - display_name: `Teleport`
   - scene_context: `map`
   - states:
     - `idle`
     - `active`
     - `inactive`

13. `object-exit`
   - subject_kind: `movement-object`
   - display_name: `Exit`
   - scene_context: `map`
   - states:
     - `idle`
     - `active`
     - `highlighted`

GUARDED LOCATIONS
14. `guarded-location-blocked`
   - subject_kind: `guarded-location`
   - display_name: `Blocked guarded site`
   - scene_context: `map`
   - states:
     - `blocked`
     - `selected`

15. `guarded-location-open`
   - subject_kind: `guarded-location`
   - display_name: `Open guarded site`
   - scene_context: `map`
   - states:
     - `open`
     - `claimed`
     - `selected`

TERRAIN TILES
16. `terrain-road`
17. `terrain-grass`
18. `terrain-plains`
19. `terrain-mud`
20. `terrain-woods`
21. `terrain-mountains`
22. `terrain-lakes`
23. `terrain-rivers`
   - subject_kind: `terrain`
   - scene_context: `map`
   - state for each terrain tile:
     - `idle`

RESOURCE PICKUPS
24. `pickup-gold`
   - subject_kind: `resource-pickup`
   - display_name: `Gold pickup`
   - scene_context: `map`
   - states:
     - `idle`

Metadata format example:
{
  "sheet": "game-atlas.png",
  "sprites": [
    {
      "subject_kind": "hero",
      "subject_id": "hero-aren",
      "display_name": "Aren",
      "scene_context": "map",
      "exact_state_name": "walk",
      "direction": "down",
      "x": 0,
      "y": 0,
      "width": 96,
      "height": 96,
      "anchor_x": 48,
      "anchor_y": 80,
      "notes": "hero walking south"
    }
  ]
}

Final deliverables:
- 1 sprite sheet PNG
- 1 JSON atlas/manifest with exact coordinates and exact state names
- 1 Markdown summary table listing every sprite entry
