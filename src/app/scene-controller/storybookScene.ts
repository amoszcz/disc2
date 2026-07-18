import type { GameStore } from "../state/gameState";
import { renderStorybookScene, renderStorybookPreviewTile } from "../../render/canvas/renderStorybookScene";
import { renderStorybookPanel } from "../../ui/overlays/storybookPanel";
import { returnToMainMenu, selectStorybookSubject, updateStorybookSubjectSelection } from "../state/gameState";
import { bindVisualTemplateSelector } from "../../ui/visualTemplateSelector";

export function renderStorybookSidebar(store: GameStore, container: HTMLElement): void {
  container.innerHTML = renderStorybookPanel(store.getState());
  bindVisualTemplateSelector(container, store);

  const returnButton = container.querySelector<HTMLButtonElement>("#storybook-return-button");
  if (returnButton) {
    returnButton.onclick = () => {
      store.update((state) => {
        returnToMainMenu(state);
      });
    };
  }

  for (const select of container.querySelectorAll<HTMLSelectElement>("[data-storybook-subject-id]")) {
    select.onchange = () => {
      const subjectId = select.dataset.storybookSubjectId;
      if (!subjectId) {
        return;
      }

      store.update((state) => {
        selectStorybookSubject(state, subjectId);
        updateStorybookSubjectSelection(state, subjectId, select.value);
      });
    };
  }

  const state = store.getState();
  for (const canvas of container.querySelectorAll<HTMLCanvasElement>("[data-storybook-preview-id]")) {
    const subjectId = canvas.dataset.storybookPreviewId;
    const storybookState = state.storybookState;
    const subject = storybookState?.subjects.find((entry) => entry.subjectId === subjectId);
    if (!storybookState || !subject) {
      continue;
    }

    const selection = storybookState.subjectSelections[subject.subjectId] ?? {
      stateName: subject.defaultStateName,
      direction: subject.defaultDirection
    };
    const context = canvas.getContext("2d");
    if (!context) {
      continue;
    }

    renderStorybookPreviewTile(context, subject, selection);
    canvas.onclick = () => {
      store.update((nextState) => {
        selectStorybookSubject(nextState, subject.subjectId);
      });
    };
  }
}

export function drawStorybookScene(store: GameStore, context: CanvasRenderingContext2D): void {
  renderStorybookScene(context, store.getState());
}
