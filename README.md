# SaaS Admin Dashboard

Full-stack starter using:

- Django for the backend API
- Next.js for the frontend dashboard
- MySQL for the database

## Project Structure

```text
backend/   Django project and API endpoints
frontend/  Next.js app router dashboard UI
```

## Backend Setup

Create a MySQL database:

```sql
CREATE DATABASE saas_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create and activate a Python virtual environment from the `backend` folder:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Update `backend/.env` with your MySQL username and password, then run:

```powershell
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Useful API routes:

- `GET http://127.0.0.1:8000/api/health/`
- `GET http://127.0.0.1:8000/api/dashboard/summary/`

## Frontend Setup

From the `frontend` folder:

```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend reads the API URL from:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## Development Notes

The dashboard page includes fallback demo data, so it renders even before the Django server is running. Once the backend is live, Next.js fetches the same shape of data from Django.
