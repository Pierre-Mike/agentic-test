#!/bin/bash
#
# Setup script for auto-implement workflow
# This script creates the necessary label for the workflow to function
#

set -e

echo "🤖 Setting up auto-implement workflow..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "   Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI"
    echo "   Run: gh auth login"
    exit 1
fi

echo "✓ GitHub CLI is installed and authenticated"
echo ""

# Create the auto-implement label
echo "Creating 'auto-implement' label..."
if gh label create "auto-implement" \
    --description "Automatically plan and implement this issue" \
    --color "0E8A16" 2>/dev/null; then
    echo "✓ Label 'auto-implement' created successfully"
else
    echo "⚠️  Label 'auto-implement' may already exist (this is okay)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add ANTHROPIC_API_KEY secret to your repository:"
echo "   gh secret set ANTHROPIC_API_KEY"
echo ""
echo "2. Get your API key from:"
echo "   https://console.anthropic.com/settings/keys"
echo ""
echo "3. Test the workflow by:"
echo "   - Creating a new issue"
echo "   - Adding the 'auto-implement' label"
echo ""
echo "📚 Full documentation: .github/AUTO-IMPLEMENT.md"
