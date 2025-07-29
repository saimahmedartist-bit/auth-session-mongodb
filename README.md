# 🔐 Auth Session Relations

A simple and secure authentication system built with **Next.js (frontend)** and **Express + Prisma + PostgreSQL (backend)**. It includes user registration, login, JWT access/refresh tokens, and proper token revocation using PostgreSQL relationships.

---

## ✅ Features

- Register & Login with hashed passwords using `bcryptjs`
- JWT-based **access** & **refresh** token system
- Secure cookie storage (`httpOnly`) for refresh tokens
- PostgreSQL database using Prisma ORM
- Token revocation on logout
- Fully protected routes
- Automatic token refresh via Axios interceptors
- Responsive Next.js frontend with protected dashboard

---

## 🛠 Tech Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Frontend    | Next.js + Axios               |
| Backend     | Node.js + Express             |
| Auth        | JWT + bcryptjs                |
| Database    | PostgreSQL + Prisma ORM       |
| Storage     | Refresh tokens in DB + cookie |
| UI State    | React useState                |

---

## 📁 Folder Structure

auth-session-relations/
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── prisma/
│ │ └── schema.prisma
│ ├── middleware/
│ ├── .env
│ └── server.js
├── frontend/
│ ├── pages/
│ │ ├── login.js
│ │ └── dashboard.js
│ └── _app.js
├── screenshots/
├── .gitignore
└── README.md

yaml
Copy
Edit

---

## 🔄 API Endpoints

| Method | Endpoint            | Description                  |
|--------|---------------------|------------------------------|
| POST   | `/api/register`     | Register new user            |
| POST   | `/api/login`        | Authenticate & get tokens    |
| POST   | `/api/logout`       | Revoke refresh token         |
| POST   | `/api/refresh-token`| Issue new access token       |
| GET    | `/api/protected`    | Test protected route         |

---

## 🧪 How to Test

1. **Register via Postman**  
   `POST http://localhost:5000/api/register`

2. **Login via Postman**  
   `POST http://localhost:5000/api/login`  
   - Receives access token + sets refresh token as httpOnly cookie

3. **Access Protected Route**  
   `GET http://localhost:5000/api/protected`  
   - Must send `Authorization: Bearer <access_token>`

4. **Logout**  
   `POST http://localhost:5000/api/logout`  
   - Revokes refresh token in DB

5. **Token Refresh Auto Works**  
   - Try hitting protected route after access token expiry. It will auto-refresh.

---

## 🖼️ Screenshots

All screenshots are available inside the `/screenshots/` folder:

- `localhost` running confirmation  
- `terminal-frontend.png`  
- `terminal-backend.png`  
- `Postman-Login.png`  
- `Postman-Register.png`  
- `pg-myadmin.png`

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000

# JWT secrets
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/authdb?schema=public"
📦 Run the App
📁 Backend
bash
Copy
Edit
cd backend
npm install
npx prisma migrate dev --name init
npm start
🖥️ Frontend
bash
Copy
Edit
cd frontend
npm install
npm run dev
🧠 Author
Saim Ahmed
Web Development Intern
GitHub


