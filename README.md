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

<img width="1248" height="547" alt="Screenshot 2026-06-05 082817" src="https://github.com/user-attachments/assets/17b2c685-265d-4cc4-8d6d-034467c85ddd" />
<img width="1206" height="606" alt="Screenshot 2026-06-05 082834" src="https://github.com/user-attachments/assets/451a6b5a-ce16-4dfa-b315-7a0faa710602" />
<img width="1349" height="556" alt="Screenshot 2026-06-05 083517" src="https://github.com/user-attachments/assets/0e22d597-f45d-4b2f-8541-10d7c040af0c" />
<img width="1329" height="553" alt="Screenshot 2026-06-05 083533" src="https://github.com/user-attachments/assets/2f7f3b2c-9953-42ce-bc7f-243fc237d9e7" />
<img width="1328" height="558" alt="Screenshot 2026-06-05 083549" src="https://github.com/user-attachments/assets/1ad82567-97ac-4d98-8565-eec090e90255" />
<img width="1324" height="560" alt="Screenshot 2026-06-05 083608" src="https://github.com/user-attachments/assets/1aa48c18-fa32-4a61-85fe-bc94e493c290" />
<img width="1337" height="596" alt="Screenshot 2026-06-05 083621" src="https://github.com/user-attachments/assets/3ca32d49-baa1-41f2-8fa4-d74d144e3a56" />
<img width="1280" height="511" alt="Screenshot 2026-06-05 083634" src="https://github.com/user-attachments/assets/7ff3d31c-a3fc-41e4-a3b9-5ef81249f841" />
<img width="1274" height="539" alt="Screenshot 2026-06-05 083659" src="https://github.com/user-attachments/assets/8ab71d3a-012d-41d6-97b9-c1e23a991f00" />
<img width="1243" height="600" alt="Screenshot 2026-06-05 083741" src="https://github.com/user-attachments/assets/bc4ef3c5-b68e-496c-9b8b-265e32f7f845" />
