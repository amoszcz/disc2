import type {
  InteractionTarget,
  MapDefinition,
  MapViewport,
  PanGestureState,
  Position,
  ScreenPoint,
  ZoomGestureState
} from "../scenario/types";

const SMALL_MAP_THRESHOLD = 8;
const DEFAULT_TILE_SIZE = 96;
const MIN_BASE_TILE_SIZE = 10;
const TOUCH_ZOOM_DISTANCE_THRESHOLD = 12;
const BORDER_WATCH_REFERENCE_SCENARIO_ID = "core-map-loop";
const BORDER_WATCH_MIN_TILE_RENDER_SIZE = DEFAULT_TILE_SIZE;
const BORDER_WATCH_MAX_TILE_RENDER_SIZE = DEFAULT_TILE_SIZE * 4;
const BORDER_WATCH_ZOOM_STEP_TILE_SIZE = DEFAULT_TILE_SIZE * 0.25;

export function getBaseTileSize(map: MapDefinition, canvasWidth = 896, canvasHeight = 640): number {
  if (map.width <= SMALL_MAP_THRESHOLD && map.height <= SMALL_MAP_THRESHOLD) {
    return DEFAULT_TILE_SIZE;
  }

  return Math.max(MIN_BASE_TILE_SIZE, Math.floor(Math.min(canvasWidth / map.width, canvasHeight / map.height)));
}

export function createViewport(map: MapDefinition, canvasWidth = 896, canvasHeight = 640): MapViewport {
  const baseTileSize = getBaseTileSize(map, canvasWidth, canvasHeight);
  const minZoom = BORDER_WATCH_MIN_TILE_RENDER_SIZE / baseTileSize;
  const maxZoom = BORDER_WATCH_MAX_TILE_RENDER_SIZE / baseTileSize;
  const zoomStep = BORDER_WATCH_ZOOM_STEP_TILE_SIZE / baseTileSize;
  const viewport: MapViewport = {
    zoomLevel: minZoom,
    minZoom,
    maxZoom,
    zoomStep,
    minTileRenderSize: BORDER_WATCH_MIN_TILE_RENDER_SIZE,
    maxTileRenderSize: BORDER_WATCH_MAX_TILE_RENDER_SIZE,
    zoomStepTileSize: BORDER_WATCH_ZOOM_STEP_TILE_SIZE,
    zoomReferenceScenarioId: BORDER_WATCH_REFERENCE_SCENARIO_ID,
    panOffsetX: 0,
    panOffsetY: 0
  };

  return normalizeViewport(viewport, map, canvasWidth, canvasHeight);
}

export function centerViewportOnPosition(
  viewport: MapViewport,
  focusPosition: Position,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): MapViewport {
  const normalizedViewport = normalizeViewport(viewport, map, canvasWidth, canvasHeight);
  const visibleWorldSize = getVisibleWorldSize(normalizedViewport, map, canvasWidth, canvasHeight);

  return normalizeViewport(
    {
      ...normalizedViewport,
      panOffsetX: focusPosition.x + 0.5 - visibleWorldSize.width / 2,
      panOffsetY: focusPosition.y + 0.5 - visibleWorldSize.height / 2
    },
    map,
    canvasWidth,
    canvasHeight
  );
}

export function createCenteredViewport(
  map: MapDefinition,
  focusPosition: Position,
  canvasWidth = 896,
  canvasHeight = 640
): MapViewport {
  return centerViewportOnPosition(createViewport(map, canvasWidth, canvasHeight), focusPosition, map, canvasWidth, canvasHeight);
}

export function createPanGesture(origin: ScreenPoint, viewport: MapViewport): PanGestureState {
  return {
    originScreenX: origin.x,
    originScreenY: origin.y,
    startingPanOffsetX: viewport.panOffsetX,
    startingPanOffsetY: viewport.panOffsetY,
    isActive: true
  };
}

export function createZoomGesture(
  firstPointerId: number,
  secondPointerId: number,
  firstPoint: ScreenPoint,
  secondPoint: ScreenPoint
): ZoomGestureState {
  return {
    pointerIds: [firstPointerId, secondPointerId],
    anchorScreenPoint: getMidpoint(firstPoint, secondPoint),
    initialDistance: getDistance(firstPoint, secondPoint),
    lastDistance: getDistance(firstPoint, secondPoint),
    isActive: true
  };
}

export function getScaledTileSize(viewport: MapViewport, map: MapDefinition, canvasWidth = 896, canvasHeight = 640): number {
  return getBaseTileSize(map, canvasWidth, canvasHeight) * viewport.zoomLevel;
}

export function getZoomScaleBaseline(): {
  referenceScenarioId: string;
  minTileRenderSize: number;
  maxTileRenderSize: number;
  zoomStepTileSize: number;
} {
  return {
    referenceScenarioId: BORDER_WATCH_REFERENCE_SCENARIO_ID,
    minTileRenderSize: BORDER_WATCH_MIN_TILE_RENDER_SIZE,
    maxTileRenderSize: BORDER_WATCH_MAX_TILE_RENDER_SIZE,
    zoomStepTileSize: BORDER_WATCH_ZOOM_STEP_TILE_SIZE
  };
}

export function getVisibleWorldSize(
  viewport: MapViewport,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): { width: number; height: number } {
  const scaledTileSize = getScaledTileSize(viewport, map, canvasWidth, canvasHeight);
  return {
    width: canvasWidth / scaledTileSize,
    height: canvasHeight / scaledTileSize
  };
}

