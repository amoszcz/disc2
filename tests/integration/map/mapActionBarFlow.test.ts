import { describe, expect, test } from "vitest";
import { createInitialState, GameStore } from "../../../src/app/state/gameState";
import { applyMapZoom, endMapTurn } from "../../../src/ui/panels/mapActionBar";

describe("map action bar flow", () => {
  test("zooms using the same live map viewport state", () => {
    const store = new GameStore(createInitialState());
    const before = store.getState().mapViewState.viewport.zoomLevel;

    applyMapZoom(store, "in");

    expect(store.getState().mapViewState.viewport.zoomLevel).toBeGreaterThan(before);
    expect(store.getState().lastTouchInteraction?.interactionType).toBe("zoom-in");
  });

  test("ends the turn through the relocated action without changing turn rules", () => {
    const store = new GameStore(createInitialState());

    endMapTurn(store);

    expect(store.getState().sceneMode).toBe("map");
    expect(store.getState().messageLog.at(-1)).toContain("next side takes its turn");
  });
});
