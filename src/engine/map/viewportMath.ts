import type {
  InteractionTarget,
  MapDefinition,
  MapViewport,
  PanGestureState,
  Position,
  ScreenPoint
} from "../scenario/types";

const SMALL_MAP_THRESHOLD = 8;
const DEFAULT_TILE_SIZE = 96;
const MIN_BASE_TILE_SIZE = 10;
const LARGE_MAP_DEFAULT_ZOOM = 2;

export function getBaseTileSize(map: MapDefinition, canvasWidth = 896, canvasHeight = 640): number {
  if (map.width <= SMALL_MAP_THRESHOLD && map.height <= SMALL_MAP_THRESHOLD) {
    return DEFAULT_TILE_SIZE;
  }

  return Math.max(MIN_BASE_TILE_SIZE, Math.floor(Math.min(canvasWidth / map.width, canvasHeight / map.height)));
}

export function createViewport(map: MapDefinition, canvasWidth = 896, canvasHeight = 640): MapViewport {
  const viewport: MapViewport = {
    zoomLevel: map.width > 16 || map.height > 16 ? LARGE_MAP_DEFAULT_ZOOM : 1,
    minZoom: 1,
    maxZoom: 4,
    zoomStep: 0.25,
    panOffsetX: 0,
    panOffsetY: 0
  };

  return normalizeViewport(viewport, map, canvasWidth, canvasHeight);
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

export function getScaledTileSize(viewport: MapViewport, map: MapDefinition, canvasWidth = 896, canvasHeight = 640): number {
  return getBaseTileSize(map, canvasWidth, canvasHeight) * viewport.zoomLevel;
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
