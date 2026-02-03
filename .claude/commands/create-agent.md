---
description: Create a new agent with single-responsibility validation
argument-hint: <agent description>
allowed-tools: Read, Glob, Grep, Task, AskUserQuestion
---

# `/create-agent` - Agent Creation Wizard

Creates new agents following single-responsibility principle with built-in validation.

## Workflow

1. **Parse Requirement** - Extract what the agent should do

2. **Single-Responsibility Pre-Check**
   Ask user to confirm:
   - What is the ONE thing this agent does?
   - Can you describe it with ONE verb?

   If multiple responsibilities detected:
   - Suggest splitting into multiple agents
   - Ask which agent to create first

3. **Determine Agent Type**
   | Indicators | Type | Location |
   |------------|------|----------|
   | General task | General | .claude/agents/ |
   | Domain-specific | Expert | .claude/agents/experts/<domain>/ |
   | New 4-agent pattern | Expert Domain | Create plan/build/improve/question |

4. **Route to Agent Authoring**
   ```
   Use Task:
     subagent_type: "agent-authoring-plan-agent"
     prompt: |
       USER_PROMPT: Create <agent type> agent that <single responsibility>

       VALIDATION_REQUIREMENTS:
       - Maximum 1-2 action verbs in description
       - Maximum 3 capabilities
       - Tool set must match agent type
   ```

5. **Approve and Build**
   - Show user the spec
   - Confirm single-responsibility compliance
   - Proceed to build phase

## Example Usage

```bash
# Good: Single responsibility
/create-agent "scout agent for TypeScript files"

# Will prompt for clarification:
/create-agent "agent that reviews code and fixes issues"
# -> "Should I create TWO agents? A review-agent AND a fix-agent?"
```

## Report Format

```markdown
## Agent Created

**Name:** <agent-name>
**Type:** <general|expert>
**Single Responsibility:** <one-sentence description>

**Validation Results:**
- Description verbs: <count> (max 2)
- Capabilities: <count> (max 3)
- Tool coherence: PASS

**Files Created:**
- <agent file path>
- agent-registry.json updated
```
