import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("Test Endpoint", () => {
	test("should be accessible via HTTP", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response).toBeTruthy();
	});

	test("should return status 200", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);
		expect(response.status()).toBe(200);
	});

	test("should return correct JSON body", async ({ request }) => {
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
