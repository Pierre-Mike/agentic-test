import { test, expect } from "@playwright/test";

test.describe("/test endpoint", () => {
	const apiBaseUrl = "http://localhost:8787";

	test("should be accessible via GET request", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		expect(response.ok()).toBeTruthy();
		expect(response.status()).toBe(200);
	});

	test("should return valid JSON", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		const contentType = response.headers()["content-type"];
		expect(contentType).toContain("application/json");
	});

	test("should return correct response structure", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		const data = await response.json();

		expect(data).toHaveProperty("test");
		expect(data.test).toBe("ok");
	});

	test("should handle multiple concurrent requests", async ({ request }) => {
		const requests = Array.from({ length: 5 }, () =>
			request.get(`${apiBaseUrl}/test`),
		);

		const responses = await Promise.all(requests);

		for (const response of responses) {
			expect(response.status()).toBe(200);
			const data = await response.json();
			expect(data.test).toBe("ok");
		}
	});

	test("should return consistent response", async ({ request }) => {
		const firstResponse = await request.get(`${apiBaseUrl}/test`);
		const firstData = await firstResponse.json();

		const secondResponse = await request.get(`${apiBaseUrl}/test`);
		const secondData = await secondResponse.json();

		expect(firstData).toEqual(secondData);
	});
});
