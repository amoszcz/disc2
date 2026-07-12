import type { GameStore } from "../state/gameState";
import { moveSelectedHero, selectHero } from "../../engine/map/heroActions";
import { getTileSize } from "../../render/canvas/renderMapScene";
import { startGuardEncounter } from "../../engine/map/startGuardEncounter";
import { setBattleState } from "../state/gameState";

export function bindMapInput(canvas: HTMLCanvasElement, store: GameStore): void {
  canvas.addEventListener("click", (event) => {
    const bounds = canvas.getBoundingClientRect();
    const tileSize = getTileSize();
    const scaleX = canvas.width / bounds.width;
    const scaleY = canvas.height / bounds.height;
    const canvasX = (event.clientX - bounds.left) * scaleX;
    const canvasY = (event.clientY - bounds.top) * scaleY;
    const x = Math.floor(canvasX / tileSize);
    const y = Math.floor(canvasY / tileSize);

    store.update((state) => {
      if (state.sceneMode !== "map") {
        return;
      }

      const heroAtTile = state.scenario.heroes.find(
        (hero) => hero.mapPosition.x === x && hero.mapPosition.y === y && hero.availabilityState !== "defeated"
      );

      if (heroAtTile) {
        const result = selectHero(state, heroAtTile.id);
        if (!result.ok && result.reason) {
          state.messageLog.push(result.reason);
        }
        return;
      }

      const result = moveSelectedHero(state, { x, y });
      if (!result.ok) {
        state.messageLog.push(result.reason ?? "That move is not allowed.");
        return;
      }

      const encounter = state.selectedHeroId
        ? startGuardEncounter(state, state.selectedHeroId)
        : { ok: false as const, reason: "No hero is selected." };
      if (encounter.ok) {
        setBattleState(state, encounter.battle);
        state.messageLog.push(`The guards of ${encounter.location.name} attack.`);
      }
    });
  });
}
