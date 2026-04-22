#!/bin/bash
# Backup all project files for Lil Jr Atomic Mobile
# Usage: bash backup_project.sh

BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

mkdir "$BACKUP_DIR"
cp -r App.js app.json babel.config.js index.js package.json eas.json build.js dist src "$BACKUP_DIR" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "Backup complete. All files copied to $BACKUP_DIR."
else
  echo "Backup failed. Please check file permissions."
fi
