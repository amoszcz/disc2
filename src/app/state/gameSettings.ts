import type { GameSettings, MovementBehavior } from "../../engine/scenario/types";
import { getDefaultVisualTemplateId } from "../../render/sprites/visualTemplateConfig";
import { getVisualTemplateSource } from "../../render/sprites/visualTemplateRegistry";

const STORAGE_KEY = "disc2:game-settings:v1";

export function getDefaultGameSettings(): GameSettings {
  return { movementBehavior: "animated", visualTemplateId: getDefaultVisualTemplateId() };
}

function isMovementBehavior(value: unknown): value is MovementBehavior {
  return value === "animated" || value === "immediate";
}

export function normalizeGameSettings(value: Partial<GameSettings> | null | undefined): GameSettings {
  const defaults = getDefaultGameSettings();
  return {
    movementBehavior: isMovementBehavior(value?.movementBehavior) ? value.movementBehavior : defaults.movementBehavior,
    visualTemplateId: value?.visualTemplateId && getVisualTemplateSource(value.visualTemplateId) ? value.visualTemplateId : defaults.visualTemplateId
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
