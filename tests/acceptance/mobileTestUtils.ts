import type { Locator, Page } from "@playwright/test";

export async function tapElement(locator: Locator): Promise<void> {
  await locator.dispatchEvent("click");
}

export async function getTileClientPoint(
  page: Page,
  tileX: number,
  tileY: number
): Promise<{ x: number; y: number }> {
  return page.evaluate(
    ({ x, y }) => {
      const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
      const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
      if (!canvas || !store) {
        throw new Error("Game canvas or store was not available.");
      }

      const state = store.getState();
      const viewport = state.mapViewState.viewport;
      const bounds = canvas.getBoundingClientRect();
      const defaultTileSize = state.scenario.map.width <= 8 && state.scenario.map.height <= 8 ? 96 : 10;
      const baseTileSize =
        defaultTileSize === 96
          ? 96
          : Math.max(10, Math.floor(Math.min(canvas.width / state.scenario.map.width, canvas.height / state.scenario.map.height)));
      const scaledTileSize = baseTileSize * viewport.zoomLevel;
      const screenX = (x - viewport.panOffsetX) * scaledTileSize;
      const screenY = (y - viewport.panOffsetY) * scaledTileSize;

      return {
        x: bounds.left + (screenX / canvas.width) * bounds.width + (scaledTileSize / canvas.width) * bounds.width * 0.5,
        y: bounds.top + (screenY / canvas.height) * bounds.height + (scaledTileSize / canvas.height) * bounds.height * 0.5
      };
    },
    { x: tileX, y: tileY }
  );
}

export async function touchCanvasPoint(page: Page, point: { x: number; y: number }): Promise<void> {
  await page.evaluate(
    ({ x, y }) => {
      const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
      if (!canvas) {
        throw new Error("Canvas was not available.");
      }

      const eventInit = {
        pointerId: 1,
        pointerType: "touch",
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      };

      canvas.dispatchEvent(new PointerEvent("pointerdown", eventInit));
      canvas.dispatchEvent(new PointerEvent("pointerup", eventInit));
      canvas.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 }));
    },
    point
  );
}

export async function dragCanvas(page: Page, from: { x: number; y: number }, to: { x: number; y: number }): Promise<void> {
  await page.evaluate(
    ({ fromPoint, toPoint }) => {
      const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
      if (!canvas) {
        throw new Error("Canvas was not available.");
      }

      canvas.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerId: 2,
          pointerType: "touch",
          bubbles: true,
          cancelable: true,
          clientX: fromPoint.x,
          clientY: fromPoint.y
        })
      );
      canvas.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerId: 2,
          pointerType: "touch",
          bubbles: true,
          cancelable: true,
          clientX: toPoint.x,
          clientY: toPoint.y
        })
      );
      canvas.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerId: 2,
          pointerType: "touch",
          bubbles: true,
          cancelable: true,
          clientX: toPoint.x,
          clientY: toPoint.y
        })
      );
    },
    { fromPoint: from, toPoint: to }
  );
}

export async function getViewportState(page: Page): Promise<{ x: number; y: number; zoom: number }> {
  return page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const viewport = store?.getState().mapViewState.viewport;
    return {
      x: viewport.panOffsetX,
      y: viewport.panOffsetY,
      zoom: viewport.zoomLevel
    };
  });
}
