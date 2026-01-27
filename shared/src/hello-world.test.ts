import { describe, expect, test } from "bun:test";
import { greet } from "./hello-world";

describe("greet", () => {
	test("should return 'Hello, World!'", () => {
		const result = greet();
		expect(result).toBe("Hello, World!");
	});

	test("should return a string", () => {
		const result = greet();
		expect(typeof result).toBe("string");
	});
});
