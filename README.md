# 🔐 Full-Stack Authentication App

A secure and modern authentication system built with:

- **Frontend**: Next.js (React)
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (Access + Refresh Tokens)
- **State Handling**: Access token in memory, refresh token in httpOnly cookie

---

## 🚀 Features

- ✅ Secure user registration & login
- ✅ Password hashing with `bcryptjs`
- ✅ JWT-based access & refresh token flow
- ✅ Refresh token stored in **httpOnly** cookie
- ✅ Access token stored in memory (React state)
- ✅ Protected API routes
- ✅ Auto-refresh of access tokens via Axios interceptor
- ✅ Logout clears refresh token cookie
- ✅ Styled frontend using modular CSS

---

## 📁 Project Structure

auth-app-next-express-main/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ └── authController.js
│ ├── middleware/
│ │ └── verifyAccessToken.js
│ ├── models/
│ │ └── User.js
│ ├── routes/
│ │ └── authRoutes.js
│ ├── .env
│ └── server.js
│
├── frontend/
│ ├── pages/
│ │ ├── index.js
│ │ ├── login.js
│ │ ├── register.js
│ │ ├── dashboard.js
│ │ └── login.module.css
│ ├── utils/
│ │ └── axiosInstance.js
│ └── .env.local

yaml
Copy
Edit

---

## 🧪 How It Works

- On login:
  - Access token returned and stored in memory.
  - Refresh token sent in a **secure, httpOnly cookie**.

- On each request:
  - Axios sends the access token in Authorization header.
  - If the token expires, Axios interceptor attempts refresh using `/api/refresh-token`.

- On logout:
  - Refresh token is cleared from cookies.
  - Access token is removed from memory.

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/auth-app-next-express-main.git
cd auth-app-next-express-main
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
✅ Add .env file:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongo_uri_here
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
bash
Copy
Edit
npm run dev
3. Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
Make sure to add http://localhost:5000 to your CORS allowed origins in backend.

✅ API Routes
Method	Route	Description
POST	/api/register	Register new user
POST	/api/login	Login & issue tokens
GET	/api/protected	Protected route
POST	/api/refresh-token	Refresh access token
POST	/api/logout	Logout & clear cookie

🛡 Tech Stack
React (Next.js)

Node.js + Express

MongoDB + Mongoose

JWT (Access/Refresh tokens)

Axios

bcryptjs

cookie-parser

dotenv

📸 Screenshots
(You can add screenshots of login, dashboard, etc. here)

🧠 Credits
Built with ❤️ for learning and production-ready authentication workflows.

📄 License
MIT License — Free to use and modify.

yaml
Copy
Edit

---

Let me know if you’d like to:
- Add screenshots
- Customize your GitHub repo description
- Or convert this into a `docs/` site for production

Would you like me to generate a sample `.env` file too?