# API Testing Dashboard

A simplified Postman-like web app for developers.

## Stack

- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
- Frontend: React, Axios, Bootstrap

## Features

- Register / Login with JWT auth
- Send HTTP requests (GET, POST, PUT, DELETE)
- Add URL, headers, and JSON body
- View formatted JSON response with status code and response time
- Request history with re-run support

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# update .env values
npm run migrate
npm run dev
```

Backend runs at `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# set REACT_APP_API_BASE_URL=http://localhost:5000/api
npm start
```

Frontend runs at `http://localhost:3000`.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/request/send`
- `GET /api/request/history`
