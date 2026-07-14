export function renderGuardStatusOverlay(title: string, message: string, detail?: string | null): string {
  return `
    <div class="overlay-box" data-testid="guard-status">
      <strong data-testid="guard-status-title">${title}</strong>
      <p data-testid="guard-status-message">${message}</p>
      ${detail ? `<p data-testid="guard-status-detail">${detail}</p>` : ""}
    </div>
  `;
}
