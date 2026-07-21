# Quickstart: Validate the Shared Button Feature

## Prerequisites

- Install the repository's existing dependencies.
- Work from the `022-button-component` branch.

## Validate the Shared Button Contract

1. Run the focused shared-button contract test.
2. Confirm it covers identity metadata, visual treatment, selected and pressed state, busy state, and disabled behavior.

Expected result: the representative configurations render with the required semantics and unavailable states cannot be activated.

## Validate Existing Control Surfaces

1. Run the existing menu, gameplay-control, battle, mobile-layout, and sprite-mapping contract suites.
2. Confirm every retained test hook and disabled behavior remains available to those flows.

Expected result: existing gameplay and developer-tool controls remain locatable and retain their behavior.

## Validate Browser Interaction Feedback

1. Start the browser application using the repository's normal development command.
2. On desktop, inspect an enabled primary button at rest, on hover, while pressed, and with keyboard focus.
3. Inspect a disabled or busy control and verify that it is visibly subdued and cannot be activated.
4. Inspect an icon-only map action and a selected sprite-mapping entry for accessible naming and persistent selection feedback.
5. Repeat the primary press path at a mobile viewport.

Expected result: controls visibly lift or highlight on hover where available, depress while pressed, show a clear focus ring, and preserve usable press feedback on mobile.

## Full Regression

Run the repository's build and relevant automated test suites after migration. See [button-ui-contract.md](contracts/button-ui-contract.md) and [data-model.md](data-model.md) for the expected contract and state rules.
