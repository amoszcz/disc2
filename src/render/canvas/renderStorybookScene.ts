import type { GameState, StorybookPreviewSubject, StorybookSubjectSelection } from "../../engine/scenario/types";
import { drawResolvedVisualTemplate, resolveStorybookPreviewTemplate } from "../sprites/visualTemplateResolver";

interface StorybookPreviewDiagnostic {
  subjectId: string;
  subjectKind: StorybookPreviewSubject["subjectKind"];
  subjectType: string;
  requestedStateName: string | null;
  resolvedStateName: string | null;
  stateDirection: StorybookSubjectSelection["direction"];
  isFallback: boolean;
  assetKind: "dedicated" | "fallback";
}

const diagnostics: StorybookPreviewDiagnostic[] = [];

function syncDiagnosticsToWindow(): void {
  if (typeof window === "undefined") {
    return;
  }

  (window as Window & { __storybookPreviewDiagnostics?: StorybookPreviewDiagnostic[] }).__storybookPreviewDiagnostics = [...diagnostics];
}

export function resetStorybookPreviewDiagnostics(): void {
  diagnostics.length = 0;
  syncDiagnosticsToWindow();
}

export function getStorybookPreviewDiagnostics(): StorybookPreviewDiagnostic[] {
  return [...diagnostics];
}

function recordStorybookPreviewDiagnostic(subject: StorybookPreviewSubject, selection: StorybookSubjectSelection): void {
  const resolved = resolveStorybookPreviewTemplate(subject, selection);
  diagnostics.push({
    subjectId: subject.subjectId,
    subjectKind: subject.subjectKind,
    subjectType: subject.subjectType,
    requestedStateName: resolved.requestedStateName ?? null,
    resolvedStateName: resolved.resolvedStateName ?? null,
    stateDirection: resolved.stateDirection ?? selection.direction ?? null,
    isFallback: resolved.isFallback,
    assetKind: resolved.assetKind
  });
  syncDiagnosticsToWindow();
}

export function renderStorybookPreviewTile(
  context: CanvasRenderingContext2D,
  subject: StorybookPreviewSubject,
  selection: StorybookSubjectSelection,
  bounds = { x: 0, y: 0, width: context.canvas.width, height: context.canvas.height },
  recordDiagnostic = false
): void {
  context.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
  context.fillStyle = "#f7ecd6";
  context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

  const tilePadding = Math.max(8, Math.floor(Math.min(bounds.width, bounds.height) * 0.12));
  const tileBounds = {
    x: bounds.x + tilePadding,
    y: bounds.y + tilePadding,
    width: bounds.width - tilePadding * 2,
    height: bounds.height - tilePadding * 2
  };

  context.fillStyle = "#efe1bf";
  context.fillRect(tileBounds.x, tileBounds.y, tileBounds.width, tileBounds.height);
  context.strokeStyle = "#a98856";
  context.lineWidth = 2;
  context.strokeRect(tileBounds.x, tileBounds.y, tileBounds.width, tileBounds.height);

  const resolved = resolveStorybookPreviewTemplate(subject, selection);
  drawResolvedVisualTemplate(context, resolved, tileBounds);

  if (recordDiagnostic) {
    recordStorybookPreviewDiagnostic(subject, selection);
  }
}

export function renderStorybookScene(context: CanvasRenderingContext2D, state: GameState): void {
  resetStorybookPreviewDiagnostics();

  const storybookState = state.storybookState;
  if (!storybookState || storybookState.subjects.length === 0) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#f7ecd6";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#23170d";
    context.textAlign = "center";
    context.font = "28px Georgia";
    context.fillText("No storybook subjects are available.", context.canvas.width / 2, context.canvas.height / 2);
    context.textAlign = "start";
    syncDiagnosticsToWindow();
    return;
  }

  const selectedSubject =
    storybookState.subjects.find((subject) => subject.subjectId === storybookState.selectedSubjectId) ?? storybookState.subjects[0];
  const selection = storybookState.subjectSelections[selectedSubject.subjectId] ?? {
    stateName: selectedSubject.defaultStateName,
    direction: selectedSubject.defaultDirection
  };

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f7ecd6";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  context.fillStyle = "#23170d";
  context.textAlign = "center";
  context.font = `700 ${Math.max(28, Math.floor(context.canvas.width / 22))}px Georgia`;
  context.fillText(selectedSubject.displayName, context.canvas.width / 2, 72);
  context.font = `${Math.max(16, Math.floor(context.canvas.width / 46))}px Georgia`;
  context.fillText(
    `${selectedSubject.categoryLabel} • ${selection.stateName}${selection.direction ? ` (${selection.direction})` : ""}`,
    context.canvas.width / 2,
    104
  );
  context.textAlign = "start";

  renderStorybookPreviewTile(
    context,
    selectedSubject,
    selection,
    {
      x: Math.floor(context.canvas.width * 0.18),
      y: 138,
      width: Math.floor(context.canvas.width * 0.64),
      height: Math.floor(context.canvas.height * 0.58)
    },
    true
  );

  context.fillStyle = "#4f3b21";
  context.font = `${Math.max(14, Math.floor(context.canvas.width / 56))}px Georgia`;
  context.textAlign = "center";
  context.fillText(
    "Use the storybook panel to switch preview states and inspect fallbacks.",
    context.canvas.width / 2,
    context.canvas.height - 54
  );
  context.textAlign = "start";
}
