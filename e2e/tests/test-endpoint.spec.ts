import { test, expect } from "@playwright/test";

test.describe("/test endpoint", () => {
	const apiURL = process.env.E2E_API_URL || "http://localhost:8787";

	test("should be accessible", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.ok()).toBeTruthy();
	});

	test("should return status 200", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.status()).toBe(200);
	});

	test("should return correct JSON body", async ({ request }) => {
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
