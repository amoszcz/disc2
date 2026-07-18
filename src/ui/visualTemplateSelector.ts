import type { GameStore } from "../app/state/gameState";
import { selectVisualTemplate } from "../app/state/gameState";
import { getReadyVisualTemplateSources } from "../render/sprites/visualTemplateRegistry";

export function renderVisualTemplateSelector(activeTemplateId: string, testId = "visual-template-selector"): string {
  const options = getReadyVisualTemplateSources()
    .map((source) => `<option value="${source.templateId}" ${source.templateId === activeTemplateId ? "selected" : ""}>${source.label}</option>`)
    .join("");
  return `<label class="visual-template-selector">Template <select data-testid="${testId}" data-visual-template-selector>${options}</select></label>`;
}

export function bindVisualTemplateSelector(container: HTMLElement, store: GameStore, beforeChange?: (nextId: string) => boolean): void {
  const select = container.querySelector<HTMLSelectElement>("[data-visual-template-selector]");
  if (!select) return;
  select.onchange = () => {
    const nextId = select.value;
    if (beforeChange && !beforeChange(nextId)) {
      select.value = store.getState().activeVisualTemplateId;
      return;
    }
    store.update((state) => { selectVisualTemplate(state, nextId); });
  };
}
