# 🚀 Quick Deploy Guide

**Get your app online in under 5 minutes!**

---

## Choose Your Deployment Method

### 1️⃣ **GitHub Pages** - EASIEST (2 minutes)

```bash
# Just push to main branch - that's it!
git push origin main

# Your site will be live at:
# https://YOUR-USERNAME.github.io/react-extractor/
```

**Setup**: Already configured! The workflow runs automatically.

**Status**: Check Actions tab to see deployment progress.

---

### 2️⃣ **Vercel** - RECOMMENDED (5 minutes)

#### Option A: Via Dashboard (No CLI needed)
1. Visit https://vercel.com
2. Click "Import Project"
3. Select this GitHub repository
4. Click "Deploy"
5. ✅ Done! Your site is live

#### Option B: Via GitHub Actions
1. Get Vercel token: https://vercel.com/account/tokens
2. Run locally: `vercel link` (creates .vercel/project.json)
3. Add secrets to GitHub (Settings → Secrets):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID` (from .vercel/project.json)
   - `VERCEL_PROJECT_ID` (from .vercel/project.json)
4. Go to Actions → "Deploy to Vercel" → Run workflow
5. ✅ Done!

---

### 3️⃣ **Netlify** - GREAT ALTERNATIVE (5 minutes)

#### Option A: Via Dashboard
1. Visit https://netlify.com
2. Click "Add new site" → Import from Git
3. Select this repository
4. Build settings auto-detected
5. Click "Deploy"
6. ✅ Done!

#### Option B: Via GitHub Actions
1. Get Netlify token: https://app.netlify.com/user/applications
2. Create site and get Site ID from settings
3. Add secrets to GitHub:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
4. Go to Actions → "Deploy to Netlify" → Run workflow
5. ✅ Done!

---

### 4️⃣ **Docker** - SELF-HOSTED (10 minutes)

```bash
# Clone on your server
git clone https://github.com/YOUR-USERNAME/react-extractor.git
cd react-extractor

# Deploy with one command
docker-compose up -d

# Check status
docker-compose ps

# Your app is at: http://YOUR-SERVER:8080
```

**Requires**: Docker installed on your server

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [x] ✅ Tests passing: `npm test`
- [x] ✅ Build working: `npm run build`
- [x] ✅ No security issues: `npm audit`
- [ ] 📄 Add your data: Copy `data.json` and PDFs to `public/`
- [ ] 🔧 (Optional) Configure custom domain

---

## 🔄 Automated Deployments

All platforms support automatic deployments:

**GitHub Pages**: ✅ Auto-deploys on push to main
**Vercel**: ✅ Auto-deploys on push (if connected)
**Netlify**: ✅ Auto-deploys on push (if connected)

**GitHub Actions**: Configured for all platforms!

---

## 📊 Deployment Status

Check deployment status:

- **GitHub Actions**: Actions tab → Latest workflow run
- **Vercel**: https://vercel.com/dashboard
- **Netlify**: https://app.netlify.com
- **Docker**: `docker-compose logs -f`

---

## 🎯 Recommended for Different Use Cases

| Use Case | Platform | Why |
|----------|----------|-----|
| **Demo/Portfolio** | GitHub Pages | Free, simple, automatic |
| **Production App** | Vercel | Fast, reliable, edge network |
| **Team Project** | Netlify | Collaboration features |
| **Corporate/Private** | Docker | Full control, private hosting |

---

## 📚 Detailed Guides

- **Complete deployment guide**: See `DEPLOYMENT.md`
- **CI/CD workflows**: See `.github/WORKFLOWS.md`
- **Platform comparison**: See `.github/DEPLOYMENT_PLATFORMS.md`

---

## 🆘 Quick Troubleshooting

**Build failing?**
```bash
npm install
npm run build
# If successful locally, check workflow logs
```

**Tests failing?**
```bash
npm test
# Fix any failing tests before deploying
```

**Deployment not triggering?**
- Check: Workflow file exists in `.github/workflows/`
- Check: Branch name matches (main vs master)
- Check: Secrets are configured correctly

---

## ✅ You're Ready!

Pick a deployment method above and get your app online in minutes!

**Questions?** Check the detailed guides or open an issue.

---

**Last Updated**: 2025-10-30
