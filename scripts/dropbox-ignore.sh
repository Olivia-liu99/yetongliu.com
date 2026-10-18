#!/bin/sh
# Tell Dropbox not to sync folders that tools generate. They hold thousands of
# files that can be rebuilt at any time, and syncing them slows Dropbox down.
# Uses the attribute for Dropbox on macOS File Provider (~/Library/CloudStorage).
set -e
cd "$(dirname "$0")/.."
for dir in node_modules dist dist-test .astro .venv test-results; do
  mkdir -p "$dir"
  xattr -w 'com.apple.fileprovider.ignore#P' 1 "$dir"
done
echo "Dropbox will skip: node_modules dist dist-test .astro .venv test-results"
