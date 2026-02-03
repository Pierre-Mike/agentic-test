# Domain Expertise System

This directory contains domain-specific expertise files that guide Claude agents in performing specialized tasks within the codebase.

## Directory Structure

```
experts/
├── _template/           # Template for new domains
│   └── expertise.yaml
├── github/              # GitHub workflows, labels, CI/CD
│   └── expertise.yaml
├── agent-authoring/     # Agent configuration patterns
│   └── expertise.yaml
├── testing/             # Test patterns and conventions
│   └── expertise.yaml
└── README.md            # This file
```

## Size Governance

Expertise files must stay within size limits to remain useful and maintainable:

| Threshold | Lines | Action |
|-----------|-------|--------|
| Target | 400-600 | Ideal operating range |
| Warning | 800 | Consider consolidation |
| Hard limit | 1000 | Must split or prune |

Check file size with: `wc -l .claude/agents/experts/<domain>/expertise.yaml`

## When to Update Expertise

**Add new content when:**
- A pattern is used successfully 3+ times
- A pitfall is encountered and resolved
- A decision tree helps clarify a recurring question
- A new workflow or integration is added

**Do NOT add:**
- One-off solutions unlikely to recur
- Verbose explanations (keep it concise)
- Content covered by other expertise files
- Duplicate information already in key_files

## Pruning Strategy

When approaching the warning threshold (800 lines):

1. **Review timestamps** - Remove content not updated in 6+ months
2. **Check references** - Remove patterns that reference deleted code
3. **Merge similar** - Consolidate redundant decision trees or patterns
4. **Extract to commands** - Move procedural content to `.claude/commands/`
5. **Link instead of inline** - Reference key_files instead of duplicating content

## Maintenance Schedule

| Frequency | Task |
|-----------|------|
| Per-cycle | Update stability.notes with changes made |
| Monthly | Review known_issues, close resolved ones |
| Quarterly | Full review: prune stale content, update line counts |

## Creating New Domains

1. Copy the template:
   ```bash
   cp -r .claude/agents/experts/_template .claude/agents/experts/<new-domain>
   ```

2. Fill in the expertise.yaml sections:
   - `overview`: description, scope, rationale
   - `core_implementation`: key concepts and files
   - `key_operations`: step-by-step procedures
   - `decision_trees`: common decision points
   - `patterns`: reusable structures
   - `best_practices`: do's and don'ts
   - `known_issues`: gotchas and workarounds

3. Register the domain in `.claude/agents/agent-registry.json`

4. Create associated agents if needed (plan, build, question, improve)

## Cross-Domain References

When expertise overlaps with another domain:

- **Do**: Reference the other expertise file in the `scope` section
- **Do**: Use `see <domain> expert` to redirect queries
- **Don't**: Duplicate content across domains
- **Don't**: Create circular dependencies

Example scope statement:
```yaml
scope: |
  Covers GitHub issue management and CI/CD automation.
  Does NOT cover Claude Code configuration (see claude-config expert).
```

## Expertise File Sections

| Section | Purpose | Required |
|---------|---------|----------|
| `overview` | Description, scope, rationale | Yes |
| `core_implementation` | Key concepts, files, structures | Yes |
| `key_operations` | Step-by-step procedures | Yes |
| `decision_trees` | If/then guidance for decisions | Yes |
| `patterns` | Reusable templates and structures | Optional |
| `best_practices` | Categorized guidelines | Optional |
| `known_issues` | Gotchas with resolutions | Optional |
| `stability` | Change tracking and review dates | Yes |

## Validation

Before committing expertise changes:

1. **YAML syntax**: Ensure valid YAML (use a linter)
2. **Line count**: Stay under 800 lines (warning threshold)
3. **File references**: Verify key_files paths exist
4. **Decision tree coverage**: Test common scenarios
5. **No contradictions**: Check against related expertise files
