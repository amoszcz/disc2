import { IMMEDIATE_MOVEMENT_BEHAVIOR, type GameSettings, type MovementBehavior } from "../../engine/scenario/types";
import { getDefaultVisualTemplateId } from "../../render/sprites/visualTemplateConfig";
import { getVisualTemplateSource } from "../../render/sprites/visualTemplateRegistry";
import { DEFAULT_FOG_VISIBILITY_RADIUS } from "../../engine/map/fogOfWar";

const STORAGE_KEY = "disc2:game-settings:v1";

export function getDefaultGameSettings(): GameSettings {
  return {
    movementBehavior: "animated",
    visualTemplateId: getDefaultVisualTemplateId(),
    fogOfWarEnabled: true,
    fogVisibilityRadius: DEFAULT_FOG_VISIBILITY_RADIUS
  };
}

function isMovementBehavior(value: unknown): value is MovementBehavior {
  return value === "animated" || value === IMMEDIATE_MOVEMENT_BEHAVIOR;
}

/** Immediate is the sole movement setting that bypasses timed route traversal. */
export function isImmediateMovementBehavior(value: string): boolean {
  return value === IMMEDIATE_MOVEMENT_BEHAVIOR;
}

export function normalizeGameSettings(value: Partial<GameSettings> | null | undefined): GameSettings {
  const defaults = getDefaultGameSettings();
  return {
    movementBehavior: isMovementBehavior(value?.movementBehavior) ? value.movementBehavior : defaults.movementBehavior,
    visualTemplateId: value?.visualTemplateId && getVisualTemplateSource(value.visualTemplateId) ? value.visualTemplateId : defaults.visualTemplateId,
    fogOfWarEnabled: typeof value?.fogOfWarEnabled === "boolean" ? value.fogOfWarEnabled : defaults.fogOfWarEnabled,
    fogVisibilityRadius:
      typeof value?.fogVisibilityRadius === "number" && Number.isInteger(value.fogVisibilityRadius) && value.fogVisibilityRadius > 0
        ? value.fogVisibilityRadius
        : defaults.fogVisibilityRadius
  };
}

export function loadGameSettings(): GameSettings {
  if (typeof window === "undefined") return getDefaultGameSettings();
  try {
    return normalizeGameSettings(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return getDefaultGameSettings();
  }
}

export function saveGameSettings(settings: GameSettings): GameSettings {
  const normalized = normalizeGameSettings(settings);
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch { /* storage is optional */ }
  }
  return normalized;
}
