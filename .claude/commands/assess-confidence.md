---
allowed-tools: Bash(gh label list:*),Bash(gh issue view:*),Bash(gh issue edit:*),Bash(gh issue comment:*),Bash(gh search:*),Read,Glob,Grep
description: Assess confidence for auto-implementation of GitHub issues
---

You are an issue confidence assessor. Your task is to evaluate whether a GitHub issue can be successfully auto-implemented by Claude Code, and take the appropriate action.

## Issue Information

- REPO: $ARGUMENTS

## Your Task

### Step 1: Gather Context

1. Run `gh issue view $ARGUMENTS --json title,body,labels,author` to get issue details
2. Run `gh label list` to see available labels
3. Search the codebase to understand if similar patterns exist

### Step 2: Check Hard Blockers

IMMEDIATELY flag for human review if ANY of these are true:
- Issue contains keywords: "security", "auth", "password", "secret", "credential", "migration", "deploy", "production", "database schema"
- Issue title or body ends with a question mark (asking for clarification)
- Issue scope is vague: "improve", "refactor all", "fix everything", "make better", "optimize"
- Issue requires coordination across multiple services or major architectural changes

If a hard blocker is found, skip to Step 4 with score < 50.

### Step 3: Score the Issue

Evaluate objectively using these 4 criteria (25 points each, total 100):

#### A. Issue Clarity (0-25 points)
| Criterion | Points |
|-----------|--------|
| Clear, actionable title | 0-5 |
| Detailed description with specific requirements | 0-10 |
| Acceptance criteria or expected outcome defined | 0-5 |
| Reproducibility steps (bugs) or user story (features) | 0-5 |

#### B. Scope Assessment (0-25 points)
| Criterion | Points |
|-----------|--------|
| Single, focused task (not bundled features) | 0-10 |
| Bounded complexity (can estimate effort) | 0-10 |
| No external service/API dependencies | 0-5 |

#### C. Codebase Alignment (0-25 points)
| Criterion | Points |
|-----------|--------|
| Similar patterns or features exist to reference | 0-10 |
| Can identify specific target files | 0-10 |
| Existing test patterns to follow | 0-5 |

#### D. Risk Assessment (0-25 points)
| Criterion | Points |
|-----------|--------|
| No security-sensitive areas touched | 0-10 |
| No breaking/architectural changes required | 0-10 |
| Changes are easily reversible | 0-5 |

### Step 4: Make Decision and Execute

Calculate total score and execute ONE of these actions:

**If score >= 75 (HIGH confidence):**
```bash
gh issue edit $ARGUMENTS --add-label "auto-implement" --add-label "confidence:high"
```
DO NOT comment. The auto-implement workflow will handle the issue.

**If score 50-74 (MEDIUM confidence):**
```bash
gh issue edit $ARGUMENTS --add-label "needs-review" --add-label "confidence:medium"
```
Then post a comment:
```bash
gh issue comment $ARGUMENTS --body "## Confidence Assessment: MEDIUM

**Score: [X]/100**

### Concerns preventing auto-implementation:
- [List specific concerns]

### To enable auto-implementation, please:
- [List specific improvements or clarifications needed]

---
*A maintainer can add the \`auto-implement\` label manually if they believe this can be handled automatically.*"
```

**If score < 50 (LOW confidence):**
```bash
gh issue edit $ARGUMENTS --add-label "needs-review" --add-label "confidence:low"
```
Then post a comment:
```bash
gh issue comment $ARGUMENTS --body "## Confidence Assessment: LOW

**Score: [X]/100**

### Why this cannot be auto-implemented:
- [List specific blockers]

### Before implementation can proceed:
- [List required clarifications or changes]

---
*This issue requires human review and likely manual implementation.*"
```

## Important Rules

1. Be STRICT - only truly clear, well-scoped issues should get auto-implement
2. When in doubt, choose needs-review (false negatives are better than broken PRs)
3. Always provide actionable feedback in comments
4. Never apply both `auto-implement` and `needs-review`
5. Always apply exactly one confidence label (high, medium, or low)
