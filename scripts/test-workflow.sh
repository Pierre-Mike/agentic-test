#!/usr/bin/env bash
set -euo pipefail

# Test the auto-implement workflow end-to-end
# Creates an issue, waits for draft PR, then tracks label-driven phases.

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
ISSUE_TITLE="[Test] Add /test endpoint returning {test: \"ok\"}"
ISSUE_BODY="## Description
Add a simple \`GET /test\` endpoint to the server that returns:
\`\`\`json
{\"test\": \"ok\"}
\`\`\`

## Acceptance Criteria
- \`GET /test\` returns status 200
- Response body is \`{\"test\": \"ok\"}\`
- Response content-type is application/json

## Notes
This is an automated workflow test issue. It will be cleaned up after validation."

POLL_INTERVAL=30
MAX_WAIT_PR=900       # 15 min for draft PR
MAX_WAIT_PHASE=900    # 15 min per phase
LABEL="auto-implement"

cleanup() {
  local exit_code=$?
  echo ""
  echo "=== Cleanup ==="

  if [[ -n "${PR_NUMBER:-}" ]]; then
    echo "Closing PR #$PR_NUMBER..."
    gh pr close "$PR_NUMBER" --delete-branch 2>/dev/null || true
  fi

  if [[ -n "${BRANCH_NAME:-}" && -z "${PR_NUMBER:-}" ]]; then
    echo "Deleting remote branch $BRANCH_NAME..."
    git push origin --delete "$BRANCH_NAME" 2>/dev/null || true
  fi

  if [[ -n "${ISSUE_NUMBER:-}" ]]; then
    echo "Closing issue #$ISSUE_NUMBER..."
    gh issue close "$ISSUE_NUMBER" 2>/dev/null || true
  fi

  if [[ $exit_code -eq 0 ]]; then
    echo ""
    echo "=== WORKFLOW TEST PASSED ==="
  else
    echo ""
    echo "=== WORKFLOW TEST FAILED (exit code: $exit_code) ==="
  fi

  exit $exit_code
}

trap cleanup EXIT

# Pre-cleanup: remove stale resources from previous test runs
pre_cleanup() {
  echo "=== Pre-cleanup: removing stale resources ==="

  # Close open PRs on issue-*-auto-implement branches
  local stale_prs
  stale_prs=$(gh pr list --state open --json number,headRefName -q '.[] | select(.headRefName | endswith("-auto-implement")) | .number')
  for pr in $stale_prs; do
    echo "Closing stale PR #$pr..."
    gh pr close "$pr" --delete-branch 2>/dev/null || true
  done

  # Delete any remaining remote issue-*-auto-implement branches
  local stale_branches
  stale_branches=$(git ls-remote --heads origin | sed 's|.*refs/heads/||' | grep -- '-auto-implement$')
  for branch in $stale_branches; do
    echo "Deleting stale branch $branch..."
    git push origin --delete "$branch" 2>/dev/null || true
  done

  # Close stale test issues
  local stale_issues
  stale_issues=$(gh issue list --state open --label "$LABEL" --search "[Test]" --json number -q '.[].number')
  for issue in $stale_issues; do
    echo "Closing stale issue #$issue..."
    gh issue close "$issue" 2>/dev/null || true
  done

  echo "Pre-cleanup done."
  echo ""
}

echo "=== Auto-Implement Workflow Test ==="
echo "Repo: $REPO"
echo ""

pre_cleanup

# 1. Create issue
echo "--- Step 1: Creating test issue ---"
ISSUE_NUMBER=$(gh issue create \
  --title "$ISSUE_TITLE" \
  --body "$ISSUE_BODY" \
  --label "$LABEL" \
  | grep -o '[0-9]*$')

BRANCH_NAME="issue-${ISSUE_NUMBER}-auto-implement"
echo "Created issue #$ISSUE_NUMBER"
echo "https://github.com/$REPO/issues/$ISSUE_NUMBER"
echo ""

# 2. Wait for draft PR
echo "--- Step 2: Waiting for draft PR ---"
PR_NUMBER=""
ELAPSED=0

while [[ $ELAPSED -lt $MAX_WAIT_PR ]]; do
  PR_NUMBER=$(gh pr list --head "$BRANCH_NAME" --json number -q '.[0].number' 2>/dev/null || true)

  if [[ -n "$PR_NUMBER" ]]; then
    echo "Draft PR found: #$PR_NUMBER (after ${ELAPSED}s)"
    break
  fi

  echo "  Waiting... (${ELAPSED}s / ${MAX_WAIT_PR}s)"
  sleep "$POLL_INTERVAL"
  ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

if [[ -z "$PR_NUMBER" ]]; then
  echo "ERROR: No draft PR created after ${MAX_WAIT_PR}s"
  exit 1
fi
echo ""

# Helper: wait for a label to appear on the PR
wait_for_label() {
  local target_label="$1"
  local max_wait="$2"
  local elapsed=0

  echo "  Waiting for label: $target_label"
  while [[ $elapsed -lt $max_wait ]]; do
    LABELS=$(gh pr view "$PR_NUMBER" --json labels -q '.labels[].name' 2>/dev/null || true)

    if echo "$LABELS" | grep -qx "$target_label"; then
      echo "  Label $target_label appeared (after ${elapsed}s)"
      return 0
    fi

    if echo "$LABELS" | grep -qx "phase:failed"; then
      echo "  ERROR: phase:failed label detected"
      gh pr view "$PR_NUMBER" --json comments -q '.comments[-1].body' 2>/dev/null || true
      return 1
    fi

    echo "    Waiting... (${elapsed}s / ${max_wait}s) [current: $(echo $LABELS | tr '\n' ', ')]"
    sleep "$POLL_INTERVAL"
    elapsed=$((elapsed + POLL_INTERVAL))
  done

  echo "  ERROR: Label $target_label did not appear after ${max_wait}s"
  return 1
}

# 3. Track phase transitions
echo "--- Step 3: Tracking phase:tests → phase:implement ---"
wait_for_label "phase:implement" "$MAX_WAIT_PHASE"
echo ""

echo "--- Step 4: Tracking phase:implement → phase:finalize ---"
wait_for_label "phase:finalize" "$MAX_WAIT_PHASE"
echo ""

echo "--- Step 5: Tracking phase:finalize → phase:complete ---"
wait_for_label "phase:complete" "$MAX_WAIT_PHASE"
echo ""

# 6. Verify PR is no longer a draft
echo "--- Step 6: Verifying PR is ready for review ---"
IS_DRAFT=$(gh pr view "$PR_NUMBER" --json isDraft -q .isDraft)
if [[ "$IS_DRAFT" == "true" ]]; then
  echo "WARNING: PR is still a draft"
else
  echo "PR is ready for review"
fi
echo ""

# 7. Verify PR is mergeable
echo "--- Step 7: Verifying PR is mergeable ---"
MERGEABLE=$(gh pr view "$PR_NUMBER" --json mergeable -q .mergeable)
echo "Mergeable: $MERGEABLE"

if [[ "$MERGEABLE" != "MERGEABLE" ]]; then
  echo "WARNING: PR is not mergeable (status: $MERGEABLE)"
fi
echo ""

echo "--- All checks completed successfully ---"
echo "Issue:  #$ISSUE_NUMBER"
echo "Branch: $BRANCH_NAME"
echo "PR:     #$PR_NUMBER"
echo ""
echo "Cleaning up..."
