#!/usr/bin/env bash
# Quick script to create GitHub repository and push code
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

export PATH="$HOME/.local/bin:$PATH"
export GIT_EXEC_PATH="$HOME/.local/lib/git-core"

REPO_NAME="seo-portfolio"

echo "=========================================================="
echo "🚀 Pushing Gazi Fahim Hasan Portfolio to GitHub"
echo "=========================================================="

if ! gh auth status &>/dev/null; then
    echo "⚠️ You are not logged into GitHub CLI yet."
    echo "👉 Please run:  gh auth login"
    echo "Then re-run this script."
    exit 1
fi

echo "Creating GitHub repository: $REPO_NAME (Public)..."
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push

echo "=========================================================="
echo "🎉 SUCCESS! Your portfolio is live on GitHub!"
echo "View it at: https://github.com/$(gh api user -q .login)/$REPO_NAME"
echo "=========================================================="
