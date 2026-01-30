import { test, expect } from "@playwright/test";

test.describe("/test endpoint", () => {
	const apiBaseUrl = process.env.API_BASE_URL || "http://localhost:8787";

	test("endpoint is accessible via HTTP GET request", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		expect(response.ok()).toBeTruthy();
	});

	test("returns status 200", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		expect(response.status()).toBe(200);
	});

	test("returns correct JSON structure with test property", async ({
		request,
	}) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		const data = await response.json();

		expect(data).toHaveProperty("test");
	});

	test("returns test property with value 'ok'", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		const data = await response.json();

		expect(data.test).toBe("ok");
	});

	test("has application/json content-type header", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`);
		const contentType = response.headers()["content-type"];

		expect(contentType).toContain("application/json");
	});

	test("endpoint works alongside existing endpoints without conflicts", async ({
		request,
	}) => {
		const testResponse = await request.get(`${apiBaseUrl}/test`);
		const versionResponse = await request.get(`${apiBaseUrl}/version`);

		expect(testResponse.status()).toBe(200);
		expect(versionResponse.status()).toBe(200);

		const testData = await testResponse.json();
		const versionData = await versionResponse.json();

		expect(testData.test).toBe("ok");
		expect(versionData).toHaveProperty("version");
	});

	test("handles requests with query parameters gracefully", async ({
		request,
	}) => {
		const response = await request.get(`${apiBaseUrl}/test?foo=bar&baz=qux`);
		expect(response.status()).toBe(200);

		const data = await response.json();
		expect(data.test).toBe("ok");
	});

	test("only accepts GET requests", async ({ request }) => {
		const postResponse = await request.post(`${apiBaseUrl}/test`);
		expect(postResponse.status()).not.toBe(200);
		expect([404, 405]).toContain(postResponse.status());

		const putResponse = await request.put(`${apiBaseUrl}/test`);
		expect(putResponse.status()).not.toBe(200);
		expect([404, 405]).toContain(putResponse.status());

		const deleteResponse = await request.delete(`${apiBaseUrl}/test`);
		expect(deleteResponse.status()).not.toBe(200);
		expect([404, 405]).toContain(deleteResponse.status());
	});

	test("handles multiple concurrent requests correctly", async ({
		request,
	}) => {
		const requests = Array.from({ length: 10 }, () =>
			request.get(`${apiBaseUrl}/test`),
		);

		const responses = await Promise.all(requests);

		for (const response of responses) {
			expect(response.status()).toBe(200);
			const data = await response.json();
			expect(data.test).toBe("ok");
		}
	});

	test("works with minimal HTTP headers", async ({ request }) => {
		const response = await request.get(`${apiBaseUrl}/test`, {
			headers: {},
		});

		expect(response.status()).toBe(200);
		const data = await response.json();
		expect(data.test).toBe("ok");
	});
});
