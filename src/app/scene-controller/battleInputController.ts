import type { GameStore } from "../state/gameState";
import {
  activeBattleUnitIsPlayerControlled,
  advanceBattleQueue,
  canBattleContinue,
  canBattleStrike,
  getActingBattleSide,
  performAutomaticBattleAction,
  performDefendAction,
  performStrikeAction,
  trySelectBattleTarget
} from "../../engine/battle/battleTurnEngine";
import { findBattleFormationSlotByUnitId, getBattleCanvasSlotCenter, BATTLE_SLOT_HEIGHT, BATTLE_SLOT_WIDTH } from "../../engine/battle/battleFormation";
import { getBattleUnit } from "../../engine/battle/battleTargeting";
import { resolveBattleOutcome } from "../../engine/battle/resolveBattleOutcome";
import { applyBattleOutcome } from "../state/applyBattleOutcome";
import { checkScenarioEnd } from "./checkScenarioEnd";
import type { GameState, ScreenPoint } from "../../engine/scenario/types";

function getCanvasPoint(canvas: HTMLCanvasElement, event: MouseEvent | PointerEvent): ScreenPoint {
  const bounds = canvas.getBoundingClientRect();
  const scaleX = canvas.width / bounds.width;
  const scaleY = canvas.height / bounds.height;

  return {
    x: (event.clientX - bounds.left) * scaleX,
    y: (event.clientY - bounds.top) * scaleY
  };
}

function resolveBattleConclusion(state: GameState): boolean {
  if (!state.battle || canBattleContinue(state, state.battle)) {
    return false;
  }

  resolveBattleOutcome(state, state.battle);
  applyBattleOutcome(state);
  state.battle = null;
  state.sceneMode = "map";
  checkScenarioEnd(state);
  return true;
}

function continueBattleUntilPlayerTurn(state: GameState): void {
  while (state.battle && !activeBattleUnitIsPlayerControlled(state, state.battle)) {
    const message = performAutomaticBattleAction(state, state.battle);
    state.messageLog.push(message);

    if (resolveBattleConclusion(state)) {
      return;
    }

    advanceBattleQueue(state, state.battle);
  }
}

function resolvePlayerBattleAction(state: GameState, message: string): void {
  state.messageLog.push(message);

  if (resolveBattleConclusion(state)) {
    return;
  }

  if (!state.battle) {
    return;
  }

  advanceBattleQueue(state, state.battle);
  continueBattleUntilPlayerTurn(state);
}

function findClickedBattleUnitId(state: GameState, point: ScreenPoint): string | null {
  const battle = state.battle;
  if (!battle) {
    return null;
  }

  const slotWidth = (BATTLE_SLOT_WIDTH * state.responsiveCanvasView.pixelWidth) / 896;
  const slotHeight = (BATTLE_SLOT_HEIGHT * state.responsiveCanvasView.pixelHeight) / 640;

  for (const participant of battle.participants) {
    const slot = findBattleFormationSlotByUnitId(battle.formation, participant.unitId);
    if (!slot) {
      continue;
    }

    const unit = getBattleUnit(state, participant.unitId);
    if (unit.defeatState || unit.currentHealth <= 0) {
      continue;
    }

    const center = getBattleCanvasSlotCenter(slot, state.responsiveCanvasView.pixelWidth, state.responsiveCanvasView.pixelHeight);
    const minX = center.x - slotWidth / 2;
    const maxX = center.x + slotWidth / 2;
    const minY = center.y - slotHeight / 2;
    const maxY = center.y + slotHeight / 2;

    if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) {
      return participant.unitId;
    }
  }

  return null;
}

export function bindBattleActionInput(container: HTMLElement, store: GameStore): void {
  const strikeButton = container.querySelector<HTMLButtonElement>("#battle-attack-button");
  const defendButton = container.querySelector<HTMLButtonElement>("#battle-defend-button");

  if (strikeButton) {
    strikeButton.onclick = () => {
      store.update((state) => {
        if (state.sceneMode !== "battle" || !state.battle || !activeBattleUnitIsPlayerControlled(state, state.battle)) {
          return;
        }

        if (!canBattleStrike(state, state.battle)) {
          state.messageLog.push("Select a legal target before striking.");
          return;
        }

        const message = performStrikeAction(state, state.battle);
        resolvePlayerBattleAction(state, message);
      });
    };
  }

  if (defendButton) {
    defendButton.onclick = () => {
      store.update((state) => {
        if (state.sceneMode !== "battle" || !state.battle || !activeBattleUnitIsPlayerControlled(state, state.battle)) {
          return;
        }

        const message = performDefendAction(state, state.battle);
        resolvePlayerBattleAction(state, message);
      });
    };
  }
}

export function bindBattleCanvasInput(canvas: HTMLCanvasElement, store: GameStore): void {
  const selectBattleTarget = (point: ScreenPoint, pointerType: string): void => {
    store.update((state) => {
      if (state.sceneMode !== "battle" || !state.battle || !activeBattleUnitIsPlayerControlled(state, state.battle)) {
        return;
      }

      state.lastTouchInteraction = {
        interactionType: "tap",
        screenPosition: point,
        targetKind: "none",
        targetId: null,
        gesturePhase: "end"
      };
      const targetUnitId = findClickedBattleUnitId(state, point);
      if (!targetUnitId) {
        return;
      }

      const actingSide = getActingBattleSide(state.battle);
      const clickedSide = state.battle.participants.find((entry) => entry.unitId === targetUnitId)?.side;
      if (!clickedSide || clickedSide === actingSide) {
        return;
      }

      if (trySelectBattleTarget(state, state.battle, targetUnitId)) {
        const target = getBattleUnit(state, targetUnitId);
        state.lastTouchInteraction.targetId = targetUnitId;
        state.lastTouchInteraction.targetKind = pointerType === "touch" ? "hero" : "tile";
        state.messageLog.push(`${target.name} is selected as the strike target.`);
      }
    });
  };

  canvas.addEventListener("click", (event) => {
    if (event.button !== 0) {
      return;
    }

    selectBattleTarget(getCanvasPoint(canvas, event), "mouse");
  });

  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerType === "mouse") {
      return;
    }

    selectBattleTarget(getCanvasPoint(canvas, event), event.pointerType);
  });
}