export function normalizeViewport(viewport: MapViewport, map: MapDefinition, canvasWidth = 896, canvasHeight = 640): MapViewport {
  const zoomLevel = clamp(viewport.zoomLevel, viewport.minZoom, viewport.maxZoom);
  const normalizedViewport = { ...viewport, zoomLevel };
  const visibleWorldSize = getVisibleWorldSize(normalizedViewport, map, canvasWidth, canvasHeight);
  const maxPanOffsetX = Math.max(0, map.width - visibleWorldSize.width);
  const maxPanOffsetY = Math.max(0, map.height - visibleWorldSize.height);

  return {
    ...normalizedViewport,
    panOffsetX: clamp(normalizedViewport.panOffsetX, 0, maxPanOffsetX),
    panOffsetY: clamp(normalizedViewport.panOffsetY, 0, maxPanOffsetY)
  };
}

export function panViewport(
  viewport: MapViewport,
  gesture: PanGestureState,
  point: ScreenPoint,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): MapViewport {
  const scaledTileSize = getScaledTileSize(viewport, map, canvasWidth, canvasHeight);
  const deltaX = (gesture.originScreenX - point.x) / scaledTileSize;
  const deltaY = (gesture.originScreenY - point.y) / scaledTileSize;

  return normalizeViewport(
    {
      ...viewport,
      panOffsetX: gesture.startingPanOffsetX + deltaX,
      panOffsetY: gesture.startingPanOffsetY + deltaY
    },
    map,
    canvasWidth,
    canvasHeight
  );
}

export function zoomViewportAtPoint(
  viewport: MapViewport,
  deltaY: number,
  anchor: ScreenPoint,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): MapViewport {
  if (deltaY === 0) {
    return viewport;
  }

  const zoomDirection = deltaY < 0 ? 1 : -1;
  const anchorBefore = screenPointToWorldPoint(anchor, viewport, map, canvasWidth, canvasHeight);
  const nextViewport = normalizeViewport(
    {
      ...viewport,
      zoomLevel: viewport.zoomLevel + viewport.zoomStep * zoomDirection
    },
    map,
    canvasWidth,
    canvasHeight
  );
  const scaledTileSize = getScaledTileSize(nextViewport, map, canvasWidth, canvasHeight);

  return normalizeViewport(
    {
      ...nextViewport,
      panOffsetX: anchorBefore.x - anchor.x / scaledTileSize,
      panOffsetY: anchorBefore.y - anchor.y / scaledTileSize
    },
    map,
    canvasWidth,
    canvasHeight
  );
}

export function zoomViewportWithTouchGesture(
  viewport: MapViewport,
  gesture: ZoomGestureState,
  firstPoint: ScreenPoint,
  secondPoint: ScreenPoint,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): { viewport: MapViewport; zoomGesture: ZoomGestureState; interactionType: "zoom-in" | "zoom-out" | null } {
  const anchor = getMidpoint(firstPoint, secondPoint);
  const distance = getDistance(firstPoint, secondPoint);
  const nextGesture: ZoomGestureState = {
    ...gesture,
    anchorScreenPoint: anchor,
    lastDistance: distance
  };
  const distanceDelta = distance - gesture.lastDistance;
  if (Math.abs(distanceDelta) < TOUCH_ZOOM_DISTANCE_THRESHOLD) {
    return { viewport, zoomGesture: nextGesture, interactionType: null };
  }

  const interactionType = distanceDelta > 0 ? "zoom-in" : "zoom-out";
  const nextViewport = zoomViewportAtPoint(
    viewport,
    interactionType === "zoom-in" ? -100 : 100,
    anchor,
    map,
    canvasWidth,
    canvasHeight
  );

  return {
    viewport: nextViewport,
    zoomGesture: nextGesture,
    interactionType: nextViewport.zoomLevel === viewport.zoomLevel ? null : interactionType
  };
}

export function screenPointToWorldPoint(
  point: ScreenPoint,
  viewport: MapViewport,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): ScreenPoint {
  const scaledTileSize = getScaledTileSize(viewport, map, canvasWidth, canvasHeight);
  return {
    x: viewport.panOffsetX + point.x / scaledTileSize,
    y: viewport.panOffsetY + point.y / scaledTileSize
  };
}

export function worldPointToScreenPoint(
  point: ScreenPoint,
  viewport: MapViewport,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): ScreenPoint {
  const scaledTileSize = getScaledTileSize(viewport, map, canvasWidth, canvasHeight);
  return {
    x: (point.x - viewport.panOffsetX) * scaledTileSize,
    y: (point.y - viewport.panOffsetY) * scaledTileSize
  };
}

export function screenPointToWorldTile(
  point: ScreenPoint,
  viewport: MapViewport,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): Position {
  const worldPoint = screenPointToWorldPoint(point, viewport, map, canvasWidth, canvasHeight);
  return {
    x: Math.floor(worldPoint.x),
    y: Math.floor(worldPoint.y)
  };
}

export function createInteractionTarget(
  point: ScreenPoint,
  viewport: MapViewport,
  map: MapDefinition,
  canvasWidth = 896,
  canvasHeight = 640
): InteractionTarget {
  const worldPosition = screenPointToWorldTile(point, viewport, map, canvasWidth, canvasHeight);
  return {
    screenPosition: point,
    worldPosition,
    targetKind: "tile",
    targetId: null
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getDistance(firstPoint: ScreenPoint, secondPoint: ScreenPoint): number {
  return Math.hypot(secondPoint.x - firstPoint.x, secondPoint.y - firstPoint.y);
}

function getMidpoint(firstPoint: ScreenPoint, secondPoint: ScreenPoint): ScreenPoint {
  return {
    x: (firstPoint.x + secondPoint.x) / 2,
    y: (firstPoint.y + secondPoint.y) / 2
  };
}
