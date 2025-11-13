# Push to GitHub Guide

Your code is ready to push! Follow these steps:

## Option 1: Using GitHub Website (Easiest)

### Step 1: Create Repository on GitHub

1. Go to [https://github.com/new](https://github.com/new)
2. Fill in the repository details:
   - **Repository name**: `luxury-slot-app` (or your preferred name)
   - **Description**: "Luxury slot machine lottery app with Supabase backend"
   - **Visibility**: Choose Public or Private
   - **⚠️ IMPORTANT**: Do NOT initialize with README, .gitignore, or license (we already have these)
3. Click **"Create repository"**

### Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Copy your repository URL, then run:

```bash
cd luxury-slot-app
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/luxury-slot-app.git
git push -u origin main
```

You'll be asked for your GitHub credentials. Use a **Personal Access Token** instead of your password.

### Step 3: Generate Personal Access Token (if needed)

If you don't have a token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name like "Zeabur Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

---

## Option 2: Using GitHub CLI (If you have it)

If you have GitHub CLI installed:

```bash
cd luxury-slot-app
gh repo create luxury-slot-app --public --source=. --remote=origin --push
```

---

## What's Already Done ✅

- ✅ Git repository initialized
- ✅ All files committed with message: "Initial commit: Luxury slot app with Supabase integration"
- ✅ Default branch set to `main`
- ✅ `.env.local` is in `.gitignore` (your Supabase credentials won't be pushed)

## Files That Are Committed

28 files including:
- All source code (`src/`)
- Documentation (README.md, SUPABASE_SETUP.md, ZEABUR_DEPLOYMENT.md)
- Configuration files (package.json, tsconfig.json, etc.)
- **NOT included**: node_modules, .env.local, .next build files (all in .gitignore)

## After Pushing to GitHub

### Next Steps:

1. **Verify on GitHub**: Go to your repository URL and check all files are there
2. **Deploy to Zeabur**:
   - Go to [https://zeabur.com](https://zeabur.com)
   - Create new project
   - Select "Git" → Connect GitHub → Select your repository
   - Add environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Deploy!

### Important: Environment Variables for Zeabur

When deploying to Zeabur, remember to add these environment variables in the Zeabur dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Do NOT** commit `.env.local` to GitHub - it's already ignored for security.

---

## Troubleshooting

### "Permission denied (publickey)"

Use HTTPS instead of SSH:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "Authentication failed"

Make sure you're using a Personal Access Token as your password, not your GitHub password.

### "Updates were rejected"

This means the remote has changes you don't have locally. If you just created the repo and it's empty, you can force push:
```bash
git push -u origin main --force
```

⚠️ Only use `--force` if you're sure the remote is empty or you want to overwrite it!

---

## Alternative: GitLab

If you prefer GitLab:

1. Go to [https://gitlab.com/projects/new](https://gitlab.com/projects/new)
2. Create a new project
3. Run:
```bash
cd luxury-slot-app
git remote add origin https://gitlab.com/YOUR_USERNAME/YOUR_PROJECT_NAME.git
git push -u origin main
```

---

## Summary

```bash
# 1. Create repo on GitHub (use the website)
# 2. Then run these commands:

cd luxury-slot-app
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# Enter your username and Personal Access Token when prompted
```

That's it! Your code will be on GitHub and ready to deploy to Zeabur! 🚀
