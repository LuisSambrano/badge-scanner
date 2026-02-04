# 🚀 How to Deploy Badge Scanner

This app is built with **Next.js** and **NextAuth.js**. The easiest way to deploy it is **Vercel**.

## Prerequisites

1.  A GitHub Account.
2.  A [Vercel Account](https://vercel.com).
3.  This repository forked or pushed to your GitHub.

## Step 1: Create a GitHub OAuth App (Production)

1.  Go to [GitHub Developer Settings](https://github.com/settings/developers).
2.  Click **"New OAuth App"**.
3.  **Application Name:** `Badge Scanner Prod` (or similar).
4.  **Homepage URL:** `https://badge-scanner-YOURNAME.vercel.app` (You will update this later).
5.  **Authorization callback URL:** `https://badge-scanner-YOURNAME.vercel.app/api/auth/callback/github`
    - _Tip: If you don't know your Vercel URL yet, put `https://temp.com` and update it after Step 2._
6.  Click **Register Application**.
7.  Copy the **Client ID**.
8.  Generate a **Client Secret** and copy it.

## Step 2: Deploy on Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the `badge-scanner` repository.
4.  In **Environment Variables**, add:
    - `AUTH_GITHUB_ID`: (Your Client ID from Step 1)
    - `AUTH_GITHUB_SECRET`: (Your Client Secret from Step 1)
    - `NEXTAUTH_SECRET`: (Generate a random string, e.g. `openssl rand -base64 32`)
    - `NEXTAUTH_URL`: `https://YOUR-VERCEL-URL.vercel.app` (Or leave empty, Vercel sometimes auto-detects, but safer to set).
5.  Click **Deploy**.

## Step 3: Finalize

1.  Once deployed, Vercel will give you the final domain (e.g. `badge-scanner-luis.vercel.app`).
2.  Go back to your **GitHub OAuth App settings**.
3.  Update **Homepage URL** and **Authorization callback URL** with the real Vercel domain.
    - Example Callback: `https://badge-scanner-luis.vercel.app/api/auth/callback/github`
4.  Save.

**Enjoy your production app!** 🛡️
