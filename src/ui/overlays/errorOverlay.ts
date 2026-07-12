export function renderErrorOverlay(message: string): string {
  return `
    <div class="overlay-box" data-testid="error-overlay">
      <strong>Message</strong>
      <p>${message}</p>
    </div>
  `;
}
