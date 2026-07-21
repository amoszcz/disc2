import type { GameState } from "../../engine/scenario/types";
import { renderButton } from "../components/button";

export function renderVictoryMenu(state: GameState): string {
  const scenarioName = state.activeScenarioId
    ? state.availableScenarioOptions.find((option) => option.id === state.activeScenarioId)?.label ?? "Scenario"
    : "Scenario";
  const isMobile = state.mobileLayoutState.layoutMode === "mobile";

  return `
    <div class="overlay-box" data-testid="victory-panel">
      <strong>Victory</strong>
      <p>${scenarioName} is complete.</p>
      <p>${isMobile ? "The run is complete. Use the button below to return to the menu and start again." : "The guards have been defeated and the scenario is complete."}</p>
      ${renderButton({ id: "return-to-menu-button", testId: "return-to-menu-button", children: "Return to Menu" })}
    </div>
  `;
}
