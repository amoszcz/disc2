export type ButtonVariant = "primary" | "secondary" | "quiet" | "icon";
export type ButtonSize = "default" | "compact";

export interface ButtonProps {
  children: string;
  id?: string;
  testId?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  busy?: boolean;
  pressed?: boolean;
  selected?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  data?: Record<string, string | number | boolean | undefined>;
}

function renderDataAttributes(data: ButtonProps["data"]): string {
  return Object.entries(data ?? {})
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => ` data-${name}="${String(value)}"`)
    .join("");
}

/** Renders the shared interactive button used by every HTML-string UI surface. */
export function renderButton({
  children,
  id,
  testId,
  className,
  type = "button",
  ariaLabel,
  title,
  disabled = false,
  busy = false,
  pressed,
  selected = false,
  variant = "primary",
  size = "default",
  data
}: ButtonProps): string {
  const classes = ["ui-button", `ui-button--${variant}`, `ui-button--${size}`, selected && "is-selected", className].filter(Boolean).join(" ");
  const isDisabled = disabled || busy;
  return `<button type="${type}" class="${classes}"${id ? ` id="${id}"` : ""}${testId ? ` data-testid="${testId}"` : ""}${ariaLabel ? ` aria-label="${ariaLabel}"` : ""}${title ? ` title="${title}"` : ""}${pressed === undefined ? "" : ` aria-pressed="${pressed}"`}${busy ? ' aria-busy="true"' : ""}${renderDataAttributes(data)}${isDisabled ? " disabled" : ""}>${children}</button>`;
}
