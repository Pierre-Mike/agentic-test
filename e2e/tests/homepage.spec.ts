import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("Homepage", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("./");
	});

	test("displays the main heading", async ({ page }) => {
		await expect(page.locator("h1")).toHaveText("bhvr");
	});

	test("displays the subheading", async ({ page }) => {
		await expect(page.locator("h2")).toHaveText("Bun + Hono + Vite + React");
	});

	test("displays the logo", async ({ page }) => {
		const logo = page.locator('img[alt="beaver logo"]');
		await expect(logo).toBeVisible();
	});

	test("displays the Call API button", async ({ page }) => {
		const button = page.getByRole("button", { name: "Call API" });
		await expect(button).toBeVisible();
	});

	test("displays the Docs link", async ({ page }) => {
		const docsLink = page.getByRole("link", { name: "Docs" });
		await expect(docsLink).toBeVisible();
		await expect(docsLink).toHaveAttribute("href", "https://bhvr.dev");
	});

	test("logo links to GitHub repository", async ({ page }) => {
		const logoLink = page.locator(
			'a[href="https://github.com/stevedylandev/bhvr"]',
		);
		await expect(logoLink).toBeVisible();
	});

	test("test endpoint returns correct response", async () => {
		const response = await fetch(`${apiURL}/test`);

		expect(response.status).toBe(200);

		const contentType = response.headers.get("content-type");
		expect(contentType).toContain("application/json");

		const data = await response.json();
		expect(data).toEqual({ test: "ok" });
	});
});
