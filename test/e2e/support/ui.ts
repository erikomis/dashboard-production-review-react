import { Page } from "@playwright/test";

/** Escolhe uma aba do SegmentedControl (rádio visualmente oculto: clica no rótulo). */
export const chooseTab = (page: Page, name: RegExp) =>
  page.locator("label").filter({ has: page.getByRole("radio", { name }) }).click();
