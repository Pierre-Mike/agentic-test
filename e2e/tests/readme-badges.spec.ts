import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test.describe("README.md CI/CD Status Badges", () => {
	let readmeContent: string;

	test.beforeAll(() => {
		const readmePath = join(__dirname, "../../README.md");
		readmeContent = readFileSync(readmePath, "utf-8");
	});

	test("should contain a CI/CD Status section after Production Environment", () => {
		const cicdSectionRegex = /## CI\/CD Status/;
		expect(readmeContent).toMatch(cicdSectionRegex);

		// Verify it comes after Production Environment section
		const productionIndex = readmeContent.indexOf("## Production Environment");
		const cicdIndex = readmeContent.indexOf("## CI/CD Status");
		expect(cicdIndex).toBeGreaterThan(productionIndex);
	});

	test("should contain CI workflow badge", () => {
		const ciBadgeRegex =
			/!\[CI\]\(https:\/\/github\.com\/Pierre-Mike\/agentic-test\/actions\/workflows\/ci\.yml\/badge\.svg\)/;
		expect(readmeContent).toMatch(ciBadgeRegex);
	});

	test("should contain Workflow Smoke Test badge", () => {
		const workflowBadgeRegex =
			/!\[Workflow Smoke Test\]\(https:\/\/github\.com\/Pierre-Mike\/agentic-test\/actions\/workflows\/workflow-smoke-test\.yml\/badge\.svg\)/;
		expect(readmeContent).toMatch(workflowBadgeRegex);
	});

	test("should have badges in the correct order", () => {
		const ciIndex = readmeContent.indexOf(
			"https://github.com/Pierre-Mike/agentic-test/actions/workflows/ci.yml/badge.svg",
		);
		const workflowIndex = readmeContent.indexOf(
			"https://github.com/Pierre-Mike/agentic-test/actions/workflows/workflow-smoke-test.yml/badge.svg",
		);

		expect(ciIndex).toBeGreaterThan(-1);
		expect(workflowIndex).toBeGreaterThan(-1);
		expect(ciIndex).toBeLessThan(workflowIndex);
	});

	test("should contain descriptions for badges", () => {
		const cicdSection = readmeContent.split("## CI/CD Status")[1];
		expect(cicdSection).toBeTruthy();

		// Should mention what CI badge monitors
		const ciRelatedKeywords = ["lint", "test", "type-check", "build"];
		const hasAtLeastOneCiKeyword = ciRelatedKeywords.some((keyword) =>
			cicdSection.toLowerCase().includes(keyword),
		);
		expect(hasAtLeastOneCiKeyword).toBe(true);
	});

	test("should have properly formatted GitHub Actions badge URLs", () => {
		// Test that badge URLs follow the correct format
		const badgeUrlPattern =
			/https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/actions\/workflows\/[a-zA-Z0-9_-]+\.yml\/badge\.svg/;

		const ciMatch = readmeContent.match(
			/!\[CI\]\((https:\/\/github\.com\/[^\)]+)\)/,
		);
		const workflowMatch = readmeContent.match(
			/!\[Workflow Smoke Test\]\((https:\/\/github\.com\/[^\)]+)\)/,
		);

		expect(ciMatch?.[1]).toMatch(badgeUrlPattern);
		expect(workflowMatch?.[1]).toMatch(badgeUrlPattern);
	});
});
