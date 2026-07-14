export function renderGuardStatusOverlay(title: string, message: string, detail?: string | null): string {
  return `
    <div class="overlay-box" data-testid="guard-status">
      <strong>${title}</strong>
      <p>${message}</p>
      ${detail ? `<p data-testid="guard-status-detail">${detail}</p>` : ""}
    </div>
  `;
}
