# Feature: Add lint-staged for pre-commit hooks

## Feature Description
Integrate lint-staged with husky pre-commit hooks to ensure that linting and formatting operations only run on files that are actually staged for commit, rather than on the entire codebase. This will improve performance and developer experience by avoiding unnecessary file modifications and reducing pre-commit hook execution time.

## User Story
As a developer working on the codebase
I want pre-commit hooks to only process files I'm committing
So that I don't waste time waiting for the entire codebase to be checked and my unstaged files aren't unexpectedly modified

## Problem Statement
Currently, the pre-commit hook runs `bun run lint` and `bun run format` on the entire codebase, which:
1. Processes files that aren't being committed, wasting time
2. Can modify files that the developer hasn't staged for commit
3. Slows down the commit process, especially in large codebases
4. Creates confusion when unstaged files get modified by formatting/linting

## Solution Statement
Implement lint-staged to run Biome linting and formatting only on staged files. This will:
1. Improve pre-commit hook performance by processing only relevant files
2. Prevent modifications to unstaged files
3. Maintain code quality without disrupting developer workflow
4. Follow industry best practices for monorepo pre-commit hooks

## Relevant Files
Use these files to implement the feature:

- `package.json` - Root package.json where lint-staged will be installed and configured
- `.husky/pre-commit` - Pre-commit hook that currently runs full lint/format, will be updated to use lint-staged
- `biome.json` - Biome configuration that defines linting and formatting rules
- `README.md` - Documentation will need to be updated to reflect the new pre-commit behavior

### New Files
- `lint-staged.config.js` - Configuration file for lint-staged to define which commands run on which file patterns

## Implementation Plan

### Phase 1: Foundation
Install lint-staged as a dev dependency and create the configuration file. Research the existing Biome setup to ensure lint-staged commands match the current linting and formatting behavior. Ensure the configuration works with the monorepo workspace structure.

### Phase 2: Core Implementation
Configure lint-staged to run Biome lint and format commands on staged files with appropriate glob patterns. Update the husky pre-commit hook to execute lint-staged instead of the current full-codebase commands. Ensure all file types in the monorepo (client, server, shared workspaces) are covered.

### Phase 3: Integration
Test the pre-commit hook with various scenarios (single file, multiple files, different workspaces). Update documentation to explain the new behavior. Validate that the change maintains code quality standards while improving performance.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create E2E tests for lint-staged functionality
- Create e2e test file to verify pre-commit hook behavior with staged files
- Test that only staged files are linted/formatted
- Test that unstaged files remain unchanged
- Test various file types (TypeScript, JSON, config files)
- Test multi-workspace scenarios

### Step 2: Install lint-staged dependency
- Run `bun add -d lint-staged` to add it as a dev dependency in root package.json
- Verify installation by checking package.json

### Step 3: Create lint-staged configuration
- Create `lint-staged.config.js` in the root directory
- Configure appropriate glob patterns for TypeScript, JavaScript, JSON files
- Set up Biome lint and format commands to run on staged files
- Ensure configuration respects the monorepo structure

### Step 4: Update husky pre-commit hook
- Modify `.husky/pre-commit` to run `bunx lint-staged` instead of full lint/format
- Ensure the hook executes correctly

### Step 5: Update documentation
- Update README.md pre-commit hooks section to explain lint-staged behavior
- Add explanation of how lint-staged improves the workflow
- Document the lint-staged configuration for future reference

### Step 6: Run validation commands
- Execute all validation commands to ensure zero regressions
- Manually test pre-commit hook with staged files
- Verify that unstaged files are not modified

## Testing Strategy

### E2E Tests
- Test pre-commit hook execution with lint-staged:
  - Stage a single TypeScript file with formatting issues
  - Verify file is formatted and commit succeeds
  - Verify unstaged files with formatting issues remain unchanged
- Test multi-file scenario:
  - Stage files from different workspaces (client, server, shared)
  - Verify all staged files are processed
  - Verify workspace isolation is maintained
- Test with no staged files:
  - Verify hook handles empty staging area gracefully

### Unit Tests
Since this is primarily a configuration change, unit tests are not applicable. The functionality will be validated through integration and E2E tests.

### Integration Tests
- Test lint-staged configuration parsing:
  - Verify glob patterns match expected file types
  - Verify Biome commands are invoked correctly
- Test interaction with Biome:
  - Verify `biome lint` is called only on staged files
  - Verify `biome format --write` is called only on staged files
- Test interaction with Git:
  - Verify staged files are correctly identified
  - Verify modified files are re-staged after formatting

### Edge Cases
- Empty staging area (no files staged)
- Staging only non-code files (e.g., markdown, images)
- Staging files with syntax errors that fail linting
- Staging files in nested directories across different workspaces
- Pre-commit hook with lint-staged when git hooks are disabled
- Large number of staged files (performance testing)

## Acceptance Criteria
- [ ] lint-staged is installed as a dev dependency
- [ ] lint-staged.config.js exists with appropriate configuration
- [ ] Pre-commit hook uses lint-staged instead of full codebase lint/format
- [ ] Only staged files are linted and formatted during pre-commit
- [ ] Unstaged files are never modified by the pre-commit hook
- [ ] All file types in the monorepo are covered by lint-staged patterns
- [ ] Pre-commit hook execution time is reduced compared to full codebase scanning
- [ ] Documentation is updated to reflect the new behavior
- [ ] All existing tests pass
- [ ] New E2E tests validate the lint-staged functionality
- [ ] The feature works across all workspaces (client, server, shared)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces
- `bun run lint` - Verify linting still works for manual execution
- `bun run format` - Verify formatting still works for manual execution
- `bunx lint-staged --config lint-staged.config.js` - Test lint-staged configuration manually
- Manual test: Stage a file with formatting issues and run `git commit` to verify pre-commit hook works
- Manual test: Create unstaged file with formatting issues, stage a different file, commit and verify unstaged file is unchanged

## Notes
- lint-staged is a widely-used industry standard tool with excellent documentation at https://github.com/lint-staged/lint-staged
- The configuration should use JavaScript format (lint-staged.config.js) for better type support and flexibility
- Biome has excellent performance characteristics, so the speed improvement may be modest on small changesets, but will be significant on larger commits
- Consider documenting the ability to bypass hooks with `git commit --no-verify` for emergency situations in the README
- This change aligns with the project's goal of maintaining code quality while optimizing developer experience
- Future enhancement: Consider adding additional pre-commit checks like type-checking only changed files
