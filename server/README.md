# Marketplace backend (Django + DRF)

A self-contained REST API powering the sign-in / sign-up / profile / seller /
buyer flows in the renderer. JWT auth via `djangorestframework-simplejwt`.

## Setup

```bash
cd server
python -m venv venv
# Windows:  venv\Scripts\activate
# macOS/Linux:  source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations accounts catalog
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin
python manage.py runserver         # http://127.0.0.1:8000
```

The renderer expects the API at `http://127.0.0.1:8000/api` by default
(override with the `VITE_API_BASE_URL` env var at build time).

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register/` | public | Sign up (`username, email, password, role`) |
| POST | `/api/auth/login/` | public | Login → `{ access, refresh, user }` |
| POST | `/api/auth/refresh/` | public | Refresh access token |
| GET | `/api/profile/me/` | user | Current user + profile |
| GET/PATCH | `/api/profile/` | user | Read / edit profile |
| GET | `/api/products/` | user | Browse active products |
| GET | `/api/products/<id>/` | user | Product detail |
| GET/POST | `/api/seller/products/` | seller | List / create own products |
| GET/PUT/PATCH/DELETE | `/api/seller/products/<id>/` | seller | Manage own product |
| GET | `/api/seller/dashboard/` | seller | Seller stats |
| GET/POST | `/api/buyer/orders/` | buyer | List / place orders |
| GET | `/api/buyer/dashboard/` | buyer | Buyer stats |

`role` is `buyer` or `seller` and is fixed at sign-up. Sellers manage
products; buyers place orders (which decrement stock).

## Notes

- `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, and CORS origins are read from
  environment variables — see `config/settings.py`. The defaults are
  development-only.
- SQLite (`db.sqlite3`) is used out of the box; swap `DATABASES` for Postgres
  in production.
