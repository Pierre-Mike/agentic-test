import { describe, expect, test } from "bun:test";
import { greet } from "./greet";

describe("greet", () => {
	test("should return greeting with the provided name", () => {
		const result = greet("Alice");
		expect(result).toBe("Hello, Alice!");
	});

	test("should return a string", () => {
		const result = greet("Bob");
		expect(typeof result).toBe("string");
	});

	test("should handle empty string", () => {
		const result = greet("");
		expect(result).toBe("Hello, !");
	});

	test("should handle special characters in name", () => {
		const result = greet("O'Brien");
		expect(result).toBe("Hello, O'Brien!");
	});

	test("should handle unicode characters", () => {
		const result = greet("José");
		expect(result).toBe("Hello, José!");
	});

	test("should handle long names", () => {
		const longName = "Alexander Hamilton Wellington";
		const result = greet(longName);
		expect(result).toBe(`Hello, ${longName}!`);
	});
});
