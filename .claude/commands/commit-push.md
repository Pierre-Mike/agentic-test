# Commit & Push

Commit all changes and push to the remote. Follow the steps below exactly.

## Steps

1. Run `git status` and `git diff` to review all staged and unstaged changes.
2. Run `git log --oneline -5` to see recent commit message style.
3. Stage the relevant changed files individually (do NOT use `git add -A` or `git add .`). Skip files that contain secrets (.env, credentials, etc).
4. Write a concise commit message that summarizes the "why" of the changes. Follow the existing commit message style from the repo.
5. Create the commit. End the message with:
   `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`
6. Push to the current branch's remote tracking branch. If no upstream is set, push with `-u origin <current-branch>`.
7. Confirm success by running `git status` after push.

## Additional Context
$ARGUMENTS
