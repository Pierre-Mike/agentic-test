# Issue Automation Pipeline

This document explains how issues are automatically triaged, assessed, and implemented using GitHub Actions, a Personal Access Token (PAT), and Claude Code.

## Why a Personal Access Token?

GitHub Actions has a known limitation: **events triggered by the default `GITHUB_TOKEN` do not create new workflow runs**. This means if one workflow adds a label to an issue, a second workflow listening for `issues.labeled` will **not** fire.

To solve this, we use a **Personal Access Token (PAT)** stored as a repository secret (`GH_PAT`). Actions performed with a PAT (like adding labels) are treated as coming from the token owner rather than the Actions bot, which **does** trigger downstream workflows.

### Required Secrets

| Secret | Purpose |
|--------|---------|
| `GH_PAT` | Personal Access Token with `repo` scope — used for label operations, pushing branches, and creating PRs |
| `CLAUDE_CODE_OAUTH_TOKEN` | OAuth token for the Claude Code Action |

## Pipeline Overview

```
Issue opened (by Pierre-Mike)
  │
  ▼
issue-opened.yml ── triage & score ──┐
  │                                   │
  │  score >= 50 → adds               │
  │  "auto-implement" label           │
  │  (using PAT)                      │
  │                                   │
  ▼                                   │
auto-implement.yml ◄──────────────────┘
  │  (triggered by the label event
  │   because PAT was used)
  │
  ▼
Plan → Implement → Validate → PR
```

### 1. Issue Triage (`issue-opened.yml`)

**Trigger:** `issues.opened`

**Guard:** Only runs if `github.event.issue.user.login == 'Pierre-Mike'`

**Steps:**
1. Checks out the repo
2. Runs Claude Code with the PAT as `github_token` to:
   - Categorize the issue as `bug`, `feature`, or `chore`
   - Score it 0-100 on clarity, scope, codebase alignment, and risk
   - If score >= 50: adds `auto-implement` + confidence label (using the PAT, which triggers the next workflow)
   - If score < 50: adds `needs-review` + `confidence:low` and comments explaining why

### 2. Auto Implementation (`auto-implement.yml`)

**Trigger:** `issues.labeled`

**Guard:** Runs only if:
- The added label is `auto-implement`, `confidence:high`, or `confidence:medium`
- The issue has the `auto-implement` label
- The issue author is `Pierre-Mike`

**`allowed_bots: '*'`** -- This is a Claude Code Action setting that allows the workflow to respond to events created by bots. Without this, the Claude Code Action would ignore the event since the label was applied via the PAT rather than through a direct user interaction in the GitHub UI.

**Steps:**
1. Checks out the repo using the PAT (so pushes trigger CI)
2. Claude Code analyzes the issue, creates a plan in `specs/`, implements it, validates with `bun run test/build/type-check`, and opens a PR

## Key Configuration Details

### `allowed_bots: '*'` in Claude Code Action

The `auto-implement.yml` workflow sets `allowed_bots: '*'` on the `anthropics/claude-code-action` step. This is necessary because:

- The `issue-opened.yml` workflow applies labels using the PAT
- GitHub may attribute those label events differently than direct human actions
- By default, `claude-code-action` ignores bot-triggered events
- Setting `allowed_bots: '*'` tells the action to process events regardless of the actor

Without this setting, the auto-implementation workflow would be triggered by GitHub but Claude Code would skip execution.

### PAT for Checkout

In `auto-implement.yml`, the checkout step uses the PAT:

```yaml
- uses: actions/checkout@v5
  with:
    token: ${{ secrets.GH_PAT }}
```

This ensures that git pushes made during the workflow also trigger CI (the `ci.yml` workflow), since the push comes from the PAT owner rather than `GITHUB_TOKEN`.

## Security Constraints

- Both workflows are gated to issues authored by `Pierre-Mike` only
- Claude Code tools are explicitly scoped (no unrestricted shell access)
- Destructive git operations (`push --force`, `rm -rf`) are denied in `.claude/settings.json`
