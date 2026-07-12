export function renderGuardStatusOverlay(message: string): string {
  return `
    <div class="overlay-box" data-testid="guard-status">
      <strong>Guarded Objective</strong>
      <p>${message}</p>
    </div>
  `;
}
