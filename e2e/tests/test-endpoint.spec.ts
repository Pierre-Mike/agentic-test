import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("Test Endpoint", () => {
	test("GET /test returns status 200", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.status()).toBe(200);
	});

	test("GET /test returns correct JSON structure", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const data = await response.json();

		expect(data).toHaveProperty("test");
		expect(data.test).toBe("ok");
	});

	test("GET /test returns exactly {\"test\": \"ok\"}", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const data = await response.json();

		expect(data).toEqual({ test: "ok" });
	});

	test("GET /test has application/json content-type", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const contentType = response.headers()["content-type"];

		expect(contentType).toContain("application/json");
	});
});
