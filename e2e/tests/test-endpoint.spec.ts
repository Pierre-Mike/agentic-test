import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("GET /test endpoint", () => {
	test("should return status 200", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.status()).toBe(200);
	});

	test("should return response body exactly {test: 'ok'}", async ({
		request,
	}) => {
		const response = await request.get(`${apiURL}/test`);
		const body = await response.json();

		expect(body).toEqual({ test: "ok" });
	});

	test("should have application/json content-type", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		const contentType = response.headers()["content-type"];

		expect(contentType).toContain("application/json");
	});
});
