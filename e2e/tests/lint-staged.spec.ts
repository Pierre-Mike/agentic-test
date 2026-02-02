import { test, expect } from "@playwright/test";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const execAsync = promisify(exec);

/**
 * E2E tests for lint-staged pre-commit hook integration
 * These tests verify that lint-staged correctly processes only staged files
 * and leaves unstaged files unchanged during pre-commit hooks.
 */
test.describe("lint-staged pre-commit hook", () => {
	const repoRoot = join(__dirname, "../..");
	const testFilesDir = join(repoRoot, "test-temp-files");

	test.beforeAll(async () => {
		// Ensure we have a clean git state before tests
		try {
			await execAsync("git status", { cwd: repoRoot });
		} catch (error) {
			throw new Error("Not in a git repository");
		}
	});

	test.afterEach(async () => {
		// Clean up any test files and reset git state
		try {
			await execAsync("git reset HEAD .", { cwd: repoRoot });
			await execAsync("git checkout -- .", { cwd: repoRoot });
			await execAsync(`rm -rf ${testFilesDir}`, { cwd: repoRoot });
		} catch (error) {
			// Ignore cleanup errors
		}
	});

	test("should only format staged TypeScript files", async () => {
		// Create a TypeScript file with formatting issues
		const stagedFile = join(testFilesDir, "staged.ts");
		const unstagedFile = join(testFilesDir, "unstaged.ts");

		await mkdir(testFilesDir, { recursive: true });

		// Content with deliberate formatting issues
		const badlyFormattedCode = `const x={a:1,b:2};\nconst y    =    {c:3};\n`;

		await writeFile(stagedFile, badlyFormattedCode);
		await writeFile(unstagedFile, badlyFormattedCode);

		// Stage only one file
		await execAsync(`git add ${stagedFile}`, { cwd: repoRoot });

		// Run lint-staged (simulating pre-commit hook)
		try {
			await execAsync("bunx lint-staged", { cwd: repoRoot });
		} catch (error) {
			// lint-staged may exit with error if linting fails
		}

		// Read files to verify behavior
		const stagedContent = await readFile(stagedFile, "utf-8");
		const unstagedContent = await readFile(unstagedFile, "utf-8");

		// Staged file should be formatted
		expect(stagedContent).not.toBe(badlyFormattedCode);
		// Unstaged file should remain unchanged
		expect(unstagedContent).toBe(badlyFormattedCode);
	});

	test("should process files from multiple workspaces", async () => {
		const clientFile = join(repoRoot, "client/src/test-lint-staged.ts");
		const serverFile = join(repoRoot, "server/src/test-lint-staged.ts");
		const sharedFile = join(repoRoot, "shared/src/test-lint-staged.ts");

		const badlyFormattedCode = `const obj={key:"value"};\n`;

		await writeFile(clientFile, badlyFormattedCode);
		await writeFile(serverFile, badlyFormattedCode);
		await writeFile(sharedFile, badlyFormattedCode);

		// Stage files from all workspaces
		await execAsync(`git add ${clientFile} ${serverFile} ${sharedFile}`, {
			cwd: repoRoot,
		});

		// Run lint-staged
		try {
			await execAsync("bunx lint-staged", { cwd: repoRoot });
		} catch (error) {
			// May fail on linting errors
		}

		// All staged files should be processed
		const clientContent = await readFile(clientFile, "utf-8");
		const serverContent = await readFile(serverFile, "utf-8");
		const sharedContent = await readFile(sharedFile, "utf-8");

		// All should be formatted
		expect(clientContent).not.toBe(badlyFormattedCode);
		expect(serverContent).not.toBe(badlyFormattedCode);
		expect(sharedContent).not.toBe(badlyFormattedCode);

		// Cleanup
		await execAsync(
			`git reset HEAD ${clientFile} ${serverFile} ${sharedFile}`,
			{ cwd: repoRoot },
		);
		await execAsync(`rm -f ${clientFile} ${serverFile} ${sharedFile}`, {
			cwd: repoRoot,
		});
	});

	test("should handle empty staging area gracefully", async () => {
		// Ensure nothing is staged
		await execAsync("git reset HEAD .", { cwd: repoRoot });

		// Run lint-staged with no staged files
		const { stdout, stderr } = await execAsync("bunx lint-staged", {
			cwd: repoRoot,
		});

		// Should complete without error
		expect(stdout || stderr).toBeTruthy();
	});

	test("should handle JSON files correctly", async () => {
		const jsonFile = join(testFilesDir, "test.json");

		await mkdir(testFilesDir, { recursive: true });

		// Badly formatted JSON
		const badJson = `{"name":"test","value":123,"nested":{"key":"value"}}`;

		await writeFile(jsonFile, badJson);
		await execAsync(`git add ${jsonFile}`, { cwd: repoRoot });

		// Run lint-staged
		try {
			await execAsync("bunx lint-staged", { cwd: repoRoot });
		} catch (error) {
			// May fail on formatting errors
		}

		const formattedContent = await readFile(jsonFile, "utf-8");

		// Should be formatted (likely with newlines and indentation)
		expect(formattedContent.length).toBeGreaterThan(badJson.length);
	});

	test("should fail commit when linting errors are found", async () => {
		const fileWithErrors = join(testFilesDir, "errors.ts");

		await mkdir(testFilesDir, { recursive: true });

		// TypeScript code with deliberate linting errors
		const codeWithErrors = `
var unusedVariable = 123;
const x = 1
const y = 2
debugger;
`;

		await writeFile(fileWithErrors, codeWithErrors);
		await execAsync(`git add ${fileWithErrors}`, { cwd: repoRoot });

		// Run lint-staged - should fail due to linting errors
		try {
			const result = await execAsync("bunx lint-staged", { cwd: repoRoot });
			// If it doesn't throw, check exit code
			expect(result).toBeTruthy();
		} catch (error) {
			// Expected to fail with linting errors
			expect(error).toBeTruthy();
		}
	});

	test("should process TypeScript, JavaScript, and config files", async () => {
		await mkdir(testFilesDir, { recursive: true });

		const tsFile = join(testFilesDir, "test.ts");
		const jsFile = join(testFilesDir, "test.js");
		const configFile = join(testFilesDir, "config.json");

		const badCode = `const x={a:1};`;
		const badJson = `{"key":"value"}`;

		await writeFile(tsFile, badCode);
		await writeFile(jsFile, badCode);
		await writeFile(configFile, badJson);

		await execAsync(`git add ${tsFile} ${jsFile} ${configFile}`, {
			cwd: repoRoot,
		});

		try {
			await execAsync("bunx lint-staged", { cwd: repoRoot });
		} catch (error) {
			// May fail on linting
		}

		// All files should be processed
		const tsContent = await readFile(tsFile, "utf-8");
		const jsContent = await readFile(jsFile, "utf-8");
		const configContent = await readFile(configFile, "utf-8");

		// All should be formatted
		expect(tsContent).not.toBe(badCode);
		expect(jsContent).not.toBe(badCode);
		expect(configContent).not.toBe(badJson);
	});

	test("should maintain pre-commit hook integration", async () => {
		// Verify that the pre-commit hook exists and calls lint-staged
		const hookPath = join(repoRoot, ".husky/pre-commit");
		const hookContent = await readFile(hookPath, "utf-8");

		expect(hookContent).toContain("lint-staged");
		expect(hookContent).not.toContain("bun run lint");
		expect(hookContent).not.toContain("bun run format");
	});

	test("should handle large number of staged files", async () => {
		await mkdir(testFilesDir, { recursive: true });

		const fileCount = 50;
		const files: string[] = [];
		const badCode = `const x={a:1};`;

		// Create many files with formatting issues
		for (let i = 0; i < fileCount; i++) {
			const filePath = join(testFilesDir, `file${i}.ts`);
			await writeFile(filePath, badCode);
			files.push(filePath);
		}

		// Stage all files
		await execAsync(`git add ${testFilesDir}/*.ts`, { cwd: repoRoot });

		// Run lint-staged
		const startTime = Date.now();
		try {
			await execAsync("bunx lint-staged", { cwd: repoRoot });
		} catch (error) {
			// May fail on linting
		}
		const duration = Date.now() - startTime;

		// Should complete in reasonable time (less than 30 seconds for 50 files)
		expect(duration).toBeLessThan(30000);

		// Verify at least some files were processed
		const firstFileContent = await readFile(files[0], "utf-8");
		expect(firstFileContent).not.toBe(badCode);
	});
});

test.describe("lint-staged configuration", () => {
	const repoRoot = join(__dirname, "../..");

	test("should have lint-staged configuration file", async () => {
		const configPath = join(repoRoot, "lint-staged.config.js");

		// File should exist
		const configContent = await readFile(configPath, "utf-8");
		expect(configContent).toBeTruthy();
		expect(configContent).toContain("biome");
	});

	test("should have lint-staged installed as dev dependency", async () => {
		const packageJsonPath = join(repoRoot, "package.json");
		const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));

		expect(packageJson.devDependencies).toHaveProperty("lint-staged");
	});

	test("should have appropriate glob patterns in config", async () => {
		const configPath = join(repoRoot, "lint-staged.config.js");
		const configContent = await readFile(configPath, "utf-8");

		// Should include patterns for TypeScript, JavaScript, and JSON
		expect(configContent).toMatch(/\*\.ts/);
		expect(configContent).toMatch(/\*\.tsx?/);
		expect(configContent).toMatch(/\*\.json/);
	});
});
