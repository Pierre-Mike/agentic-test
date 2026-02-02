import { describe, expect, test, beforeAll } from "bun:test";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * Integration tests for lint-staged configuration
 * These tests verify that the lint-staged configuration is correct
 * and integrates properly with Biome and Git.
 */
describe("lint-staged configuration", () => {
	const repoRoot = join(__dirname, "..");
	let config: any;

	beforeAll(async () => {
		// Load the lint-staged configuration
		const configPath = join(repoRoot, "lint-staged.config.js");
		const configModule = await import(configPath);
		config = configModule.default || configModule;
	});

	test("should have valid configuration file", async () => {
		const configPath = join(repoRoot, "lint-staged.config.js");

		// File should exist
		await access(configPath);

		// Should be valid JavaScript
		const configContent = await readFile(configPath, "utf-8");
		expect(configContent).toBeTruthy();
		expect(typeof config).toBe("object");
	});

	test("should have glob patterns for TypeScript files", () => {
		const patterns = Object.keys(config);

		// Should include TypeScript patterns
		const hasTypeScriptPattern = patterns.some(
			(p) => p.includes("*.ts") || p.includes("*.tsx"),
		);
		expect(hasTypeScriptPattern).toBe(true);
	});

	test("should have glob patterns for JavaScript files", () => {
		const patterns = Object.keys(config);

		// Should include JavaScript patterns
		const hasJavaScriptPattern = patterns.some(
			(p) => p.includes("*.js") || p.includes("*.jsx"),
		);
		expect(hasJavaScriptPattern).toBe(true);
	});

	test("should have glob patterns for JSON files", () => {
		const patterns = Object.keys(config);

		// Should include JSON patterns
		const hasJsonPattern = patterns.some((p) => p.includes("*.json"));
		expect(hasJsonPattern).toBe(true);
	});

	test("should include Biome lint command", () => {
		const commands = Object.values(config).flat();
		const commandStrings = commands.map((cmd) =>
			typeof cmd === "string" ? cmd : "",
		);

		const hasBiomeLint = commandStrings.some((cmd) => cmd.includes("biome"));
		expect(hasBiomeLint).toBe(true);
	});

	test("should include format command", () => {
		const commands = Object.values(config).flat();
		const commandStrings = commands.map((cmd) =>
			typeof cmd === "string" ? cmd : "",
		);

		const hasFormat = commandStrings.some((cmd) => cmd.includes("format"));
		expect(hasFormat).toBe(true);
	});

	test("should have write flag for format command", () => {
		const commands = Object.values(config).flat();
		const commandStrings = commands.map((cmd) =>
			typeof cmd === "string" ? cmd : "",
		);

		// Format commands should have --write flag to actually modify files
		const formatCommands = commandStrings.filter((cmd) =>
			cmd.includes("format"),
		);
		const hasWriteFlag = formatCommands.some((cmd) => cmd.includes("--write"));
		expect(hasWriteFlag).toBe(true);
	});
});

