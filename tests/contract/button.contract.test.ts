import { describe, expect, it } from "vitest";
import { renderButton } from "../../src/ui/components/button";

describe("shared button", () => {
  it("renders the default native button with supplied identity and disabled behavior", () => {
    const html = renderButton({ children: "Continue", id: "continue", testId: "continue", disabled: true });

    expect(html).toContain('type="button"');
    expect(html).toContain('class="ui-button ui-button--primary ui-button--default"');
    expect(html).toContain('id="continue"');
    expect(html).toContain('data-testid="continue"');
    expect(html).toContain("disabled");
  });

  it("supports the interaction and metadata states used throughout the UI", () => {
    const html = renderButton({
      children: "Save",
      id: "save-button",
      testId: "save-button",
      ariaLabel: "Save changes",
      title: "Save changes",
      variant: "secondary",
      size: "compact",
      selected: true,
      pressed: true,
      busy: true,
      data: { action: "save" }
    });

    expect(html).toContain('class="ui-button ui-button--secondary ui-button--compact is-selected"');
    expect(html).toContain('aria-label="Save changes"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-action="save"');
    expect(html).toContain("disabled");
  });

  it("supports all current visual treatments, types, and pass-through action data", () => {
    const quiet = renderButton({ children: "Dismiss", type: "reset", variant: "quiet", size: "compact", data: { "menu-action": "dismiss", count: 2, enabled: true } });
    const icon = renderButton({ children: "+", ariaLabel: "Zoom in", title: "Zoom in", variant: "icon" });

    expect(quiet).toContain('type="reset"');
    expect(quiet).toContain('ui-button--quiet');
    expect(quiet).toContain('ui-button--compact');
    expect(quiet).toContain('data-menu-action="dismiss"');
    expect(quiet).toContain('data-count="2"');
    expect(quiet).toContain('data-enabled="true"');
    expect(icon).toContain('ui-button--icon');
    expect(icon).toContain('aria-label="Zoom in"');
    expect(icon).toContain('title="Zoom in"');
  });
});
