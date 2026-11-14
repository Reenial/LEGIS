#!/usr/bin/env bash
# Creates or updates the database and loads categories and keywords.
# Same as: cd backend && npm run db:setup -- [--sample]
# Uses DATABASE_URL from backend/.env or the environment. See database/README.md.
set -euo pipefail
cd "$(dirname "$0")/../backend"
npm run db:setup -- "$@"
