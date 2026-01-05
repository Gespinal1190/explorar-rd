# Vercel Deployment Checklist

If you are seeing "Server Error" or "Configuration" errors, please verify the following:

## 1. Environment Variables in Vercel
Go to **Settings > Environment Variables** in your Vercel Project and ensure these are set:

- `DATABASE_URL`: Your PostgreSQL connection string (neondb, etc).
- `AUTH_SECRET`: A random string (generate one with `openssl rand -base64 32`).
- `AUTH_GOOGLE_ID`: Your Google Cloud Client ID.
- `AUTH_GOOGLE_SECRET`: Your Google Cloud Client Secret.

## 2. Database Schema
We have updated the build command to automatically push the schema, but you can confirm it by checking the Build Logs in Vercel. Look for:
`prisma db push`

If the database is not in sync, NextAuth cannot save the Google session and will crash.

## 3. Logs
Go to the **Logs** tab in your Vercel Dashboard.
Filter by "Error".
If you see:
- `PrismaClientInitializationError`: Your `DATABASE_URL` is wrong.
- `OAuthAccountNotLinked`: The email exists but linked to a different provider (or password).
- `500 Internal Server Error` (immediate): Usually missing `AUTH_SECRET` or DB connection fail.

## 4. Diagnostics
We added a route at `/api/test-db`.
Visit `https://your-domain.vercel.app/api/test-db`
It will tell you if the database connection is working and if Env Vars are detected.
