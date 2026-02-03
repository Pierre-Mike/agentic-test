import { describe, expect, test } from "bun:test";

describe("GitHub Actions Badge URL Validation", () => {
	const owner = "Pierre-Mike";
	const repo = "agentic-test";

	const createBadgeUrl = (workflowFile: string): string => {
		return `https://github.com/${owner}/${repo}/actions/workflows/${workflowFile}/badge.svg`;
	};

	const isValidBadgeUrl = (url: string): boolean => {
		const badgeUrlPattern =
			/^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/actions\/workflows\/[a-zA-Z0-9_-]+\.yml\/badge\.svg$/;
		return badgeUrlPattern.test(url);
	};

	test("should generate valid CI workflow badge URL", () => {
		const badgeUrl = createBadgeUrl("ci.yml");
		expect(badgeUrl).toBe(
			"https://github.com/Pierre-Mike/agentic-test/actions/workflows/ci.yml/badge.svg",
		);
		expect(isValidBadgeUrl(badgeUrl)).toBe(true);
	});

	test("should generate valid workflow smoke test badge URL", () => {
		const badgeUrl = createBadgeUrl("workflow-smoke-test.yml");
		expect(badgeUrl).toBe(
			"https://github.com/Pierre-Mike/agentic-test/actions/workflows/workflow-smoke-test.yml/badge.svg",
		);
		expect(isValidBadgeUrl(badgeUrl)).toBe(true);
	});

	test("should validate badge URL format", () => {
		expect(
			isValidBadgeUrl(
				"https://github.com/Pierre-Mike/agentic-test/actions/workflows/ci.yml/badge.svg",
			),
		).toBe(true);
		expect(
			isValidBadgeUrl(
				"https://github.com/Pierre-Mike/agentic-test/actions/workflows/workflow-smoke-test.yml/badge.svg",
			),
		).toBe(true);
	});

	test("should reject invalid badge URLs", () => {
		// Invalid domain
		expect(
			isValidBadgeUrl(
				"https://gitlab.com/owner/repo/actions/workflows/ci.yml/badge.svg",
			),
		).toBe(false);

		// Missing .yml extension
		expect(
			isValidBadgeUrl(
				"https://github.com/owner/repo/actions/workflows/ci/badge.svg",
			),
		).toBe(false);

		// Invalid path
		expect(
			isValidBadgeUrl("https://github.com/owner/repo/workflows/ci.yml"),
		).toBe(false);

		// Missing badge.svg
		expect(
			isValidBadgeUrl("https://github.com/owner/repo/actions/workflows/ci.yml"),
		).toBe(false);
	});

	test("should validate repository owner and name format", () => {
		const validOwner = /^[a-zA-Z0-9_-]+$/;
		const validRepo = /^[a-zA-Z0-9_-]+$/;

		expect(owner).toMatch(validOwner);
		expect(repo).toMatch(validRepo);
	});

	test("should ensure badge URLs use HTTPS", () => {
		const badgeUrl = createBadgeUrl("ci.yml");
		expect(badgeUrl.startsWith("https://")).toBe(true);
	});
});
