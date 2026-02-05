import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("/test endpoint", () => {
	test("should return status 200", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.status()).toBe(200);
	});

	test("should have application/json content-type", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const contentType = response.headers()["content-type"];
		expect(contentType).toContain("application/json");
	});

	test("should return exactly {\"test\": \"ok\"}", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const data = await response.json();
		expect(data).toEqual({ test: "ok" });
	});
});
