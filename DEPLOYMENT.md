# Deployment Guide for ZentriFin

This guide outlines the steps to deploy the ZentriFin application to production. The architecture consists of two main components:
1.  **Next.js Application**: Hosted on Vercel (Frontend & API).
2.  **Worker Process**: Hosted on Railway or Render (Background job processing).

Both components share a **PostgreSQL Database** and a **Redis** instance.

## Prerequisites

*   **GitHub Account**: To host your code.
*   **Vercel Account**: For the Next.js app.
*   **Railway or Render Account**: For the worker process.
*   **Supabase or Neon Account**: For the PostgreSQL database.
*   **Upstash Account**: For Redis.

---

## Step 1: Set up the Database (PostgreSQL)

1.  Create a new project on **Supabase** or **Neon**.
2.  Get the connection string (Transaction mode or Session mode).
    *   Format: `postgres://user:password@host:port/database`
3.  Save this as `DATABASE_URL`.

## Step 2: Set up Redis

1.  Create a new Redis database on **Upstash**.
2.  Get the connection string.
    *   Format: `redis://default:password@host:port`
3.  Save this as `REDIS_URL`.

## Step 3: Environment Variables

You will need to provide these environment variables to both Vercel and Railway/Render.

| Variable | Description | Required By |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Vercel & Worker |
| `REDIS_URL` | Redis connection string | Vercel & Worker |
| `AUTH_SECRET` | Random string for NextAuth (generate with `openssl rand -base64 32`) | Vercel |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | Vercel |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | Vercel |
| `NEXT_PUBLIC_FORMSPREE_ID`| Your Formspree Form ID | Vercel |
| `ACA_API_TOKEN` | Token for the ACA Extraction API | Worker |
| `NEXT_PUBLIC_APP_URL` | The URL of your deployed app (e.g. `https://zentrifin.vercel.app`) | Vercel |

*Note: The Worker only strictly needs `DATABASE_URL`, `REDIS_URL`, and `ACA_API_TOKEN`, but keeping them consistent is fine.*

---

## Step 4: Deploy Next.js App (Vercel)

1.  Push your code to a GitHub repository.
2.  Go to **Vercel** and "Add New Project".
3.  Import your GitHub repository.
4.  In the **Environment Variables** section, add all the variables listed above (except `ACA_API_TOKEN` which is only needed for the worker, but adding it doesn't hurt).
5.  Click **Deploy**.
6.  Once deployed, copy the domain (e.g., `https://zentrifin.vercel.app`) and update your Google Cloud Console "Authorized redirect URIs" to include `https://zentrifin.vercel.app/api/auth/callback/google`.

## Step 5: Deploy Worker (Railway)

The worker processes the files in the background. It needs to run continuously.

1.  Go to **Railway** (railway.app) and "New Project" > "Deploy from GitHub repo".
2.  Select the same repository.
3.  Go to **Settings** > **Build Command** and set it to:
    ```bash
    npm install && npx prisma generate
    ```
4.  Go to **Settings** > **Start Command** and set it to:
    ```bash
    npm run worker
    ```
5.  Go to **Variables** and add:
    *   `DATABASE_URL`
    *   `REDIS_URL`
    *   `ACA_API_TOKEN`
6.  Deploy.

**Alternative: Render**
1.  Create a "Web Service" or "Background Worker".
2.  Build Command: `npm install && npx prisma generate`
3.  Start Command: `npm run worker`
4.  Add Environment Variables.

---

## Step 6: Final Checks

1.  Open your Vercel app URL.
2.  Log in with Google.
3.  Upload a bank statement PDF.
4.  Check the Railway/Render logs to see if the worker picks up the job (`Processing batch...`).
5.  Verify the extracted data appears in the Vercel app.
