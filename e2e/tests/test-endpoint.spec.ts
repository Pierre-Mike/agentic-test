import { test, expect } from "@playwright/test";
import { apiURL } from "../playwright.config";

test.describe("Test Endpoint", () => {
	test("GET /test returns correct response", async ({ request }) => {
		const response = await request.get(`${apiURL}/test`);

		// Validate response status is 200
		expect(response.status()).toBe(200);

		// Validate response body is {"test": "ok"}
		const data = await response.json();
		expect(data).toEqual({ test: "ok" });

		// Validate content-type header is application/json
		const contentType = response.headers()["content-type"];
		expect(contentType).toContain("application/json");
	});
});
