import type {
  GameState,
  LayoutMode,
  MapViewport,
  MobileLayoutState,
  Position,
  ResponsiveCanvasView,
  ScreenPoint,
  SidebarPlacement
} from "../../engine/scenario/types";
import {
  getBaseTileSize,
  getScaledTileSize,
  getVisibleWorldSize,
  normalizeViewport,
  worldPointToScreenPoint
} from "../../engine/map/viewportMath";

const MOBILE_BREAKPOINT = 960;
const MOBILE_CANVAS_HEIGHT_RATIO = 0.68;
const MIN_CANVAS_HEIGHT = 320;
const DESKTOP_CANVAS_WIDTH = 896;
const DESKTOP_CANVAS_HEIGHT = 640;
const MOBILE_SHELL_HORIZONTAL_PADDING = 32;

export function resolveLayoutMode(viewportWidth: number): LayoutMode {
  return viewportWidth <= MOBILE_BREAKPOINT ? "mobile" : "desktop";
}

export function resolveSidebarPlacement(layoutMode: LayoutMode): SidebarPlacement {
  return layoutMode === "mobile" ? "bottom" : "right";
}

export function createMobileLayoutState(
  viewportWidth: number,
  viewportHeight: number,
  canvasDisplayWidth: number,
  canvasDisplayHeight: number
): MobileLayoutState {
  const layoutMode = resolveLayoutMode(viewportWidth);

  return {
    viewportWidth,
    viewportHeight,
    layoutMode,
    sidebarPlacement: resolveSidebarPlacement(layoutMode),
    canvasDisplayWidth,
    canvasDisplayHeight
  };
}

export function createResponsiveCanvasView(
  displayWidth: number,
  displayHeight: number,
  deviceScaleFactor = 1
): ResponsiveCanvasView {
  const nextDisplayWidth = Math.max(1, Math.round(displayWidth));
  const nextDisplayHeight = Math.max(1, Math.round(displayHeight));
  const nextScaleFactor = Math.max(1, deviceScaleFactor);

  return {
    pixelWidth: Math.max(1, Math.round(nextDisplayWidth * nextScaleFactor)),
    pixelHeight: Math.max(1, Math.round(nextDisplayHeight * nextScaleFactor)),
    displayWidth: nextDisplayWidth,
    displayHeight: nextDisplayHeight,
    deviceScaleFactor: nextScaleFactor
  };
}

export function getDefaultResponsiveCanvasView(): ResponsiveCanvasView {
  return createResponsiveCanvasView(DESKTOP_CANVAS_WIDTH, DESKTOP_CANVAS_HEIGHT, 1);
}

export function getDefaultMobileLayoutState(): MobileLayoutState {
  return createMobileLayoutState(
    DESKTOP_CANVAS_WIDTH + 320 + 16,
    DESKTOP_CANVAS_HEIGHT + 32,
    DESKTOP_CANVAS_WIDTH,
    DESKTOP_CANVAS_HEIGHT
  );
}

export function resolveCanvasDisplaySize(
  viewportWidth: number,
  viewportHeight: number,
  panelWidth: number,
  layoutMode: LayoutMode
): { displayWidth: number; displayHeight: number } {
  const fallbackWidth =
    layoutMode === "mobile" ? Math.max(1, viewportWidth - MOBILE_SHELL_HORIZONTAL_PADDING) : DESKTOP_CANVAS_WIDTH;
  const displayWidth = panelWidth > 0 ? panelWidth : fallbackWidth;

  if (layoutMode === "mobile") {
    return {
      displayWidth,
      displayHeight: Math.max(
        MIN_CANVAS_HEIGHT,
        Math.floor(Math.min(viewportHeight * MOBILE_CANVAS_HEIGHT_RATIO, displayWidth))
      )
    };
  }

  return {
    displayWidth,
    displayHeight: Math.floor((displayWidth * DESKTOP_CANVAS_HEIGHT) / DESKTOP_CANVAS_WIDTH)
  };
}

export function measureGameShellLayout(
  root: HTMLElement,
  canvasPanel: HTMLElement,
  canvas: HTMLCanvasElement
): { mobileLayoutState: MobileLayoutState; responsiveCanvasView: ResponsiveCanvasView } {
  const rootBounds = root.getBoundingClientRect();
  const panelBounds = canvasPanel.getBoundingClientRect();
  const viewportWidth = Math.max(window.innerWidth, Math.round(rootBounds.width));
  const viewportHeight = Math.max(window.innerHeight, Math.round(rootBounds.height));
  const layoutMode = resolveLayoutMode(viewportWidth);
  const { displayWidth, displayHeight } = resolveCanvasDisplaySize(
    viewportWidth,
    viewportHeight,
    panelBounds.width,
    layoutMode
  );
  const responsiveCanvasView = createResponsiveCanvasView(displayWidth, displayHeight, window.devicePixelRatio || 1);
  const mobileLayoutState = createMobileLayoutState(
    viewportWidth,
    viewportHeight,
    responsiveCanvasView.displayWidth,
    responsiveCanvasView.displayHeight
  );

  if (canvas.width !== responsiveCanvasView.pixelWidth) {
    canvas.width = responsiveCanvasView.pixelWidth;
  }
  if (canvas.height !== responsiveCanvasView.pixelHeight) {
    canvas.height = responsiveCanvasView.pixelHeight;
  }

  canvas.style.width = `${responsiveCanvasView.displayWidth}px`;
  canvas.style.height = `${responsiveCanvasView.displayHeight}px`;

  return { mobileLayoutState, responsiveCanvasView };
}

export function normalizeViewportForState(state: GameState): MapViewport {
  const activeMap = state.scenario.map;
  return normalizeViewport(
    state.mapViewState.viewport,
    activeMap,
    state.responsiveCanvasView.pixelWidth,
    state.responsiveCanvasView.pixelHeight
  );
}

export interface ViewportRenderMetrics {
  viewport: MapViewport;
  baseTileSize: number;
  scaledTileSize: number;
  visibleWorldWidth: number;
  visibleWorldHeight: number;
  startTileX: number;
  startTileY: number;
  endTileX: number;
  endTileY: number;
}

export function getViewportRenderMetrics(
  state: GameState,
  canvas: HTMLCanvasElement | { width: number; height: number }
): ViewportRenderMetrics {
  const activeMap = state.scenario.map;
  const baseTileSize = getBaseTileSize(activeMap, canvas.width, canvas.height);
  const viewport = normalizeViewportForState(state);
  const scaledTileSize = getScaledTileSize(viewport, activeMap, canvas.width, canvas.height);
  const visibleWorldSize = getVisibleWorldSize(viewport, activeMap, canvas.width, canvas.height);

  return {
    viewport,
    baseTileSize,
    scaledTileSize,
    visibleWorldWidth: visibleWorldSize.width,
    visibleWorldHeight: visibleWorldSize.height,
    startTileX: Math.max(0, Math.floor(viewport.panOffsetX)),
    startTileY: Math.max(0, Math.floor(viewport.panOffsetY)),
    endTileX: Math.min(activeMap.width, Math.ceil(viewport.panOffsetX + visibleWorldSize.width)),
    endTileY: Math.min(activeMap.height, Math.ceil(viewport.panOffsetY + visibleWorldSize.height))
  };
}

export function worldTileToCanvasPoint(
  position: Position,
  viewport: MapViewport,
  canvas: HTMLCanvasElement | { width: number; height: number },
  map: { width: number; height: number }
): ScreenPoint {
  return worldPointToScreenPoint(position, viewport, map, canvas.width, canvas.height);
}
