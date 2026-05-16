# 🚀 Deploying to Vercel (Free) + Neon PostgreSQL (Free)

This guide walks you through deploying both the **backend API** and **frontend React app** on Vercel for free, with a free PostgreSQL database from **Neon**.

---

## 📋 Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (sign up with GitHub)
- A [Neon](https://neon.tech) account (sign up with GitHub)
- Git installed on your machine
- Your project pushed to a GitHub repository

---

## 🗄️ Step 1: Set Up Free PostgreSQL on Neon

### 1.1 Create a Neon Account
Go to [https://neon.tech](https://neon.tech) and sign up with your GitHub account.

### 1.2 Create a New Project
1. Click **"Create a project"**
2. Give it a name (e.g., `service-management-db`)
3. Choose the **Free Tier** (0.5 GB storage, shared compute)
4. Select a region closest to you (e.g., `Asia/Singapore` or `US East`)
5. Click **"Create project"**

### 1.3 Get Your Connection String
1. After the project is created, you'll see a **connection string** panel
2. Copy the connection string. It looks like:
   ```
   postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
3. **Save this connection string** — you'll need it for Vercel environment variables

### 1.4 Run Migrations Locally (First Time)
Before deploying, run your TypeORM migrations against the Neon database:

```bash
# Set the DATABASE_URL environment variable temporarily
set DATABASE_URL=postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/dbname?sslmode=require

# Run migrations
cd Backend
npm run migration:run

# (Optional) Seed the database
npm run seed
```

> **Note for Windows (cmd):** Use `set` as shown above. For PowerShell use `$env:DATABASE_URL="..."`.

---

## 🌐 Step 2: Deploy Backend to Vercel

### 2.1 Push Your Code to GitHub
Make sure your latest code (with all the Vercel config files) is pushed:

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2.2 Create a New Vercel Project for Backend
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Other |
   | **Root Directory** | `Backend` |
   | **Build Command** | `npm install` |
   | **Output Directory** | Leave empty |
   | **Install Command** | `npm install` |

4. Click **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/dbname?sslmode=require` |
   | `DB_HOST` | `ep-xxxx.us-east-2.aws.neon.tech` |
   | `DB_PORT` | `5432` |
   | `DB_USERNAME` | (from your Neon connection string) |
   | `DB_PASSWORD` | (from your Neon connection string) |
   | `DB_NAME` | (from your Neon connection string) |
   | `JWT_SECRET` | Generate a strong random string (e.g., use `openssl rand -hex 32`) |
   | `JWT_REFRESH_SECRET` | Generate another strong random string |
   | `FRONTEND_URL` | Leave empty for now — fill after frontend is deployed |
   | `NODE_ENV` | `production` |

5. Click **"Deploy"**

### 2.3 Note Your Backend URL
After deployment, Vercel gives you a URL like:
```
https://your-backend.vercel.app
```
Save this — you'll need it for the frontend.

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create a New Vercel Project for Frontend
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import the **same** GitHub repository
3. Configure the project:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Vite |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

4. Click **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend.vercel.app/api/v1` |

   > Replace `your-backend.vercel.app` with your actual backend URL from Step 2.3.

5. Click **"Deploy"**

### 3.2 Update Backend CORS
After the frontend is deployed, go back to your **backend project** on Vercel:
1. Go to **Settings → Environment Variables**
2. Update `FRONTEND_URL` to your frontend URL (e.g., `https://your-frontend.vercel.app`)
3. Click **"Save"** and then **redeploy** the backend

---

## 📁 Project Structure After Setup

```
your-repo/
├── vercel.json              # Root config (optional, for monorepo)
├── Backend/
│   ├── vercel.json          # Backend Vercel config
│   ├── package.json         # Has "build" script
│   ├── .gitignore           # Excludes .env
│   └── src/
│       └── index.js         # Serverless-compatible
├── frontend/
│   ├── vercel.json          # SPA rewrite rules
│   ├── vite.config.js       # Vite config
│   └── src/
│       └── services/
│           └── api.js       # Uses VITE_API_URL env var
└── DEPLOYMENT.md            # This guide
```

---

## 🔧 Troubleshooting

### Database Connection Issues
- Make sure `sslmode=require` is in your Neon connection string
- Verify the database credentials in Vercel environment variables
- Check that migrations ran successfully against the Neon database

### CORS Errors
- Ensure `FRONTEND_URL` in backend env vars matches your actual frontend URL
- Redeploy the backend after updating CORS settings

### 404 on Page Refresh (Frontend)
- The `frontend/vercel.json` with SPA rewrites handles this
- If issues persist, verify the file is deployed correctly

### API Returning 500
- Check Vercel function logs: **Project → Deployments → Click latest → Functions tab**
- Common issues: missing env vars, database connection, unhandled promises

---

## 💰 Free Tier Limits

| Service | Free Limit |
|---------|-----------|
| **Vercel** | 100 GB bandwidth, 6000 build minutes/month |
| **Neon** | 0.5 GB storage, 1 shared compute, 100 hours compute/month |

Both are generous enough for a small-to-medium production application.

---

## 🔐 Security Notes

- Never commit `.env` files (added to `.gitignore`)
- Use strong, random `JWT_SECRET` values
- Neon connection strings contain credentials — keep them secure
- Consider enabling Vercel's **"Protection Bypass"** for preview deployments

---

## 📝 Quick Commands Reference

```bash
# Run migrations against Neon (from Backend folder)
set DATABASE_URL=your_neon_connection_string && npm run migration:run

# Seed database
set DATABASE_URL=your_neon_connection_string && npm run seed

# Test backend locally with Neon
set DATABASE_URL=your_neon_connection_string && npm run dev

# Build frontend locally
cd frontend && npm run build