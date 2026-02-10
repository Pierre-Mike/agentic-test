import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("Test Endpoint API", () => {
	test("should return 200 status code", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.status()).toBe(200);
	});

	test("should return correct JSON response body", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const data = await response.json();

		expect(data).toEqual({ test: "ok" });
	});

	test("should have application/json content-type", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const contentType = response.headers()["content-type"];

		expect(contentType).toContain("application/json");
	});
});
