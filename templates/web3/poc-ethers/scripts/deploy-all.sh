#!/bin/bash
set -e

# 🔒 Ensure script always runs from project root, no matter where it's executed from
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# 📁 Path to Lambda variants
LAMBDA_DIR="lambdas"

# --- Tool Checks ---
echo "🔎 Checking required tools..."

function check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "❌ Error: '$1' is not installed or not in PATH."
    echo "👉 Please install '$1' before running this script."
    exit 1
  fi
}

check_command npm
check_command sam
check_command make

echo "✅ All required tools are installed."

# 🚀 Deploy each Lambda
for dir in 1-unbundled 2-bundled 3-bundled-minified; do
  echo "📦 Deploying $dir..."
  cd "$LAMBDA_DIR/$dir"
  npm ci # OBS: esbuild needs to be installed before running deploy
  npm run deploy
  cd "$SCRIPT_DIR/.."
done

echo "✅ All Lambda variants deployed successfully!"
