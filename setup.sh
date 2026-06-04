#!/usr/bin/env bash
# run from the repo root: bash setup.sh
set -e

echo ""
echo "=== AdminFlow Setup ==="
echo ""

# 1. Install root concurrently
echo "→ Installing root dependencies (concurrently)…"
npm install

# 2. Install frontend deps
echo "→ Installing frontend dependencies…"
cd frontend && npm install && cd ..

# 3. Backend Python deps
echo "→ Installing backend Python dependencies…"
cd backend && pip install -r requirements.txt && cd ..

# 4. Migrate DB
echo "→ Running Django migrations…"
cd backend && python manage.py migrate --noinput && cd ..

# 5. Seed data
echo "→ Seeding demo data…"
cd backend && python manage.py shell -c "
from dashboard.services import ensure_seed_data
ensure_seed_data()
print('  Seed data ready.')
" && cd ..

echo ""
echo "=== Setup complete! ==="
echo ""
echo "  Start everything:   npm run dev"
echo "  Create superuser:   npm run setup:superuser"
echo ""
echo "  Frontend → http://localhost:3000"
echo "  Django   → http://localhost:8000"
echo "  API docs → http://localhost:8000/api/"
echo ""