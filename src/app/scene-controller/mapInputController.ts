import type { GameStore } from "../state/gameState";
import { isImmediateMovementBehavior } from "../state/gameSettings";
import { clearOwnedRoutePreview, confirmRoutePreview, plotRoutePreview, selectHero } from "../../engine/map/heroActions";
import { startGuardEncounter } from "../../engine/map/startGuardEncounter";
import { setBattleState } from "../state/gameState";
import type { MapTraversalController } from "./mapTraversalController";
import { isRoutePreviewOwnedByHero, isSameRouteDestination } from "../../engine/map/routePreviewState";
import {
  createInteractionTarget,
  createPanGesture,
  createZoomGesture,
  panViewport,
  zoomViewportAtPoint,
  zoomViewportWithTouchGesture
} from "../../engine/map/viewportMath";
import type { ScreenPoint } from "../../engine/scenario/types";

const TOUCH_PAN_THRESHOLD = 12;

function getCanvasPoint(canvas: HTMLCanvasElement, event: MouseEvent | WheelEvent | PointerEvent): ScreenPoint {
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;

  return {
    x: (event.clientX - bounds.left) * scaleX,
    y: (event.clientY - bounds.top) * scaleY
  };
}

function handleMapTap(store: GameStore, point: ScreenPoint, traversalController?: MapTraversalController): void {
  store.update((state) => {
    if (state.sceneMode !== "map") {
      return;
    }
    if (state.activeTraversal) {
      state.messageLog.push("The hero is already traversing the route.");
      return;
    }

    const target = createInteractionTarget(
      point,
      state.mapViewState.viewport,
      state.scenario.map,
      state.responsiveCanvasView.pixelWidth,
      state.responsiveCanvasView.pixelHeight
    );
    const { x, y } = target.worldPosition;

    state.lastTouchInteraction = {
      interactionType: "tap",
      screenPosition: point,
      targetKind: target.targetKind,
      targetId: target.targetId,
      gesturePhase: "end"
    };

    const heroAtTile = state.scenario.heroes.find(
      (hero) =>
        hero.mapId === state.mapTravelState.activeMapId &&
        hero.mapPosition.x === x &&
        hero.mapPosition.y === y &&
        hero.availabilityState !== "defeated"
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
    if (shouldConfirmRoute && !isImmediateMovementBehavior(state.gameSettings.movementBehavior)) {
      if (!traversalController?.start()) state.messageLog.push("Unable to start route traversal.");
      return;
    }
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
      state.messageLog.push(
        `Route completed at (${result.routeProgress.finalPosition.x + 1}, ${result.routeProgress.finalPosition.y + 1}).`
      );
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
}

export function bindMapInput(canvas: HTMLCanvasElement, store: GameStore, traversalController?: MapTraversalController): void {
  const activeTouchPoints = new Map<number, ScreenPoint>();
  const capturePointer = (pointerId: number): void => {
    try {
      canvas.setPointerCapture(pointerId);
    } catch {
      // Synthetic touch events used in tests may not support pointer capture.
    }
  };
  const releasePointer = (pointerId: number): void => {
    try {
      if (canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
    } catch {
      // Ignore pointer-capture cleanup failures from synthetic events.
    }
  };

  canvas.addEventListener("click", (event) => {
    if (event.button !== 0) {
      return;
    }

    handleMapTap(store, getCanvasPoint(canvas, event), traversalController);
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
        state.responsiveCanvasView.pixelWidth,
        state.responsiveCanvasView.pixelHeight
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
          state.responsiveCanvasView.pixelWidth,
          state.responsiveCanvasView.pixelHeight
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

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }

    const point = getCanvasPoint(canvas, event);
    activeTouchPoints.set(event.pointerId, point);
    capturePointer(event.pointerId);
    store.update((state) => {
      if (state.sceneMode !== "map") {
        return;
      }

      const activePointers = [...activeTouchPoints.entries()];
      if (activePointers.length >= 2) {
        const [[firstPointerId, firstPoint], [secondPointerId, secondPoint]] = activePointers;
        state.mapViewState.panGesture = null;
        state.mapViewState.zoomGesture = createZoomGesture(firstPointerId, secondPointerId, firstPoint, secondPoint);
        state.lastTouchInteraction = {
          interactionType: "tap",
          screenPosition: state.mapViewState.zoomGesture.anchorScreenPoint,
          targetKind: "none",
          targetId: null,
          gesturePhase: "start"
        };
        return;
      }

      state.lastTouchInteraction = {
        interactionType: "tap",
        screenPosition: point,
        targetKind: "none",
        targetId: null,
        gesturePhase: "start"
      };
      state.mapViewState.panGesture = createPanGesture(point, state.mapViewState.viewport);
      state.mapViewState.zoomGesture = null;
      state.mapViewState.panGesture.pointerId = event.pointerId;
      state.mapViewState.panGesture.pointerType = event.pointerType;
      state.mapViewState.panGesture.hasMoved = false;
    });
  });

  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }

    const point = getCanvasPoint(canvas, event);
    activeTouchPoints.set(event.pointerId, point);
    store.update((state) => {
      if (state.sceneMode !== "map") {
        return;
      }

      const zoomGesture = state.mapViewState.zoomGesture;
      if (zoomGesture?.isActive && zoomGesture.pointerIds.includes(event.pointerId)) {
        const [firstPointerId, secondPointerId] = zoomGesture.pointerIds;
        const firstPoint = activeTouchPoints.get(firstPointerId);
        const secondPoint = activeTouchPoints.get(secondPointerId);
        if (!firstPoint || !secondPoint) {
          return;
        }

        const zoomResult = zoomViewportWithTouchGesture(
          state.mapViewState.viewport,
          zoomGesture,
          firstPoint,
          secondPoint,
          state.scenario.map,
          state.responsiveCanvasView.pixelWidth,
          state.responsiveCanvasView.pixelHeight
        );
        state.mapViewState.zoomGesture = zoomResult.zoomGesture;
        if (!zoomResult.interactionType) {
          return;
        }

        state.mapViewState.viewport = zoomResult.viewport;
        state.mapViewState.isDefaultView = false;
        state.lastTouchInteraction = {
          interactionType: zoomResult.interactionType,
          screenPosition: zoomResult.zoomGesture.anchorScreenPoint,
          targetKind: "none",
          targetId: null,
          gesturePhase: "move"
        };
        return;
      }

      if (!state.mapViewState.panGesture?.isActive) {
        return;
      }
      if (state.mapViewState.panGesture.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = point.x - state.mapViewState.panGesture.originScreenX;
      const deltaY = point.y - state.mapViewState.panGesture.originScreenY;
      if (!state.mapViewState.panGesture.hasMoved && Math.hypot(deltaX, deltaY) < TOUCH_PAN_THRESHOLD) {
        return;
      }

      state.mapViewState.panGesture.hasMoved = true;
      state.mapViewState.viewport = panViewport(
        state.mapViewState.viewport,
        state.mapViewState.panGesture,
        point,
        state.scenario.map,
        state.responsiveCanvasView.pixelWidth,
        state.responsiveCanvasView.pixelHeight
      );
      state.mapViewState.isDefaultView = false;
      state.lastTouchInteraction = {
        interactionType: "drag",
        screenPosition: point,
        targetKind: "none",
        targetId: null,
        gesturePhase: "move"
      };
    });
  });

  const finishPointerInteraction = (event: PointerEvent): void => {
    if (event.pointerType === "mouse") {
      return;
    }

    const point = getCanvasPoint(canvas, event);
    activeTouchPoints.delete(event.pointerId);
    releasePointer(event.pointerId);

    let shouldTap = false;
    store.update((state) => {
      const zoomGesture = state.mapViewState.zoomGesture;
      if (zoomGesture?.pointerIds.includes(event.pointerId)) {
        state.mapViewState.zoomGesture = null;
        state.mapViewState.panGesture = null;
        state.lastTouchInteraction = {
          interactionType:
            state.lastTouchInteraction?.interactionType === "zoom-out" ? "zoom-out" : "zoom-in",
          screenPosition: point,
          targetKind: "none",
          targetId: null,
          gesturePhase: "end"
        };
        return;
      }

      const gesture = state.mapViewState.panGesture;
      if (!gesture || gesture.pointerId !== event.pointerId) {
        return;
      }

      shouldTap = !gesture.hasMoved;
      state.mapViewState.panGesture = null;
      state.lastTouchInteraction = {
        interactionType: shouldTap ? "tap" : "drag",
        screenPosition: point,
        targetKind: "none",
        targetId: null,
        gesturePhase: "end"
      };
    });

    if (shouldTap) {
        handleMapTap(store, point, traversalController);
    }
  };

  canvas.addEventListener("pointerup", finishPointerInteraction);
  canvas.addEventListener("pointercancel", finishPointerInteraction);
}
