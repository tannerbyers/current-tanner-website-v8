#!/bin/bash
# Creates a new blog post with pre-filled frontmatter
# Usage: npm run new-post -- "My Post Title"
#   or:  ./scripts/new-post.sh "My Post Title"

set -euo pipefail

TITLE="${1:?Usage: $0 \"Post Title\"}"
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
DATE=$(date +%Y-%m-%d)
FILE="src/posts/${SLUG}.md"

if [ -f "$FILE" ]; then
  echo "Error: $FILE already exists."
  exit 1
fi

cat > "$FILE" <<EOF
---
title: "${TITLE}"
description: 
date: ${DATE}
tags: []
---

<!-- excerpt -->


EOF

echo "Created: $FILE"
echo "Open it and start writing!"
