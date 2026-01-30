import { describe, expect, test } from "bun:test";
import app from "./index";
import type { HealthResponse, VersionResponse } from "shared/dist";

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

describe("/health endpoint", () => {
	test("should return status 200", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
	});

	test("should return JSON with correct structure", async () => {
		const res = await app.request("/health");
		const data = (await res.json()) as HealthResponse;

		expect(data).toHaveProperty("status");
		expect(data.status).toBe("ok");
	});

	test("should have application/json content-type", async () => {
		const res = await app.request("/health");
		const contentType = res.headers.get("content-type");

		expect(contentType).toContain("application/json");
	});
});
