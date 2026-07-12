import type { GameState } from "../../engine/scenario/types";
import { palette } from "../sprites/placeholders";

export function renderBattleScene(context: CanvasRenderingContext2D, state: GameState): void {
  const battle = state.battle;
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f3e6d3";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  if (!battle) {
    return;
  }

  const attackerParticipants = battle.participants.filter((entry) => entry.side === "attacker");
  const defenderParticipants = battle.participants.filter((entry) => entry.side === "defender");

  context.fillStyle = palette.text;
  context.font = "28px Georgia";
  context.fillText("Guard Battle", 24, 40);

  attackerParticipants.forEach((participant, index) => {
    const unit = state.scenario.units.find((entry) => entry.id === participant.unitId);
    if (!unit || unit.defeatState) {
      return;
    }
    context.fillStyle = palette.attacker;
    context.fillRect(60, 110 + index * 120, 120, 80);
    context.fillStyle = "#fff";
    context.fillText(unit.name, 72, 150 + index * 120);
    context.fillText(`${unit.currentHealth} HP`, 72, 180 + index * 120);
  });

  defenderParticipants.forEach((participant, index) => {
    const unit = state.scenario.units.find((entry) => entry.id === participant.unitId);
    if (!unit || unit.defeatState) {
      return;
    }
    context.fillStyle = palette.defender;
    context.fillRect(520, 110 + index * 120, 180, 80);
    context.fillStyle = "#fff";
    context.fillText(unit.name, 536, 150 + index * 120);
    context.fillText(`${unit.currentHealth} HP`, 536, 180 + index * 120);
  });
}
