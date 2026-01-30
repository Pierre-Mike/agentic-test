import { describe, expect, test } from "bun:test";
import { greet } from "./greet";

describe("greet", () => {
	test("should return greeting with name", () => {
		const result = greet("World");
		expect(result).toBe("Hello, World!");
	});

	test("should return greeting with different names", () => {
		expect(greet("Alice")).toBe("Hello, Alice!");
		expect(greet("Bob")).toBe("Hello, Bob!");
	});

	test("should return a string", () => {
		const result = greet("Test");
		expect(typeof result).toBe("string");
	});

	test("should handle empty string", () => {
		const result = greet("");
		expect(result).toBe("Hello, !");
	});

	test("should handle names with spaces", () => {
		const result = greet("John Doe");
		expect(result).toBe("Hello, John Doe!");
	});

	test("should handle special characters", () => {
		const result = greet("José");
		expect(result).toBe("Hello, José!");
	});
});
