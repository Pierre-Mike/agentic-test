import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";
import type { TestResponse } from "shared/dist";

test.describe("API /test endpoint", () => {
	test("should be accessible", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.ok()).toBeTruthy();
	});

	test("should return status 200", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.status()).toBe(200);
	});

	test("should return correct response body structure", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const data = (await response.json()) as TestResponse;

		expect(data).toHaveProperty("test");
		expect(data.test).toBe("ok");
	});

	test("should have application/json content-type", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const contentType = response.headers()["content-type"];

		expect(contentType).toContain("application/json");
	});
});
