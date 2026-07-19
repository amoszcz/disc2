import type { GameState } from "../../engine/scenario/types";
import type { MapDefinition } from "../../engine/scenario/types";
import type { FacingDirection, HeroVisualStateRuntime, ObjectAnimationStateName } from "../../engine/scenario/types";
import { resolveMovementObjectStack } from "../../engine/map/movementObjectLookup";
import { resolveTerrainTile } from "../../engine/map/terrainLookup";
import { getBaseTileSize } from "../../engine/map/viewportMath";
import { palette } from "../sprites/placeholders";
import { routePreviewPalette } from "../sprites/placeholders";
import {
  drawResolvedVisualTemplate,
  recordVisualTemplateDiagnostic,
  resetVisualTemplateDiagnostics,
  resolveHeroVisualTemplate,
  resolveMovementObjectVisualTemplate,
  resolveResourcePickupVisualTemplate,
  resolveTerrainVisualTemplate
} from "../sprites/visualTemplateResolver";
import { renderGuardedLocations } from "./renderGuardedLocations";
import { createTileVisualBounds, getViewportRenderMetrics, worldTileToCanvasPoint } from "./viewportRender";

export function getTileSize(map: MapDefinition, canvas?: HTMLCanvasElement): number {
  return getBaseTileSize(map, canvas?.width, canvas?.height);
}

function getMovementObjectVisualState(objectType: string): ObjectAnimationStateName {
  switch (objectType) {
    case "teleport":
    case "cave":
    case "exit":
      return "active";
    default:
      return "idle";
  }
}

function getRouteDirection(heroState: HeroVisualStateRuntime | undefined, heroPosition: { x: number; y: number }, nextPosition: { x: number; y: number } | undefined): FacingDirection {
  if (!nextPosition) {
    return heroState?.direction ?? "down";
  }

  if (nextPosition.x > heroPosition.x) {
    return "right";
  }
  if (nextPosition.x < heroPosition.x) {
    return "left";
  }
  if (nextPosition.y > heroPosition.y) {
    return "down";
  }
  return "up";
}

function getHeroRenderPosition(state: GameState, heroId: string, fallbackPosition: { x: number; y: number }): { x: number; y: number } {
  const traversal = state.activeTraversal;
  if (!traversal || traversal.heroId !== heroId) return fallbackPosition;

  const progress = Math.min(1, Math.max(0, traversal.progress));
  return {
    x: traversal.fromPosition.x + (traversal.toPosition.x - traversal.fromPosition.x) * progress,
    y: traversal.fromPosition.y + (traversal.toPosition.y - traversal.fromPosition.y) * progress
  };
}

