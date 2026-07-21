import type { GameState } from "../../engine/scenario/types";
import { renderVisualTemplateSelector } from "../visualTemplateSelector";
import { renderButton } from "../components/button";

export function renderSettingsPanel(state: GameState): string {
  return `<div class="overlay-box settings-panel" data-testid="settings-panel">
    <strong>Settings</strong>
    <p>Changes are saved for future games.</p>
    <label>Movement <select data-testid="movement-behavior-selector">
      <option value="animated" ${state.gameSettings.movementBehavior === "animated" ? "selected" : ""}>Animated (1 tile/second)</option>
      <option value="immediate" ${state.gameSettings.movementBehavior === "immediate" ? "selected" : ""}>Immediate</option>
    </select></label>
    <label>Fog of war <input type="checkbox" data-testid="fog-of-war-enabled-control" ${state.gameSettings.fogOfWarEnabled ? "checked" : ""}></label>
    <label>Visibility radius <input type="number" min="1" step="1" data-testid="fog-visibility-radius-control" value="${state.gameSettings.fogVisibilityRadius}"></label>
    ${renderVisualTemplateSelector(state.activeVisualTemplateId, "settings-template-selector")}
    ${renderButton({ children: "Return", className: "menu-option", testId: "settings-return-button", variant: "secondary", data: { "settings-action": "return" } })}
  </div>`;
}