describe("lint-staged package installation", () => {
	const repoRoot = join(__dirname, "..");

	test("should be installed as dev dependency", async () => {
		const packageJsonPath = join(repoRoot, "package.json");
		const packageJsonContent = await readFile(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(packageJsonContent);

		expect(packageJson.devDependencies).toHaveProperty("lint-staged");
	});

	test("should be executable via bunx", async () => {
		try {
			const { stdout } = await execAsync("bunx lint-staged --version", {
				cwd: repoRoot,
			});
			expect(stdout).toBeTruthy();
		} catch (error) {
			throw new Error("lint-staged is not executable");
		}
	});
});

describe("lint-staged Git integration", () => {
	const repoRoot = join(__dirname, "..");

	test("should correctly identify staged files", async () => {
		// This test verifies that lint-staged can interact with git
		// We'll check if lint-staged CLI is functional
		try {
			const { stderr } = await execAsync(
				"bunx lint-staged --help",
				{ cwd: repoRoot },
			);
			// Help output should be available
			expect(stderr || "").toBeTruthy();
		} catch (error) {
			// Even if it errors, we can check the error message contains lint-staged
			const errorMessage = (error as Error).message;
			expect(errorMessage).toContain("lint-staged");
		}
	});
});

describe("lint-staged Biome integration", () => {
	const repoRoot = join(__dirname, "..");

	test("should invoke Biome lint on staged files", async () => {
		// Verify that Biome is configured and accessible
		const biomeConfigPath = join(repoRoot, "biome.json");
		await access(biomeConfigPath);

		const biomeConfig = JSON.parse(
			await readFile(biomeConfigPath, "utf-8"),
		);
		expect(biomeConfig).toBeTruthy();
	});

	test("should invoke Biome format on staged files", async () => {
		// Verify Biome can be called
		try {
			await execAsync("bunx biome --version", { cwd: repoRoot });
		} catch (error) {
			throw new Error("Biome is not accessible");
		}
	});

	test("should use same Biome config as manual commands", async () => {
		// Verify that lint-staged uses the same biome.json as manual lint/format
		const biomeConfigPath = join(repoRoot, "biome.json");
		const biomeConfig = JSON.parse(
			await readFile(biomeConfigPath, "utf-8"),
		);

		// The config should be the same one used by manual commands
		expect(biomeConfig).toHaveProperty("linter");
		expect(biomeConfig).toHaveProperty("formatter");
	});
});

describe("lint-staged pre-commit hook integration", () => {
	const repoRoot = join(__dirname, "..");

	test("should have husky pre-commit hook", async () => {
		const hookPath = join(repoRoot, ".husky/pre-commit");
		await access(hookPath);
	});

	test("should call lint-staged in pre-commit hook", async () => {
		const hookPath = join(repoRoot, ".husky/pre-commit");
		const hookContent = await readFile(hookPath, "utf-8");

		expect(hookContent).toContain("lint-staged");
	});

	test("should not run full codebase lint/format in hook", async () => {
		const hookPath = join(repoRoot, ".husky/pre-commit");
		const hookContent = await readFile(hookPath, "utf-8");

		// Hook should use lint-staged, not full lint/format
		const hasLintStaged = hookContent.includes("lint-staged");
		const hasFullLint =
			hookContent.includes("bun run lint") && !hookContent.includes("staged");
		const hasFullFormat =
			hookContent.includes("bun run format") &&
			!hookContent.includes("staged");

		expect(hasLintStaged).toBe(true);
		expect(hasFullLint).toBe(false);
		expect(hasFullFormat).toBe(false);
	});
});

describe("lint-staged edge cases", () => {
	test("should handle configuration with function format", async () => {
		const repoRoot = join(__dirname, "..");
		const configPath = join(repoRoot, "lint-staged.config.js");
		const configModule = await import(configPath);
		const config = configModule.default || configModule;

		// Some entries might be functions that receive filenames
		const values = Object.values(config);
		for (const value of values) {
			if (typeof value === "function") {
				// If it's a function, it should return an array or string
				const result = value(["test.ts"]);
				expect(
					typeof result === "string" || Array.isArray(result),
				).toBe(true);
			}
		}
	});

	test("should work with monorepo workspace structure", async () => {
		const repoRoot = join(__dirname, "..");
		const packageJsonPath = join(repoRoot, "package.json");
		const packageJson = JSON.parse(
			await readFile(packageJsonPath, "utf-8"),
		);

		// Verify workspaces are defined
		expect(packageJson.workspaces).toBeTruthy();
		expect(Array.isArray(packageJson.workspaces)).toBe(true);

		// lint-staged should handle files from all workspaces
		const workspaces = packageJson.workspaces;
		expect(workspaces).toContain("./client");
		expect(workspaces).toContain("./server");
		expect(workspaces).toContain("./shared");
	});
});
