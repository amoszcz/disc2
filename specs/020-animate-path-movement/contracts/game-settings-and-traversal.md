# UI Contract: Game Settings and Route Traversal

## Settings page

The application exposes a dedicated Settings scene from both the main menu and an active adventure map.

| Element / behavior | Contract |
|---|---|
| Settings entry | A visible Settings action is available from the main menu and map UI. |
| Current settings | The page identifies the active movement behavior and visual template. |
| Movement choice | Exactly `Animated (1 tile/second)` and `Immediate` are selectable. |
| Template choice | Lists each ready template from the shared catalog once and identifies the active choice. |
| Return action | Returns to the scene from which the player opened Settings without resetting gameplay state. |
| Persistence | A changed setting is still active after reload and a later scenario start. |
| Invalid saved template | Falls back safely to the configured default and displays only ready choices. |

Suggested stable test identifiers:

```text
settings-open-button
map-settings-open-button
settings-panel
movement-behavior-selector
settings-template-selector
settings-return-button
```

The existing `map-template-selector` is removed from gameplay.

## Traversal behavior

| Situation | Required observable behavior |
|---|---|
| Animated route confirmation | The hero moves one completed route tile per second in the displayed order. |
| Immediate route confirmation | The hero reaches the same legal endpoint without the per-tile delay. |
| Partial route | The hero stops at the last affordable legal tile and the remaining valid route is retained for continuation. |
| Forced stop | Encounter, blocked location, map transition, invalidation, or cancellation stops later ticks before they run. |
| Input during traversal | A second movement confirmation for the traversing hero is ignored or clearly rejected. |
| Setting change during traversal | The current traversal retains its starting behavior; the next confirmed route uses the new choice. |

Suggested stable test identifiers:

```text
route-traversal-status
route-traversal-step
movement-behavior-value
```

## Compatibility requirements

- Existing route-preview, path-cost, continuation, world-map travel, battle, visual-template catalog, storybook, and sprite-mapping contracts remain valid.
- Storybook and sprite-mapping retain their own template selectors.
- The game settings page is the only gameplay-facing place to change the active template.
