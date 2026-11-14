import { test, expect } from "@playwright/test";

test.describe("Jezero Expedition Intelligence Smoke Tests", () => {
  test("full mission walkthrough", async ({ page }) => {
    // 1. Load app
    await page.goto("/");
    await expect(page.locator("header")).toContainText("Jezero Expedition Intelligence");

    // 2. Select T7 (Cheyava Falls / Bright Angel)
    const t7Button = page.locator("button[role='listitem']", { hasText: "T7" });
    await expect(t7Button).toBeVisible();
    await t7Button.click();

    // 3. Assert T7 potential-biosignature copy (non-negotiable pass/fail rule)
    const rightPanel = page.locator("aside").last();
    await expect(rightPanel).toContainText("Potential biosignature — not confirmed evidence of life.");

    // 4. Assert counter-evidence visible by default (Scheller et al. 2024)
    await expect(rightPanel).toContainText("Counter-evidence / Limitations");
    await expect(rightPanel).toContainText("Scheller et al. (2024)");

    // 5. Assert source link resolves with valid attributes
    const sourceLink = rightPanel.locator("a[target='_blank']").first();
    await expect(sourceLink).toBeVisible();
    await expect(sourceLink).toHaveAttribute("rel", "noopener noreferrer");

    // 6. Toggle Route R1 mode in header
    const routeButton = page.locator("header button", { hasText: "Route R1" });
    await routeButton.click();

    // 7. Assert Route Panel numbers & non-negotiable warning
    const routePanel = page.locator("div", { hasText: "Science Traverse R1" }).first();
    await expect(routePanel).toBeVisible();
    await expect(routePanel).toContainText("23.3 km");
    await expect(routePanel).toContainText("+452 m");
    await expect(routePanel).toContainText("29.9%");
    await expect(routePanel).toContainText("Rover traverse segment. Not a human-rated route.");

    // 8. Toggle EVA Sortie mode in header
    const evaButton = page.locator("header button", { hasText: "EVA Sortie" });
    await evaButton.click();
    await expect(page.locator("h1", { hasText: "EVA Sortie Planning" })).toBeVisible();
    await expect(page.locator("text=NOTIONAL ANCHOR")).toBeVisible();
    await expect(page.locator("aside")).toContainText("Operational Constraints");
  });
});
