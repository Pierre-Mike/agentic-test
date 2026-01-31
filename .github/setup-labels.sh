#!/bin/bash

# Issue Type Labels
gh label create "bug" --description "Something isn't working" --color "d73a4a" --force
gh label create "feature" --description "New feature or enhancement" --color "a2eeef" --force
gh label create "chore" --description "Maintenance, refactoring, or infrastructure" --color "fef2c0" --force

# Confidence Labels (for auto-implement assessment)
gh label create "confidence:high" --description "High confidence for auto-implementation" --color "0e8a16" --force
gh label create "confidence:medium" --description "Medium confidence, needs review" --color "fbca04" --force
gh label create "confidence:low" --description "Low confidence, requires human review" --color "e99695" --force

# Workflow Labels
gh label create "auto-implement" --description "Automatically implement this issue" --color "0e8a16" --force
gh label create "needs-review" --description "Requires human review before proceeding" --color "fbca04" --force
gh label create "needs-info" --description "More information needed from reporter" --color "d876e3" --force
gh label create "needs-breakdown" --description "Issue is too large, needs to be broken down" --color "f9d0c4" --force
gh label create "has-dependencies" --description "Blocked by or depends on other issues" --color "c5def5" --force

# Priority Labels
gh label create "P1" --description "Critical priority" --color "b60205" --force
gh label create "P2" --description "High priority" --color "d93f0b" --force
gh label create "P3" --description "Normal priority" --color "0e8a16" --force

# Workspace Labels
gh label create "client" --description "Affects client workspace" --color "1d76db" --force
gh label create "server" --description "Affects server workspace" --color "5319e7" --force
gh label create "shared" --description "Affects shared workspace" --color "006b75" --force

# Dependency Labels
gh label create "dependencies" --description "Dependency updates" --color "0366d6" --force
gh label create "ci-cd" --description "CI/CD changes" --color "bfd4f2" --force

# Review Labels
gh label create "review:done" --description "Peer review approved" --color "0e8a16" --force
gh label create "review:needs-work" --description "Peer review requested changes" --color "e99695" --force

echo "Labels created successfully!"
