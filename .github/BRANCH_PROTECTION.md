# Branch Protection Configuration

This document outlines the recommended branch protection settings for this repository.

## Main Branch Protection

Navigate to: **Settings > Branches > Branch protection rules > Add rule**

### Rule for `main`

**Branch name pattern:** `main`

#### Protect matching branches

- [x] **Require a pull request before merging**
  - [x] Require approvals: 1
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require approval of the most recent reviewable push

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Status checks that are required:
    - `ci-complete`
    - `peer-review` (Claude code review)

- [x] **Require conversation resolution before merging**

- [ ] **Require signed commits** (optional)

- [ ] **Require linear history** (optional)

- [x] **Allow force pushes** - DISABLED
- [x] **Allow deletions** - DISABLED

### Rule for `development`

**Branch name pattern:** `development`

- [x] Require a pull request before merging (1 approval)
- [x] Require status checks to pass
  - `lint`
  - `type-check`
  - `test`
  - `build`
- [x] Require conversation resolution

## Required Status Checks

| Check Name | Description |
|------------|-------------|
| `ci-complete` | Summary job that verifies all CI passed |
| `lint` | Biome linting |
| `type-check` | TypeScript type checking |
| `test` | Bun tests |
| `build` | Full project build |
| `security` | CodeQL security analysis |
| `peer-review` | Claude automated code review |

## GitHub Pages Setup

1. Go to **Settings > Pages**
2. Set **Source** to "GitHub Actions"
3. This allows the deploy workflows to publish to Pages

## Auto-Merge Settings (Optional)

To enable auto-merge for dependabot PRs:

1. **Settings > General > Pull Requests**
2. Enable "Allow auto-merge"

Then dependabot PRs can use auto-merge after all checks pass.
