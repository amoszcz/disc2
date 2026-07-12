import type { SceneMode } from "../../engine/scenario/types";

export interface SceneController {
  getMode(): SceneMode;
  setMode(mode: SceneMode): void;
}

export function createSceneController(initialMode: SceneMode): SceneController {
  let mode = initialMode;

  return {
    getMode() {
      return mode;
    },
    setMode(nextMode) {
      mode = nextMode;
    }
  };
}
