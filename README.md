# CelebNetwork.com

A full-stack web application for celebrity discovery and fan engagement. Built with a modern microservices-ready stack, AI-powered features, and robust user management.

---

## 🚀 Project Overview
CelebNetwork.com is a platform for discovering global celebrities, following your favorites, and engaging as a fan. It features AI-powered search, onboarding, public celebrity profiles, fan management, PDF generation, and more.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Nest.js (TypeScript, REST API)
- **Database:** PostgreSQL (Supabase)
- **AI Integration:** Gemini (Google Generative AI)
- **Authentication:** JWT (role-based: fan, celebrity)
- **PDF Generation:** Puppeteer
- **Deployment:** Vercel (frontend), AWS Lambda (backend)

---

## ✨ Features
- AI-powered celebrity search (Gemini)
- AI-assisted onboarding for new celebrities
- Public celebrity profiles with PDF download
- Fan management (follow/unfollow, dashboard)
- Role-based authentication (fan/celebrity)
- Modern, responsive UI (dark/light)
- Robust image handling and fallback
- Swagger API docs

---

## 📦 Project Structure
```
celebnetwork/
  backend/    # Nest.js API, database, seeding
  frontend/   # Next.js app, Tailwind CSS
```

---

## ⚡ Quick Start

### 1. Clone the Repo
```bash
git clone <your-repo-url>
cd celebnetwork
```

### 2. Setup Environment Variables
- Copy `.env.example` to `.env` in both `backend/` and `frontend/`.
- Fill in your Supabase, JWT, and Gemini API keys as needed.

### 3. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Database Setup (Supabase/Postgres)
- Create a Supabase project and Postgres database.
- Update your backend `.env` with the connection string.
- Run migrations if needed (or let TypeORM sync entities).

### 5. Seed the Database
```bash
cd backend
npx ts-node src/seed.ts
```
- This will populate the database with 50+ sample celebrities (no images by default).

### 6. Run the Backend
```bash
npm run start:dev
```
- The API will be available at `http://localhost:3001` (or your configured port).

### 7. Run the Frontend
```bash
cd ../frontend
npm run dev
```
- The app will be available at `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL` - Postgres connection string
- `JWT_SECRET` - Secret for JWT auth
- `GEMINI_API_KEY` - Google Gemini API key
- `SUPABASE_URL`, `SUPABASE_KEY` (if using Supabase client)

### Frontend (`frontend/.env`)
- `NEXT_PUBLIC_API_URL` - URL of your backend API (e.g., `http://localhost:3001`)

---

## 🧑‍💻 Development Notes
- **Image Handling:** All celebrities use a default avatar unless a valid `photoUrl` is provided.
- **PDF Generation:** Downloadable from each celebrity profile.
- **AI Search:** Uses Gemini for smart celebrity suggestions.
- **Role-based Auth:** Fans and celebrities see different dashboards and navigation.

---

## 🐞 Troubleshooting
- **Image 404s:** If you see repeated image errors, ensure all `photoUrl` fields are valid or empty.
- **CORS Issues:** Make sure backend CORS is configured to allow frontend origin.
- **JWT Errors:** Check your secret and token expiration settings.
- **Database Connection:** Verify your Supabase/Postgres credentials.

---

## 🚀 Deployment
- **Frontend:** Deploy to Vercel for best Next.js support.
- **Backend:** Deploy to AWS Lambda (or any Node.js-compatible host).
- **Environment:** Set all required environment variables in your deployment platform.

---

## 🤝 Contributing
1. Fork the repo and create your branch.
2. Make your changes and add tests if needed.
3. Open a pull request with a clear description.

---

## 🙏 Credits
- [Next.js](https://nextjs.org/)
- [Nest.js](https://nestjs.com/)
- [Supabase](https://supabase.com/)
- [Google Gemini](https://ai.google.dev/gemini-api)
- [Tailwind CSS](https://tailwindcss.com/)
- [Puppeteer](https://pptr.dev/)

---

## 📧 Contact
For questions or support, open an issue 
Name: Sanjay Kirti
E-mail: lukebrushwood@gmail.com
