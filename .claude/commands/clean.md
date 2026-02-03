# Clean Repo

Clean up the repository by making only small, focused changes. Follow the `Instructions` below.

## Instructions

- Scan the codebase for small cleanup opportunities: unused imports, unused variables, trailing whitespace, console.logs left behind, empty files, dead code.
- Only make **small, safe changes** — no refactors, no logic changes, no feature additions.
- Do NOT touch tests, configs, or CI files unless they have obvious dead code.
- Do NOT add comments, docstrings, or type annotations to code you didn't change.
- After cleanup, run the `Validation Commands` to ensure zero regressions.

## Relevant Files

Focus on the following directories:
- `server/` - Backend server code
- `client/` - Frontend client code
- `shared/` - Shared type definitions
- `e2e/` - End-to-end test code

Ignore: `node_modules/`, `.github/`, config files at the root.

## Cleanup Targets

Look for and fix:
- Unused imports
- Unused variables
- Leftover `console.log` / `console.debug` statements (keep `console.error` and `console.warn`)
- Empty or dead code blocks
- Trailing whitespace or extra blank lines
- Duplicate imports

## Validation Commands

Run every command after cleanup to confirm zero regressions:
- `bun run build` - Ensure no compilation errors
- `bun run type-check` - Ensure no type errors
- `bun run test` - Ensure all tests pass

## Additional Context
$ARGUMENTS
