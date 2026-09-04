#!/usr/bin/env bash

# Gazi Fahim Hasan Portfolio Quick Launcher
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

export PATH="$HOME/.local/bin:$PATH"

echo "=========================================================="
echo "⚡ Launching Gazi Fahim Hasan's Full-Stack Portfolio..."
echo "=========================================================="

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js could not be found in PATH."
    exit 1
fi

echo "✅ Runtime: Node $(node -v) | NPM $(npm -v)"
echo "🚀 Starting Full-Stack Server at http://localhost:5000"
echo "👉 Press Ctrl+C to terminate."
echo "=========================================================="

exec node --watch backend/server.js
