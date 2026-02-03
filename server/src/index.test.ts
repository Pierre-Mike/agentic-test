import { describe, expect, test } from "bun:test";
import app from "./index";
import type { TestResponse, VersionResponse } from "shared/dist";

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

	test("should return JSON with correct structure {test: 'ok'}", async () => {
		const res = await app.request("/test");
		const data = (await res.json()) as TestResponse;

		expect(data).toHaveProperty("test");
		expect(data.test).toBe("ok");
		expect(typeof data.test).toBe("string");
	});

	test("should have application/json content-type", async () => {
		const res = await app.request("/test");
		const contentType = res.headers.get("content-type");

		expect(contentType).toContain("application/json");
	});
});
