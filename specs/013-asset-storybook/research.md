# Research: Asset Storybook

## Decision 1: Add the storybook as a first-class scene mode instead of overloading the menu or map scene

**Decision**: Introduce a dedicated `storybook` scene mode in the shared scene controller and game state flow rather than trying to render asset previews inside the existing menu or map scene.

**Rationale**: The current app already switches cleanly among `menu`, `map`, `battle`, and `victory` modes. A dedicated scene mode keeps navigation explicit, lets the storybook own its own sidebar/canvas behavior, and avoids coupling asset-review logic to scenario session rules or map HUD expectations.

**Alternatives considered**:
- Render the storybook inside the main menu sidebar only: rejected because the feature needs canvas-backed visual previews and state transitions, not just a list of text controls.
- Reuse the map scene as a hidden review map: rejected because that would pull storybook behavior into scenario state and make asset review depend on map-specific context.

## Decision 2: Reuse the existing visual-template resolver as the single source of preview truth

**Decision**: Storybook previews should resolve subjects through the same visual-template catalog and resolver helpers already used by map and battle rendering.

**Rationale**: The spec explicitly requires the exact same logic as the game. The existing resolver already handles dedicated assets, supported state names, fallback behavior, readability labels, and diagnostics. Reusing it prevents drift between preview behavior and gameplay behavior.

**Alternatives considered**:
- Create a storybook-only asset mapping table: rejected because it would duplicate state support rules and quickly diverge from gameplay.
- Render raw sprite-sheet frames directly for storybook entries: rejected because it would bypass fallback behavior and fail the feature's core validation purpose.

## Decision 3: Model storybook subjects as a derived review catalog rather than as scenario content

**Decision**: Build the storybook from a derived catalog of preview subjects based on current hero, unit, movement-object, guarded-location, and other supported visual definitions instead of reading the active scenario for what happens to exist in the current session.

**Rationale**: Asset review should be stable and complete regardless of which scenario is active or whether a scenario is active at all. A derived review catalog can include each supported subject once, expose its supported states, and remain independent from current map positions or battle setup.

**Alternatives considered**:
- Pull subjects from whichever scenario the user last played: rejected because it would omit unsupported-but-mapped content and make the storybook inconsistent between sessions.
- Maintain a fully hand-authored storybook list disconnected from render metadata: rejected because it would create a second catalog to keep synchronized.

## Decision 4: Use isolated single-tile previews with subject-appropriate defaults instead of full context reconstruction

**Decision**: Render each storybook entry inside an isolated preview tile with a subject-appropriate default pose or direction, rather than reconstructing an entire map or battle layout around the subject.

**Rationale**: The feature goal is asset verification, not scene simulation. A single-tile preview keeps the subject readable, lowers implementation cost, and aligns with the requirement that previews be isolated from full gameplay context.

**Alternatives considered**:
- Render each subject in a miniature full map or battle scene: rejected because it adds complexity and distracts from the asset itself.
- Show only textual metadata without canvas preview: rejected because the feature is explicitly visual.

## Decision 5: Expose only meaningful, subject-supported state options in each dropdown

**Decision**: Each storybook entry should surface only the states that are valid or reviewable for that subject, including fallback-reviewable states where the game meaningfully supports them.

**Rationale**: The animation-state work already distinguishes supported states by subject. Mirroring that in the storybook prevents misleading controls, keeps review focused, and ensures a dropdown communicates real coverage instead of hypothetical future states.

**Alternatives considered**:
- Show the full union of all known state names for every subject: rejected because most entries would contain irrelevant options and produce confusing or intentionally invalid requests.
- Hide the selector for single-state subjects: rejected because a consistent storybook layout is easier to scan and still useful for proving idle-only coverage.

## Decision 6: Validate the storybook through public UI contracts, resolver-backed integration checks, and acceptance navigation flows

**Decision**: Prove the storybook using contract coverage for menu and panel structure, integration coverage for derived preview subject/state selection and resolver-backed rendering, and Playwright flows for real browser navigation and state switching.

**Rationale**: The constitution favors feature-level proof. This feature changes user-facing navigation and visual review behavior, so the highest-value evidence is that users can open the storybook, inspect real preview entries, switch states, and still see the same fallback/readability behavior the game uses.

**Alternatives considered**:
- Limit tests to low-level helper units: rejected because it would miss the navigation and preview behavior the user actually cares about.
- Rely on manual visual review only: rejected because the navigation and state-resolution paths are deterministic enough to automate meaningfully.
