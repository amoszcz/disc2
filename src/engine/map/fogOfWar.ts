import type { FogOfWarState, FogTileState, GameState, Position } from "../scenario/types";
import { isWithinBounds } from "./mapRules";
import { resolveCampaignMap } from "../scenario/loadScenario";

export const DEFAULT_FOG_VISIBILITY_RADIUS = 3;

export function fogTileKey(position: Position): string {
  return `${position.x},${position.y}`;
}

export function createFogOfWarState(): FogOfWarState {
  return { visitedTilesByMapId: {} };
}

export function getCurrentVisibleTileKeys(state: GameState): Set<string> {
  const visible = new Set<string>();
  const radius = state.gameSettings.fogVisibilityRadius;
  const map = resolveCampaignMap(state.scenario, state.mapTravelState.activeMapId);

  for (const hero of state.scenario.heroes) {
    if (hero.ownerPlayerId !== state.activePlayerId || hero.availabilityState === "defeated" || hero.mapId !== state.mapTravelState.activeMapId) continue;
    for (let y = hero.mapPosition.y - radius; y <= hero.mapPosition.y + radius; y += 1) {
      for (let x = hero.mapPosition.x - radius; x <= hero.mapPosition.x + radius; x += 1) {
        const horizontalDistance = x - hero.mapPosition.x;
        const verticalDistance = y - hero.mapPosition.y;
        if (horizontalDistance ** 2 + verticalDistance ** 2 <= radius ** 2 && isWithinBounds(map, { x, y })) {
          visible.add(fogTileKey({ x, y }));
        }
      }
    }
  }

  return visible;
}

export function refreshFogOfWar(state: GameState): void {
  const mapId = state.mapTravelState.activeMapId;
  const visited = new Set(state.fogOfWar.visitedTilesByMapId[mapId] ?? []);
  for (const key of getCurrentVisibleTileKeys(state)) visited.add(key);
  state.fogOfWar.visitedTilesByMapId[mapId] = [...visited];
}

export function getFogTileState(state: GameState, position: Position): FogTileState {
  if (!state.gameSettings.fogOfWarEnabled) return "visible";
  const key = fogTileKey(position);
  if (getCurrentVisibleTileKeys(state).has(key)) return "visible";
  return (state.fogOfWar.visitedTilesByMapId[state.mapTravelState.activeMapId] ?? []).includes(key) ? "visited" : "unexplored";
}
