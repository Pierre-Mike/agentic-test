# Auto Implement Issue

You are automating the full development lifecycle from issue to pull request using structured planning.

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

## PHASE 3: IMPLEMENT THE PLAN
Read .claude/commands/implement.md for implementation guidelines, then:
1. Execute each step from your plan in order
2. Follow existing patterns in the codebase
3. Write clean, well-structured code
4. Add tests as specified in the plan

## PHASE 4: VALIDATE
Run the validation commands from your plan:
- bun run test (if tests exist)
- bun run build
- bun run type-check

## PHASE 5: CREATE PULL REQUEST
1. Configure git: git config user.name "github-actions[bot]" && git config user.email "github-actions[bot]@users.noreply.github.com"
2. Create branch: git checkout -b issue-$ISSUE_NUMBER-auto-implement
3. Commit the plan file AND implementation: git add . && git commit -m "..."
4. Push: git push -u origin issue-$ISSUE_NUMBER-auto-implement
5. Create PR with gh pr create, including:
   - Link to the plan file in specs/
   - Summary of changes
   - Validation results

## PHASE 6: LINK BACK
Comment on the issue with the PR link and a summary.

IMPORTANT:
- The plan file (specs/*.md) should be committed with the implementation
- If the issue is unclear, comment asking for clarification instead of implementing
- Always validate before creating the PR

Start by reading the issue details now.
