# Quickstart: Core Map Loop

## Goal

Run the first playable browser slice for the core map loop, then execute the tests that prove movement, guarded combat, and default victory behavior.

## Planned Setup

1. Install Node.js 20 or newer.
2. Install project dependencies after the app scaffold is added:

```powershell
npm install
```

3. Start the local development server:

```powershell
npm run dev
```

4. Open the local browser URL shown by the dev server.

## Expected Playable Flow

1. Start the default handcrafted scenario.
2. Select the player hero and move to a nearby resource pickup.
3. Confirm the pickup disappears and the resource total increases.
4. Move to a guarded location and enter battle.
5. Win the minimal tactical battle.
6. Confirm the guarded location becomes accessible.
7. Defeat the final required opposing force and confirm the scenario ends in victory.

## Planned Test Commands

Run engine and integration coverage:

```powershell
npm run test
```

Run acceptance coverage in a real browser:

```powershell
npm run test:acceptance
```

Run all checks for the feature slice:

```powershell
npm run verify
```

## Notes

- The first slice is expected to use placeholder art or simple colored shapes.
- Save and load flows are not part of this slice.
- City screens, recruitment, and economy systems are intentionally deferred.
