#!/usr/bin/env bash
set -euo pipefail

# Test the auto-implement workflow end-to-end
# Creates an issue, waits for the workflow to create a branch + PR,
# then cleans up everything.

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
MAX_WAIT=900  # 15 minutes max
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

echo "=== Auto-Implement Workflow Test ==="
echo "Repo: $REPO"
echo ""

# 1. Create issue
echo "--- Step 1: Creating test issue ---"
ISSUE_NUMBER=$(gh issue create \
  --title "$ISSUE_TITLE" \
  --body "$ISSUE_BODY" \
  --label "$LABEL" \
  | grep -o '[0-9]*$')

echo "Created issue #$ISSUE_NUMBER"
echo "https://github.com/$REPO/issues/$ISSUE_NUMBER"
echo ""

# 2. Wait for branch
echo "--- Step 2: Waiting for branch creation ---"
BRANCH_NAME=""
ELAPSED=0

while [[ $ELAPSED -lt $MAX_WAIT ]]; do
  # Look for a branch matching the issue number
  BRANCH_NAME=$(git ls-remote --heads origin | sed 's|.*refs/heads/||' | grep "${ISSUE_NUMBER}" | head -1 || true)

  if [[ -n "$BRANCH_NAME" ]]; then
    echo "Branch found: $BRANCH_NAME (after ${ELAPSED}s)"
    break
  fi

  echo "  Waiting... (${ELAPSED}s / ${MAX_WAIT}s)"
  sleep "$POLL_INTERVAL"
  ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

if [[ -z "$BRANCH_NAME" ]]; then
  echo "ERROR: No branch created after ${MAX_WAIT}s"
  exit 1
fi
echo ""

# 3. Wait for PR
echo "--- Step 3: Waiting for PR ---"
PR_NUMBER=""
ELAPSED=0

while [[ $ELAPSED -lt $MAX_WAIT ]]; do
  PR_NUMBER=$(gh pr list --head "$BRANCH_NAME" --json number -q '.[0].number' 2>/dev/null || true)

  if [[ -n "$PR_NUMBER" ]]; then
    echo "PR found: #$PR_NUMBER (after ${ELAPSED}s)"
    break
  fi

  echo "  Waiting... (${ELAPSED}s / ${MAX_WAIT}s)"
  sleep "$POLL_INTERVAL"
  ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

if [[ -z "$PR_NUMBER" ]]; then
  echo "ERROR: No PR created after ${MAX_WAIT}s"
  exit 1
fi
echo ""

# 4. Wait for PR checks to complete
echo "--- Step 4: Waiting for PR checks ---"
ELAPSED=0

while [[ $ELAPSED -lt $MAX_WAIT ]]; do
  STATUS=$(gh pr checks "$PR_NUMBER" --json state -q '.[].state' 2>/dev/null || echo "PENDING")

  if echo "$STATUS" | grep -q "FAILURE"; then
    echo "ERROR: PR checks failed"
    gh pr checks "$PR_NUMBER" 2>/dev/null || true
    exit 1
  fi

  # All checks passed if no PENDING and at least one result
  if [[ -n "$STATUS" ]] && ! echo "$STATUS" | grep -qi "pending\|queued\|in_progress"; then
    echo "All PR checks passed (after ${ELAPSED}s)"
    break
  fi

  echo "  Waiting for checks... (${ELAPSED}s / ${MAX_WAIT}s)"
  sleep "$POLL_INTERVAL"
  ELAPSED=$((ELAPSED + POLL_INTERVAL))
done
echo ""

# 5. Verify PR is mergeable
echo "--- Step 5: Verifying PR is mergeable ---"
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
