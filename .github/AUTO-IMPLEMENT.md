# Auto-Implement Workflow

This workflow automatically plans and implements GitHub issues, creating pull requests without manual intervention.

## How It Works

When you add the `auto-implement` label to an issue, Claude Code will:

1. **Analyze the Issue** - Read and understand the requirements
2. **Create a Plan** - Generate a detailed implementation plan in `specs/` directory
3. **Implement** - Write the code following the plan
4. **Test** - Run all validation commands (tests, builds, type-checks)
5. **Create PR** - Open a pull request linked to the issue
6. **Comment** - Post the PR link back to the original issue

## Setup

### 1. Create the Label

Create an `auto-implement` label in your repository:

```bash
gh label create "auto-implement" \
  --description "Automatically plan and implement this issue" \
  --color "0E8A16"
```

### 2. Configure Secrets

Add the required secret to your repository:

```bash
gh secret set ANTHROPIC_API_KEY
```

Get your API key from: https://console.anthropic.com/settings/keys

### 3. Verify Permissions

The workflow requires these permissions (already configured):
- `contents: write` - Create branches and commits
- `pull-requests: write` - Create pull requests
- `issues: write` - Comment on issues

## Usage

### Basic Usage

1. Create an issue with clear requirements
2. Add the `auto-implement` label
3. Wait for the workflow to complete
4. Review the PR that gets created

### Issue Requirements

For best results, issues should include:

**For Features:**
- Clear description of what you want to build
- User story or use case
- Any specific requirements or constraints
- Example: "Add a dark mode toggle to the settings page"

**For Bugs:**
- Steps to reproduce
- Expected behavior
- Actual behavior
- Any error messages or logs
- Example: "Login button doesn't work when user enters invalid email"

**For Chores/Refactors:**
- What needs to be refactored
- Why it needs refactoring
- Any constraints or patterns to follow
- Example: "Refactor API error handling to use consistent error format"

### Examples

**Good Issue:**
```
Title: Add user profile page

Description:
We need a user profile page where users can view and edit their information.

Requirements:
- Display user's name, email, and avatar
- Allow editing name and avatar
- Save changes to the backend API
- Show validation errors inline
- Add loading states for save operation

API endpoint already exists at POST /api/user/profile
```

**Poor Issue:**
```
Title: Fix bug

Description:
Something is broken
```

## Workflow Details

### Workflow File

Location: `.github/workflows/auto-implement.yml`

### Timeout

The workflow has a 30-minute timeout. If implementation takes longer, it will be cancelled.

### Branch Naming

PRs are created from branches named: `issue-{number}-auto-implement`

Example: `issue-42-auto-implement`

### Commit Messages

Commits follow this format:
```
Implement #{issue_number}: {issue_title}

- Detailed changes
- From auto-implement workflow

Co-Authored-By: GitHub Actions Bot <actions@github.com>
```

### PR Format

PRs include:
- Title: "Closes #{issue_number}: {issue_title}"
- Link to original issue
- Summary of changes made
- Link to the plan file
- Test results and validation

## Advanced Configuration

### Customize the Model

Edit `.github/workflows/auto-implement.yml`:

```yaml
model: sonnet  # Options: sonnet, opus, haiku
```

- `haiku` - Fastest, lowest cost, good for simple tasks
- `sonnet` - Balanced (default)
- `opus` - Most capable, best for complex tasks

### Customize Timeout

```yaml
timeout-minutes: 30  # Adjust as needed
```

### Add Issue Templates

Create `.github/ISSUE_TEMPLATE/feature.yml` to guide users:

```yaml
name: Feature Request (Auto-Implement)
description: Request a new feature (can be auto-implemented)
labels: ["auto-implement"]
body:
  - type: textarea
    id: description
    attributes:
      label: Feature Description
      description: What feature do you want to add?
    validations:
      required: true
  - type: textarea
    id: requirements
    attributes:
      label: Requirements
      description: List specific requirements
    validations:
      required: true
```

## Monitoring

### View Workflow Runs

```bash
gh run list --workflow=auto-implement.yml
```

### View Logs

```bash
gh run view {run-id} --log
```

### Check PR Status

```bash
gh pr list --label "auto-implement"
```

## Troubleshooting

### Workflow Doesn't Start

- Check that the label name is exactly `auto-implement` (case-sensitive)
- Verify `ANTHROPIC_API_KEY` secret is set
- Check workflow permissions in repository settings

### Workflow Fails

Common issues:
- **Issue unclear**: Add more details to the issue
- **Tests fail**: Fix failing tests before re-running
- **Timeout**: Break into smaller issues
- **API rate limit**: Wait and re-trigger

### Re-run Failed Workflow

Remove and re-add the label:

```bash
gh issue edit {issue-number} --remove-label "auto-implement"
gh issue edit {issue-number} --add-label "auto-implement"
```

Or use the GitHub UI to re-run the workflow.

## Best Practices

1. **Write Clear Issues** - The better the issue description, the better the implementation
2. **One Feature Per Issue** - Keep issues focused on a single feature or bug
3. **Review PRs** - Always review auto-generated code before merging
4. **Start Small** - Test with simple issues first
5. **Provide Context** - Reference related files, patterns, or examples in the issue
6. **Set Expectations** - Complex features may need manual refinement

## Limitations

- Works best with well-defined, scoped issues
- Complex features may need multiple iterations
- Cannot access external services or databases during planning
- May need human review for architectural decisions
- 30-minute timeout for implementation

## Manual Override

If you need to manually implement an issue that has the label:

1. Remove the `auto-implement` label
2. Implement manually
3. Create PR normally

## Security

- Workflow runs in isolated GitHub Actions environment
- Only has access to repository code and secrets
- Cannot access other repositories or external systems
- Review auto-generated code for security issues before merging

## Cost Considerations

Each auto-implementation uses Anthropic API credits:
- Simple feature: ~$0.10-$0.50
- Complex feature: ~$0.50-$2.00

Using `model: haiku` can reduce costs significantly for simple tasks.

## Related Workflows

- **Issue Triage** (`.github/workflows/issue-triage.yml`) - Auto-labels issues
- **Claude Code** (`.github/workflows/claude.yml`) - Responds to @claude mentions
- **Code Review** (`.github/workflows/claude-code-review.yml`) - Auto-reviews PRs

## Support

For issues with the workflow:
1. Check the workflow logs
2. Review this documentation
3. Open an issue with the workflow logs attached
