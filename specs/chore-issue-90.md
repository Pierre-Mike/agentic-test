# Chore: Add Status Badges to README

## Chore Description
Add GitHub Actions status badges to the README.md file to provide better visibility into the project's CI/CD pipeline health. This will include badges for:
- E2E tests (Playwright)
- Lint checks (Biome)
- Unit tests
- Workflow smoke test

These badges will give users and contributors immediate visual feedback on the status of key automated workflows in the repository.

## Relevant Files
Use these files to resolve the chore:

- `README.md` - The main README file where status badges will be added. Currently has website status badges for the deployed client and server, but lacks CI/CD workflow status badges.
- `.github/workflows/ci.yml` - The continuous integration workflow that runs lint, type-check, test, build, and security jobs. This workflow will be referenced for the lint and test badges.
- `.github/workflows/workflow-smoke-test.yml` - The smoke test workflow that runs daily and on manual trigger to validate the auto-implement workflow end-to-end.
- `package.json` - Contains the e2e script (`bun run e2e`) that runs Playwright tests.
- `e2e/` directory - Contains Playwright e2e tests configuration and test files.

### New Files
No new files need to be created for this chore.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add Status Badges Section
- Add a new "## CI/CD Status" section in the README.md file, positioned right after the "Production Environment" section (after line 12)
- This section will contain all the workflow status badges
- Keep the section organized and visually consistent with the existing README structure

### Step 2: Add Individual Status Badges
Add the following GitHub Actions workflow status badges using the standard GitHub Actions badge format:
- **CI Workflow Badge**: `![CI](https://github.com/Pierre-Mike/agentic-test/actions/workflows/ci.yml/badge.svg)`
  - This badge shows the overall CI pipeline status (includes lint, type-check, test, build, and security)
- **E2E Tests Badge**: Based on the CI workflow or a dedicated e2e workflow if it exists
  - Since e2e tests are part of the test suite, they're covered by the CI workflow
  - Add a note indicating that e2e tests are included in the test suite
- **Workflow Smoke Test Badge**: `![Workflow Smoke Test](https://github.com/Pierre-Mike/agentic-test/actions/workflows/workflow-smoke-test.yml/badge.svg)`
  - This shows the status of the daily smoke test for the auto-implement workflow

### Step 3: Organize Badge Layout
- Organize the badges in a logical order:
  1. CI badge (covers lint, test, type-check, build)
  2. Workflow Smoke Test badge
- Add brief descriptions for each badge explaining what it monitors
- Ensure badges are displayed on their own lines or in a clean horizontal layout

### Step 4: Run Validation Commands
Execute all validation commands to ensure the changes don't introduce any regressions.

## Testing
No automated tests are needed for this chore since it only modifies documentation (README.md). The changes will be validated by:
- Visual inspection of the README.md file
- Verification that the badge URLs are correctly formatted
- Checking that the badges render correctly on GitHub

## Validation Commands
Execute every command to validate the chore is complete with zero regressions.

- `bun run test` - Run tests to validate the chore is complete with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces
- `bun run lint` - Lint all workspaces to ensure code quality

## Notes
- GitHub Actions badges follow the format: `![Badge Name](https://github.com/OWNER/REPO/actions/workflows/WORKFLOW_FILE/badge.svg)`
- For this repository: `https://github.com/Pierre-Mike/agentic-test/actions/workflows/WORKFLOW_FILE/badge.svg`
- The CI workflow (`ci.yml`) already includes:
  - `lint` job - Runs `bun run lint` with Biome
  - `test` job - Runs `bun run test` for all workspaces
  - `type-check` job - Runs `bun run type-check`
  - `build` job - Runs `bun run build`
  - `security` job - Runs CodeQL analysis
- E2E tests are run via the `test` job since `bun run test` runs `turbo test`, which includes the e2e workspace
- The workflow smoke test is a separate workflow that validates the auto-implement workflow functionality
- Badges will update automatically based on the latest workflow run status
- Consider adding the badges in a table format for better organization if multiple badges are added
