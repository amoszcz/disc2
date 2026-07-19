import type { GameState } from "../../engine/scenario/types";
import { renderVisualTemplateSelector } from "../visualTemplateSelector";

export function renderSettingsPanel(state: GameState): string {
  return `<div class="overlay-box settings-panel" data-testid="settings-panel">
    <strong>Settings</strong>
    <p>Changes are saved for future games.</p>
    <label>Movement <select data-testid="movement-behavior-selector">
      <option value="animated" ${state.gameSettings.movementBehavior === "animated" ? "selected" : ""}>Animated (1 tile/second)</option>
      <option value="immediate" ${state.gameSettings.movementBehavior === "immediate" ? "selected" : ""}>Immediate</option>
    </select></label>
    ${renderVisualTemplateSelector(state.activeVisualTemplateId, "settings-template-selector")}
    <button type="button" class="menu-option" data-testid="settings-return-button" data-settings-action="return">Return</button>
  </div>`;
}
