# Contract: Scenario Session State

## Purpose

Define the application-state contract for scenario session creation, completion, and return to the main menu.

## Session Creation Contract

- Starting a scenario from the menu must create a fresh scenario session from that scenario's default definition.
- The active gameplay state after starting must belong to the selected scenario only.
- Mutable state from a previous session must not be reused in the new session.

## Completion Contract

- When a scenario reaches its existing completion condition, the application must enter an end-of-scenario state.
- The completion view must expose an action that returns the player to the main menu.

## Return-To-Menu Contract

- Choosing return to menu must dispose of the completed scenario session from active application state.
- After returning, the main menu must be ready to start any available scenario again.
- Starting the same scenario again after returning must produce the same initial state values as a fresh application launch.
