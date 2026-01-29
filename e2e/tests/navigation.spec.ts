import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
	test("homepage loads successfully", async ({ page }) => {
		const response = await page.goto("./");
		expect(response?.status()).toBe(200);
	});

	test("page has correct title structure", async ({ page }) => {
		await page.goto("./");
		await expect(page).toHaveTitle(/bhvr|Vite/i);
	});

	test("page renders without JavaScript errors", async ({ page }) => {
		const errors: string[] = [];
		page.on("pageerror", (error) => {
			errors.push(error.message);
		});

		await page.goto("./");
		await page.waitForLoadState("networkidle");

		expect(errors).toHaveLength(0);
	});
});