export function renderMapScene(context: CanvasRenderingContext2D, state: GameState): void {
  const { map } = state.scenario;
  const activeMapId = state.mapTravelState.activeMapId;
  const metrics = getViewportRenderMetrics(state, context.canvas);
  const tileSize = metrics.scaledTileSize;

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f6ecd0";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  resetVisualTemplateDiagnostics("map");

  for (let y = metrics.startTileY; y < metrics.endTileY; y += 1) {
    for (let x = metrics.startTileX; x < metrics.endTileX; x += 1) {
      const terrainTile = state.scenario.terrainRegions?.length ? resolveTerrainTile(state.scenario, { x, y }) : null;
      const point = worldTileToCanvasPoint({ x, y }, metrics.viewport, context.canvas, map);
      const terrainType = terrainTile?.terrainType ?? state.scenario.map.defaultTerrainType ?? "plains";
      const terrainTemplate = resolveTerrainVisualTemplate(terrainType);
      recordVisualTemplateDiagnostic({ subjectKind: "terrain", subjectType: terrainType, sceneContext: "map" }, terrainTemplate);
      drawResolvedVisualTemplate(context, terrainTemplate, createTileVisualBounds(point, tileSize, 0));
      context.strokeStyle = palette.tileBorder;
      context.strokeRect(point.x, point.y, tileSize, tileSize);

        const movementObjects = resolveMovementObjectStack(state.scenario, { x, y });
        if (movementObjects.effects.length > 0) {
          const primaryObject = movementObjects.effects[0];
        const primaryTemplate = resolveMovementObjectVisualTemplate(primaryObject.objectType, getMovementObjectVisualState(primaryObject.objectType));
        recordVisualTemplateDiagnostic(
          { subjectKind: "movement-object", subjectType: primaryObject.objectType, sceneContext: "map" },
          primaryTemplate
        );
        drawResolvedVisualTemplate(context, primaryTemplate, {
          x: point.x + tileSize * 0.08,
          y: point.y + tileSize * 0.16,
          width: tileSize * 0.84,
          height: tileSize * 0.68
        });

        if (movementObjects.effects.length > 1) {
          const secondaryTemplate = resolveMovementObjectVisualTemplate(
            movementObjects.effects[1].objectType,
            getMovementObjectVisualState(movementObjects.effects[1].objectType)
          );
          recordVisualTemplateDiagnostic(
            { subjectKind: "movement-object", subjectType: movementObjects.effects[1].objectType, sceneContext: "map" },
            secondaryTemplate
          );
          drawResolvedVisualTemplate(context, secondaryTemplate, {
            x: point.x + tileSize * 0.58,
            y: point.y + tileSize * 0.52,
            width: tileSize * 0.28,
            height: tileSize * 0.28
          });
        }
      }
    }
  }

  const routePreview = state.activeRoutePreview;
  const routeOwner = routePreview ? state.scenario.heroes.find((hero) => hero.id === routePreview.heroId) : null;
  if (routePreview && routeOwner && routeOwner.mapId === activeMapId && routePreview.steps.length > 0) {
    const pathPoints = [routeOwner.mapPosition, ...routePreview.steps.map((step) => step.position)].map((position) =>
      worldTileToCanvasPoint(position, metrics.viewport, context.canvas, map)
    );
    context.strokeStyle = routePreviewPalette.line;
    context.lineWidth = Math.max(2, Math.floor(tileSize / 14));
    context.setLineDash([Math.max(4, Math.floor(tileSize / 5)), Math.max(3, Math.floor(tileSize / 7))]);
    context.beginPath();
    context.moveTo(pathPoints[0].x + tileSize / 2, pathPoints[0].y + tileSize / 2);
    for (const point of pathPoints.slice(1)) {
      context.lineTo(point.x + tileSize / 2, point.y + tileSize / 2);
    }
    context.stroke();
    context.setLineDash([]);

    for (const point of pathPoints.slice(1, -1)) {
      context.fillStyle = routePreviewPalette.dot;
      context.beginPath();
      context.arc(point.x + tileSize / 2, point.y + tileSize / 2, Math.max(2, Math.floor(tileSize / 10)), 0, Math.PI * 2);
      context.fill();
    }

    const destinationPoint = pathPoints[pathPoints.length - 1];
    context.strokeStyle = routePreviewPalette.pole;
    context.lineWidth = Math.max(2, Math.floor(tileSize / 18));
    context.beginPath();
    context.moveTo(destinationPoint.x + tileSize / 2, destinationPoint.y + tileSize - Math.max(4, Math.floor(tileSize / 8)));
    context.lineTo(destinationPoint.x + tileSize / 2, destinationPoint.y + Math.max(4, Math.floor(tileSize / 10)));
    context.stroke();
    context.fillStyle = routePreviewPalette.flag;
    context.beginPath();
    context.moveTo(destinationPoint.x + tileSize / 2, destinationPoint.y + Math.max(4, Math.floor(tileSize / 10)));
    context.lineTo(destinationPoint.x + tileSize - Math.max(4, Math.floor(tileSize / 10)), destinationPoint.y + Math.max(8, Math.floor(tileSize / 4)));
    context.lineTo(destinationPoint.x + tileSize / 2, destinationPoint.y + Math.max(10, Math.floor(tileSize / 3)));
    context.closePath();
    context.fill();
    context.lineWidth = 1;
  }

  for (const pickup of state.scenario.resourcePickups.filter(
    (entry) => !entry.collectedState && entry.mapId === activeMapId
  )) {
    const point = worldTileToCanvasPoint(pickup.mapPosition, metrics.viewport, context.canvas, map);
    const pickupTemplate = resolveResourcePickupVisualTemplate(pickup);
    recordVisualTemplateDiagnostic(
      { subjectKind: "resource-pickup", subjectType: pickup.resourceType, sceneContext: "map" },
      pickupTemplate
    );
    drawResolvedVisualTemplate(context, pickupTemplate, {
      x: point.x + tileSize * 0.2,
      y: point.y + tileSize * 0.2,
      width: tileSize * 0.6,
      height: tileSize * 0.6
    });
  }

  renderGuardedLocations(
    context,
    tileSize,
    state.scenario.guardedLocations.filter((location) => location.mapId === activeMapId),
    metrics.viewport,
    map
  );

  for (const hero of state.scenario.heroes.filter(
    (entry) => entry.availabilityState !== "defeated" && entry.mapId === activeMapId
  )) {
    const point = worldTileToCanvasPoint(getHeroRenderPosition(state, hero.id, hero.mapPosition), metrics.viewport, context.canvas, map);
    const trackedHeroState = state.visualStates.heroStates[hero.id];
    const routeOwnedByHero = state.activeRoutePreview?.heroId === hero.id ? state.activeRoutePreview : null;
    const effectiveHeroState =
      routeOwnedByHero && routeOwnedByHero.isAwaitingConfirmation
        ? { stateName: "start-move" as const, direction: getRouteDirection(trackedHeroState, hero.mapPosition, routeOwnedByHero.steps[0]?.position) }
        : trackedHeroState;
    const heroTemplate = resolveHeroVisualTemplate(hero, effectiveHeroState);
    recordVisualTemplateDiagnostic({ subjectKind: "hero", subjectType: hero.name, sceneContext: "map" }, heroTemplate);
    drawResolvedVisualTemplate(context, heroTemplate, {
      x: point.x + tileSize * 0.08,
      y: point.y + tileSize * 0.06,
      width: tileSize * 0.84,
      height: tileSize * 0.84
    });

    if (state.selectedHeroId === hero.id) {
      context.strokeStyle = "#fff";
      context.lineWidth = Math.max(1, Math.floor(tileSize / 20));
      context.strokeRect(
        point.x + Math.max(2, Math.floor(tileSize / 8)),
        point.y + Math.max(2, Math.floor(tileSize / 8)),
        tileSize - Math.max(4, Math.floor(tileSize / 4)),
        tileSize - Math.max(4, Math.floor(tileSize / 4))
      );
      context.lineWidth = 1;
    }
  }
}
