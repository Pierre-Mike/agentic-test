import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("API Endpoints", () => {
	test.describe("/test endpoint", () => {
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

		test("should handle CORS headers", async ({ request }) => {
			const response = await request.get(`${apiURL}/test`, {
				headers: {
					Origin: "http://localhost:5173",
				},
			});
			expect(response.status()).toBe(200);
		});
	});
});
