# Auto Implement Issue

You are automating the full development lifecycle from issue to pull request using structured planning and test-driven development.

> **Note:** When triggered via GitHub Actions, each phase runs as a separate workflow step.
> This file serves as the full reference and manual fallback.

ISSUE INFORMATION:
- Repository: $REPO
- Issue Number: $ISSUE_NUMBER
- Issue Title: $ISSUE_TITLE
- Issue URL: $ISSUE_URL

## PHASE 1: ANALYZE THE ISSUE
1. Read the issue: gh issue view $ISSUE_NUMBER --json title,body,labels
2. Determine the issue type based on labels and content:
   - "bug" label or bug-related content → BUG
   - "feature" or "enhancement" label → FEATURE
   - "chore" or maintenance-related → CHORE
   - Default to FEATURE if unclear

## PHASE 2: CREATE A PLAN
Based on the issue type, read the appropriate planning template and create a plan:

- For BUGS: Read .claude/commands/bug.md and create specs/bug-issue-$ISSUE_NUMBER.md
- For FEATURES: Read .claude/commands/feature.md and create specs/feature-issue-$ISSUE_NUMBER.md
- For CHORES: Read .claude/commands/chore.md and create specs/chore-issue-$ISSUE_NUMBER.md

Follow the exact Plan Format from the template. Research the codebase thoroughly before writing the plan.
The plan must include: e2e tests, unit tests, implementation steps, and doc updates.

Commit the plan file only:
git add specs/ && git commit -m "plan: add spec for #$ISSUE_NUMBER"

## PHASE 3: WRITE TESTS & E2E FIRST
Based on the plan:
1. Write all e2e tests derived from the acceptance criteria
2. Write unit/integration tests derived from the testing strategy
3. Run the tests — confirm they FAIL (red phase). This is expected in TDD.
4. Commit the test files:
   git add . && git commit -m "test: add tests for #$ISSUE_NUMBER"

### E2E Test Guidelines
- E2E tests run against deployed preview environments, NOT localhost.
- **Frontend e2e tests** use `baseURL` from Playwright config (set via `E2E_BASE_URL`).
- **API e2e tests** must import `apiURL` from `../playwright.config` and use it as the base for API requests:
  ```ts
  import { apiURL } from "../playwright.config";
  // then use: request.get(`${apiURL}/your-endpoint`)
  ```
- NEVER hardcode `localhost:8787` or any localhost URL in e2e tests.
- For server-only endpoints with no UI, prefer unit tests (using `app.request()`) over e2e tests.

## PHASE 4: IMPLEMENT CODE
1. Read .claude/commands/implement.md for implementation guidelines
2. Write code to make all tests pass
3. Follow existing patterns in the codebase
4. Commit the implementation:
   git add . && git commit -m "feat: implement #$ISSUE_NUMBER"
   (Use "fix:" prefix for bugs instead of "feat:")

## PHASE 5: VALIDATE
Run all validation commands:
- bun run test — all tests must PASS
- bun run build — no build errors
- bun run type-check — no type errors

If any fail, fix the issues and amend the implementation commit:
git add . && git commit --amend --no-edit

## PHASE 6: UPDATE DOCUMENTATION
1. Update README.md if user-facing behavior changed
2. Update relevant docs/comments
3. Only commit if there are documentation changes:
   git add . && git commit -m "docs: update documentation for #$ISSUE_NUMBER"

## PHASE 7: SELF-REVIEW
1. Review the full diff across all commits: git diff origin/main...HEAD
2. Check for: correctness, code quality, security, performance
3. Re-read the original issue and verify all requirements are met point-by-point
4. If any issues are found, fix them and amend the relevant commit
5. Run final validation: bun run test && bun run build && bun run type-check

## PHASE 8: CREATE PR & LINK BACK
1. Push: git push -u origin issue-$ISSUE_NUMBER-auto-implement
2. Create PR with gh pr create linking to the issue and spec file
3. Comment on the issue with the PR link

IMPORTANT:
- Each phase produces its own commit (plan → tests → code → docs)
- Tests are written BEFORE implementation (TDD)
- If the issue is unclear, comment asking for clarification instead of implementing
- Always validate before creating the PR

Start by reading the issue details now.
