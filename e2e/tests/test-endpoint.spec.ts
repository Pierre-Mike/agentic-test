import { test, expect } from "@playwright/test";

test.describe("/test endpoint", () => {
	test("returns correct response", async ({ request }) => {
		const response = await request.get("http://localhost:8787/test");

		expect(response.status()).toBe(200);

		const contentType = response.headers()["content-type"];
		expect(contentType).toContain("application/json");

		const data = await response.json();
		expect(data).toEqual({ test: "ok" });
	});

	test("works without query parameters", async ({ request }) => {
		const response = await request.get("http://localhost:8787/test");

		expect(response.status()).toBe(200);
		const data = await response.json();
		expect(data.test).toBe("ok");
	});

	test("works when accessed multiple times", async ({ request }) => {
		const response1 = await request.get("http://localhost:8787/test");
		const response2 = await request.get("http://localhost:8787/test");
		const response3 = await request.get("http://localhost:8787/test");

		expect(response1.status()).toBe(200);
		expect(response2.status()).toBe(200);
		expect(response3.status()).toBe(200);

		const data1 = await response1.json();
		const data2 = await response2.json();
		const data3 = await response3.json();

		expect(data1).toEqual({ test: "ok" });
		expect(data2).toEqual({ test: "ok" });
		expect(data3).toEqual({ test: "ok" });
	});
});
