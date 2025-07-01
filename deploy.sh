#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "Fehler: Bitte gib eine Commit-Message an."
  echo "Beispiel: ./deploy.sh \"Update deployment\""
  exit 1
fi

COMMIT_MSG="$1"
rm -rf dist
npm run build
rm -rf docs
mkdir docs
cp -r dist/* docs/
git add .
git commit -m "$COMMIT_MSG"
git push
