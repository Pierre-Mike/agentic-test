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

	test("should return version from package.json", async () => {
		const res = await app.request("/version");
		const data = (await res.json()) as VersionResponse;

		// Read the actual package.json to verify
		const packagePath = `${import.meta.dir}/../../package.json`;
		const packageJson = await Bun.file(packagePath).json();

		expect(data.version).toBe(packageJson.version);
		expect(data.name).toBe(packageJson.name);
	});

	test("should have application/json content-type", async () => {
		const res = await app.request("/version");
		const contentType = res.headers.get("content-type");

		expect(contentType).toContain("application/json");
	});
});
