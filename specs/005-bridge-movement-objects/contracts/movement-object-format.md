# Contract: Movement Object Format

## Purpose

Define the scenario-content contract for painted movement-object regions.

## Movement Object Region Contract

A movement-object-enhanced scenario must provide:

- Region identity
- Supported movement-object type
- Coverage definition that maps to one or more tiles
- Deterministic precedence for overlapping object regions

## Supported Object Types

- `bridge`
- `milestone`
- `rubble`

## Resolution Guarantees

- Every queried tile must resolve zero or more movement-object effects deterministically.
- Multiple movement objects affecting the same tile must stack in a deterministic order.
- Final movement cost must never be reduced below 1.
- Bridge regions must apply only to river terrain or the scenario is invalid.

## Validation Guarantees

- Movement-object regions must stay within map bounds.
- Unsupported object types must fail scenario validation.
- Any bridge region covering non-river terrain must fail scenario validation.

## Out of Scope for This Contract

- Dynamic object placement during play
- Destructible or repairable objects
- Combat, vision, or resource modifiers
