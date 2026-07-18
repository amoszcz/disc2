import type { GameState, StorybookPreviewSubject } from "../../engine/scenario/types";
import { resolveStorybookPreviewTemplate } from "../../render/sprites/visualTemplateResolver";
import { renderVisualTemplateSelector } from "../visualTemplateSelector";

function renderSubjectEntry(state: GameState, subject: StorybookPreviewSubject): string {
  const selection = state.storybookState?.subjectSelections[subject.subjectId] ?? {
    stateName: subject.defaultStateName,
    direction: subject.defaultDirection
  };
  const resolved = resolveStorybookPreviewTemplate(subject, selection);
  const selected = state.storybookState?.selectedSubjectId === subject.subjectId;

  const options = subject.stateOptions
    .map(
      (option) => `
        <option value="${option.optionId}" ${option.optionId === `${selection.stateName}${selection.direction ? `-${selection.direction}` : ""}` ? "selected" : ""}>
          ${option.label}
        </option>
      `
    )
    .join("");

  return `
    <article class="overlay-box storybook-entry ${selected ? "is-selected" : ""}" data-testid="storybook-entry-${subject.subjectId}">
      <div class="storybook-entry-heading">
        <strong>${subject.displayName}</strong>
        <span>${subject.categoryLabel}</span>
      </div>
      <div class="storybook-entry-controls">
        <canvas
          width="${subject.previewTileStyle.tileWidth}"
          height="${subject.previewTileStyle.tileHeight}"
          aria-label="${subject.displayName} storybook preview"
          data-testid="storybook-preview-${subject.subjectId}"
          data-storybook-preview-id="${subject.subjectId}"></canvas>
        <div class="storybook-entry-form">
          <label for="storybook-state-${subject.subjectId}">State</label>
          <select
            id="storybook-state-${subject.subjectId}"
            data-testid="storybook-state-${subject.subjectId}"
            data-storybook-subject-id="${subject.subjectId}">
            ${options}
          </select>
          <p data-testid="storybook-status-${subject.subjectId}">
            ${resolved.isFallback ? "Fallback preview" : "Dedicated preview"} • ${resolved.resolvedStateName ?? selection.stateName}
          </p>
        </div>
      </div>
    </article>
  `;
}

export function renderStorybookPanel(state: GameState): string {
  const storybookState = state.storybookState;
  const selectedSubject = storybookState?.subjects.find((subject) => subject.subjectId === storybookState.selectedSubjectId) ?? null;
  const transitionSummary =
    storybookState?.lastTransition && storybookState.lastChangedSubjectId
      ? `${storybookState.lastTransition.previousStateLabel} -> ${storybookState.lastTransition.nextStateLabel}`
      : "Choose any listed state to inspect the selected asset.";

  return `
    <div class="overlay-box storybook-panel" data-testid="storybook-panel">
      <strong>Asset Storybook</strong>
      <p data-testid="storybook-message">
        Inspect supported heroes, battle units, and objects through resolver-backed preview tiles.
      </p>
      ${renderVisualTemplateSelector(state.activeVisualTemplateId, "storybook-template-selector")}
      <div data-testid="storybook-selected-subject">
        ${selectedSubject ? `${selectedSubject.displayName} (${selectedSubject.categoryLabel})` : "No subject selected"}
      </div>
      <p data-testid="storybook-transition-summary">${transitionSummary}</p>
      <button type="button" id="storybook-return-button" data-testid="storybook-return-button">Return to Menu</button>
      <div data-testid="storybook-entry-list">
        ${(storybookState?.subjects ?? []).map((subject) => renderSubjectEntry(state, subject)).join("")}
      </div>
    </div>
  `;
}
