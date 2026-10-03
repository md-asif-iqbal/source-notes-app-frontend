# Secure Note-Taking Application - Frontend

A functional, secure client dashboard built with Next.js (App Router), TypeScript, and React Icons. Designed with clean, professional SaaS solid styling (zero gradients), full Role-Based Access Control integration, and dedicated interactive views for MongoDB aggregation pipelines.

---

## 1. Application Architecture

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailored solid SaaS color system (zero gradients, accessible Slate/Navy theme)
- **Icons**: React Icons (`react-icons/fi`)
- **State & Authentication**: React Context API with JWT persistence in localStorage

---

## 2. Integrated Features & Views

1. **Authentication (`/login`, `/register`)**:
   - Secure registration with custom interest tags.
   - 1-click test credentials for Administrator and Standard User for instant interview evaluation.
2. **Notes Workspace (`/notes`)**:
   - Paginated note listings.
   - User mode: view, create, edit, delete own notes.
   - Admin mode: toggle switch between "My Notes Only" and "All Users' Notes" across the system.
   - Note creation & editing modals with tag support.
3. **Interests Aggregation View (`/interests`)**:
   - Interactive UI demonstrating **Scenario 1: Group by Interests**.
   - Displays users grouped by normalized interest tags, total user counts, and user profile badges.
4. **Public Posts & Aggregation View (`/posts`)**:
   - Public posts feed with pagination.
   - Post publishing modal.
   - **Scenario 2 ($lookup) demonstration**: Click "Filter by Author ($lookup)" to trigger the backend pipeline joining the target user and their posts.
5. **Admin User Management (`/admin/users`)**:
   - Paginated user list with RBAC badges.
   - Create new user modal (with role selection and interest tags).
   - Edit user details.
   - Delete user with safety check.

---

## 3. Local Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
# Copy .env.example to .env.local
cp .env.example .env.local

# 3. Start development server
npm run dev
```

The frontend will run at `http://localhost:3000`.

---

## 4. Deployment Instructions

### Deploy to Vercel
1. Push the `frontend` folder to a GitHub repository (e.g. `secure-notes-frontend`).
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed backend (e.g., `https://secure-notes-backend.onrender.com/api`).
5. Click **Deploy**.
