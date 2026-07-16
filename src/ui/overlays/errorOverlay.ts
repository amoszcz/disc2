export function renderErrorOverlay(
  message: string,
  detail?: string | null,
  title: "Message" | "Travel" | "Route" = "Message"
): string {
  return `
    <div class="overlay-box" data-testid="error-overlay">
      <strong>${title}</strong>
      <p>${message}</p>
      ${detail ? `<p data-testid="error-detail">${detail}</p>` : ""}
    </div>
  `;
}
