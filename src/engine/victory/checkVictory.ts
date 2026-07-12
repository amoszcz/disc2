import type { ScenarioDefinition } from "../scenario/types";

export function evaluateDefaultVictory(scenario: ScenarioDefinition): string | null {
  if (scenario.victoryCondition.type !== "eliminate-all-enemies") {
    return null;
  }

  const targetPlayers = scenario.players.filter((player) =>
    scenario.victoryCondition.targetSideIds.includes(player.id)
  );

  const allDefeated = targetPlayers.every((player) => player.defeatState);
  if (!allDefeated) {
    return null;
  }

  return scenario.players.find((player) => player.kind === "player" && !player.defeatState)?.id ?? null;
}
