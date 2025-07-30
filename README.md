# Auth Session Relations (Raw SQL Edition)

A full-stack authentication system using:

- ✅ **Frontend**: Next.js
- ✅ **Backend**: Node.js + Express
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Security**: JWT (access + refresh), Redis blacklist, bcryptjs
- ✅ **Admin Features**: Paginated user listing, session revocation

---

## 🔐 Features

- 🔑 Secure login & registration with hashed passwords
- 🍪 Refresh token via httpOnly cookies
- ♻️ Access token renewal with Redis token blacklist
- 🔒 Admin-only paginated user API
- 🔄 Logout with token revocation
- 📦 Raw SQL queries using Prisma's `$queryRaw`

---

## 🖥️ Screenshots (View from Project Folder)

> You can view the screenshots inside the following folder:

frontend/screenshots/

yaml
Copy
Edit

Example files:
- `login-page.png`
- `users-page.png`

Open directly in your project or GitHub repo UI.

---

## 🚀 Getting Started

### 📁 Clone the Repository

```bash
git clone https://github.com/yourusername/auth-session-relations-rawsql.git
cd auth-session-relations-rawsql
🔧 Backend Setup

bash
cd backend
npm install
npx prisma migrate dev
node server.js
Make sure your .env in /backend contains:

ini
DATABASE_URL=postgresql://your_db_url_here
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
NODE_ENV=development
🖼️ Frontend Setup

bash
cd frontend
npm install
npm run dev
📂 Folder Structure

arduino
auth-session-relations-rawsql/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── .env
│
├── frontend/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   └── screenshots/ ← 📸 image previews live here
👤 Author
Saim Ahmed
Full Stack Intern @ Developra.io

