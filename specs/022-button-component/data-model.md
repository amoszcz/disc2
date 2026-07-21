# Data Model: Shared Button Configuration

## Button Configuration

Represents one interactive control rendered by the application.

| Field | Purpose | Validation / behavior |
|---|---|---|
| Content | Visible text, icon, or structured label content | Required; icon-only content must have an accessible label. |
| Identity | Optional control identifier and test hook | Values are preserved exactly so current event bindings and tests continue to locate the control. |
| Accessibility metadata | Accessible label, tooltip, and state information | Provide a name for icon-only controls; expose pressed and busy states when applicable. |
| Visual treatment | Primary, secondary, quiet, or icon treatment | Defaults to the standard primary treatment. |
| Size | Default or compact size | Defaults to the standard touch-capable size. |
| Action data | Screen-specific action metadata | Passed through unchanged for existing menu and editor behavior. |
| Availability state | Enabled, disabled, or busy | Disabled and busy controls cannot be activated. |
| Selection state | Selected or not selected | Selected controls are visibly distinguished without replacing focus feedback. |
| Pressed state | Pressed or not pressed | Applies to controls representing a persistent pressed state and is announced programmatically. |

## State Transitions

```text
resting -> hovered -> pressed -> resting
   |          |          |
   +--------> focused <--+
   |
   +--------> disabled
   +--------> busy

selected is an independent persistent state that may coexist with resting or focused.
```

## Rules

- Busy implies unavailable for activation until busy is cleared.
- Disabled and busy override hover and pressed interaction feedback.
- Focus remains independently identifiable when a control is selected.
- The property model must represent every current button without custom base markup.
