# GitHub Flow

GitHub Flow is a lightweight, branch-based workflow designed for teams and projects that deploy regularly.

## Principles

### 1. The `main` branch is always deployable

The `main` branch should always contain production-ready code. Every commit on `main` is considered stable and can be deployed at any time.

### 2. Create descriptive branches off `main`

When starting new work, create a branch from `main` with a clear, descriptive name:

```bash
git checkout -b feature/add-user-auth
git checkout -b fix/login-redirect
```

### 3. Commit and push regularly

Make small, focused commits and push your branch to the remote frequently. This keeps your work backed up and visible to your team.

```bash
git add <files>
git commit -m "Add login form validation"
git push origin feature/add-user-auth
```

### 4. Open a Pull Request (PR)

When your work is ready for review (or you want early feedback), open a Pull Request. A PR initiates discussion and code review before merging.

- Describe **what** the changes do and **why** they are needed.
- Reference related issues if applicable.
- Request reviews from teammates.

### 5. Review and discuss

Team members review the code, leave comments, and suggest changes. The author addresses feedback by pushing additional commits to the same branch.

### 6. Merge to `main`

Once the PR is approved and all checks pass, merge the branch into `main`. Delete the branch after merging to keep the repository clean.

```bash
git checkout main
git pull origin main
git branch -d feature/add-user-auth
```

### 7. Deploy

After merging to `main`, deploy immediately. Since `main` is always deployable, every merge can go straight to production.

## Summary

```
main ──●────────────────●── deploy
        \              /
         ●──●──●──●──●
         branch + PR + review
```

1. Branch from `main`
2. Make changes and commit
3. Open a Pull Request
4. Review and iterate
5. Merge and deploy
