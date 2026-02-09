import { test, expect } from "@playwright/test";

test.describe("/test endpoint", () => {
	test("returns status 200", async ({ request }) => {
		const response = await request.get("/api/test");
		expect(response.status()).toBe(200);
	});

	test("returns correct JSON response body", async ({ request }) => {
		const response = await request.get("/api/test");
		const data = await response.json();

		expect(data).toEqual({ test: "ok" });
	});

	test("has application/json content-type", async ({ request }) => {
		const response = await request.get("/api/test");
		const contentType = response.headers()["content-type"];

		expect(contentType).toContain("application/json");
	});

	test("returns consistent response on multiple requests", async ({ request }) => {
		const response1 = await request.get("/api/test");
		const response2 = await request.get("/api/test");

		const data1 = await response1.json();
		const data2 = await response2.json();

		expect(data1).toEqual({ test: "ok" });
		expect(data2).toEqual({ test: "ok" });
		expect(data1).toEqual(data2);
	});
});
