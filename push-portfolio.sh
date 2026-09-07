#!/usr/bin/env bash
# Push portfolio branch to GitHub
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=========================================================="
echo "🚀 Pushing 'portfolio' branch to GitHub (gazifahim/Portfolio-Website)..."
echo "=========================================================="

git push -u origin portfolio

echo "=========================================================="
echo "🎉 SUCCESS! Branch 'portfolio' pushed to GitHub!"
echo "View it at: https://github.com/gazifahim/Portfolio-Website/tree/portfolio"
echo "=========================================================="
