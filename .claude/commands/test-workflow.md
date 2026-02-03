Run the auto-implement workflow end-to-end test using `scripts/test-workflow.sh`.

Execute the script in the background with timestamps on every line:

```
bash scripts/test-workflow.sh 2>&1 | while IFS= read -r line; do printf "[%s] %s\n" "$(date '+%H:%M:%S')" "$line"; done
```

Then monitor the output periodically (every ~60s) and report progress to the user in a formatted table:

| Step | Started | Duration | Status |
|------|---------|----------|--------|

Include these steps:
1. Pre-cleanup
2. Create issue (show issue number and link)
3. Wait for draft PR (show PR number when found)
4. phase:tests → phase:implement
5. phase:implement → phase:finalize
6. phase:finalize → phase:complete
7. Verify PR ready for review
8. Verify PR mergeable

When a step completes, update the table with its duration. If `phase:failed` appears, report the failure comment from the PR. When all steps finish, show a final summary with total elapsed time.
