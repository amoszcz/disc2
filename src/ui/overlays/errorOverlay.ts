export function renderErrorOverlay(message: string, detail?: string | null): string {
  return `
    <div class="overlay-box" data-testid="error-overlay">
      <strong>Message</strong>
      <p>${message}</p>
      ${detail ? `<p data-testid="error-detail">${detail}</p>` : ""}
    </div>
  `;
}
