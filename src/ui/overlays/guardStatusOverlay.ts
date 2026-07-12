export function renderGuardStatusOverlay(title: string, message: string): string {
  return `
    <div class="overlay-box" data-testid="guard-status">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
  `;
}
