import { describe, expect, test } from "bun:test";
import app from "./index";
import type { VersionResponse } from "shared/dist";

describe("/version endpoint", () => {
	test("should return status 200", async () => {
		const res = await app.request("/version");
		expect(res.status).toBe(200);
	});

	test("should return JSON with correct structure", async () => {
		const res = await app.request("/version");
		const data = (await res.json()) as VersionResponse;

		expect(data).toHaveProperty("version");
		expect(data).toHaveProperty("name");
		expect(typeof data.version).toBe("string");
		expect(typeof data.name).toBe("string");
	});

	test("should return default version when no env bindings", async () => {
		const res = await app.request("/version");
		const data = (await res.json()) as VersionResponse;

		expect(data.version).toBe("0.0.0");
		expect(data.name).toBe("server");
	});

	test("should have application/json content-type", async () => {
		const res = await app.request("/version");
		const contentType = res.headers.get("content-type");

		expect(contentType).toContain("application/json");
	});
});

describe("/test endpoint", () => {
	test("should return status 200", async () => {
		const res = await app.request("/test");
		expect(res.status).toBe(200);
	});

	test("should return JSON with correct structure", async () => {
		const res = await app.request("/test");
		const data = await res.json();

		expect(data).toHaveProperty("test");
		expect(data.test).toBe("ok");
	});

	test("should return exactly {\"test\": \"ok\"}", async () => {
		const res = await app.request("/test");
		const data = await res.json();

		expect(data).toEqual({ test: "ok" });
	});

	test("should have application/json content-type", async () => {
		const res = await app.request("/test");
		const contentType = res.headers.get("content-type");

		expect(contentType).toContain("application/json");
	});

	test("should only respond to GET requests", async () => {
		const postRes = await app.request("/test", { method: "POST" });
		expect(postRes.status).toBe(404);

		const putRes = await app.request("/test", { method: "PUT" });
		expect(putRes.status).toBe(404);

		const deleteRes = await app.request("/test", { method: "DELETE" });
		expect(deleteRes.status).toBe(404);
	});

	test("response should be consistent across multiple calls", async () => {
		const res1 = await app.request("/test");
		const data1 = await res1.json();

		const res2 = await app.request("/test");
		const data2 = await res2.json();

		expect(data1).toEqual(data2);
		expect(data1).toEqual({ test: "ok" });
	});
});
