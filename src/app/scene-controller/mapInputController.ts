import type { GameStore } from "../state/gameState";
import { clearOwnedRoutePreview, confirmRoutePreview, plotRoutePreview, selectHero } from "../../engine/map/heroActions";
import { startGuardEncounter } from "../../engine/map/startGuardEncounter";
import { setBattleState } from "../state/gameState";
import { isRoutePreviewOwnedByHero, isSameRouteDestination } from "../../engine/map/routePreviewState";
import { createInteractionTarget, createPanGesture, panViewport, zoomViewportAtPoint } from "../../engine/map/viewportMath";
import type { ScreenPoint } from "../../engine/scenario/types";

function getCanvasPoint(canvas: HTMLCanvasElement, event: MouseEvent | WheelEvent): ScreenPoint {
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;

  return {
    x: (event.clientX - bounds.left) * scaleX,
    y: (event.clientY - bounds.top) * scaleY
  };
}

export function bindMapInput(canvas: HTMLCanvasElement, store: GameStore): void {
  canvas.addEventListener("click", (event) => {
    if (event.button !== 0) {
      return;
    }

    const point = getCanvasPoint(canvas, event);

    store.update((state) => {
      if (state.sceneMode !== "map") {
        return;
      }

      const target = createInteractionTarget(point, state.mapViewState.viewport, state.scenario.map, canvas.width, canvas.height);
      const { x, y } = target.worldPosition;

      const heroAtTile = state.scenario.heroes.find(
        (hero) => hero.mapPosition.x === x && hero.mapPosition.y === y && hero.availabilityState !== "defeated"
      );

      if (heroAtTile) {
        if (isRoutePreviewOwnedByHero(state.activeRoutePreview, heroAtTile.id)) {
          const clearResult = clearOwnedRoutePreview(state, heroAtTile.id);
          if (!clearResult.ok && clearResult.reason) {
            state.messageLog.push(clearResult.reason);
            return;
          }
          selectHero(state, heroAtTile.id);
          state.messageLog.push(`${heroAtTile.name}'s plotted route was cleared.`);
          return;
        }

        const result = selectHero(state, heroAtTile.id);
        if (!result.ok && result.reason) {
          state.messageLog.push(result.reason);
        }
        return;
      }

      const shouldConfirmRoute =
        isRoutePreviewOwnedByHero(state.activeRoutePreview, state.selectedHeroId) &&
        isSameRouteDestination(state.activeRoutePreview, { x, y });
      const result = shouldConfirmRoute ? confirmRoutePreview(state) : plotRoutePreview(state, { x, y });
      if (!result.ok) {
        state.messageLog.push(result.reason ?? "That move is not allowed.");
        return;
      }

      if (!shouldConfirmRoute) {
        const totalCost = state.activeRoutePreview?.totalMovementCost ?? 0;
        state.messageLog.push(`Route plotted to (${x + 1}, ${y + 1}) costing ${totalCost} movement.`);
        return;
      }

      if (result.routeProgress?.completionState === "completed") {
        state.messageLog.push(`Route completed at (${x + 1}, ${y + 1}).`);
      } else if (result.routeProgress) {
        state.messageLog.push(
          `Route advanced to (${result.routeProgress.finalPosition.x + 1}, ${result.routeProgress.finalPosition.y + 1}) and awaits continuation.`
        );
      }

      const encounter = state.selectedHeroId
        ? startGuardEncounter(state, state.selectedHeroId)
        : { ok: false as const, reason: "No hero is selected." };
      if (encounter.ok) {
        setBattleState(state, encounter.battle);
        state.messageLog.push(`The guards of ${encounter.location.name} attack.`);
      }
    });
  });

  canvas.addEventListener("mousedown", (event) => {
    if (event.button !== 1) {
      return;
    }

    event.preventDefault();
    const point = getCanvasPoint(canvas, event);
    store.update((state) => {
      if (state.sceneMode !== "map") {
        return;
      }

      state.mapViewState.panGesture = createPanGesture(point, state.mapViewState.viewport);
    });
  });

  canvas.addEventListener("mousemove", (event) => {
    const point = getCanvasPoint(canvas, event);
    store.update((state) => {
      if (state.sceneMode !== "map" || !state.mapViewState.panGesture?.isActive) {
        return;
      }

      state.mapViewState.viewport = panViewport(
        state.mapViewState.viewport,
        state.mapViewState.panGesture,
        point,
        state.scenario.map,
        canvas.width,
        canvas.height
      );
      state.mapViewState.isDefaultView = false;
    });
  });

  window.addEventListener("mouseup", (event) => {
    if (event.button !== 1) {
      return;
    }

    store.update((state) => {
      if (!state.mapViewState.panGesture) {
        return;
      }

      state.mapViewState.panGesture = null;
    });
  });

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const point = getCanvasPoint(canvas, event);
      store.update((state) => {
        if (state.sceneMode !== "map") {
          return;
        }

        state.mapViewState.viewport = zoomViewportAtPoint(
          state.mapViewState.viewport,
          event.deltaY,
          point,
          state.scenario.map,
          canvas.width,
          canvas.height
        );
        state.mapViewState.isDefaultView = false;
      });
    },
    { passive: false }
  );

  canvas.addEventListener("auxclick", (event) => {
    if (event.button === 1) {
      event.preventDefault();
    }
  });
}
