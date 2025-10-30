# GitHub Actions Workflows Guide

This repository includes automated CI/CD workflows for testing, building, and deploying your application.

## 📋 Available Workflows

### 1. **CI - Test and Build** (`.github/workflows/ci.yml`)
**Triggers**: Automatically on every push and pull request to main/master

**What it does**:
- ✅ Runs all tests
- ✅ Builds production bundle
- ✅ Runs security audit
- ✅ Uploads test results and build artifacts
- ✅ Reports bundle size

**Status**: Runs automatically, no configuration needed

---

### 2. **Deploy to GitHub Pages** (`.github/workflows/deploy.yml`)
**Triggers**:
- Automatically on push to main/master
- Manually via GitHub UI (Actions tab)

**What it does**:
- ✅ Runs tests
- ✅ Builds production bundle
- ✅ Deploys to GitHub Pages

**Setup Required**:
1. Go to repo Settings → Pages
2. Source: Select "GitHub Actions"
3. The workflow will automatically deploy on next push to main

**Manual Deployment**:
1. Go to Actions tab
2. Select "Deploy to Production"
3. Click "Run workflow"
4. Choose environment (production/staging)
5. Click "Run workflow"

---

### 3. **Deploy to Vercel** (`.github/workflows/deploy-vercel.yml`)
**Triggers**: Manual only (via GitHub UI)

**Setup Required**:
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel link` in your project directory
4. Get your tokens:
   - `VERCEL_TOKEN`: https://vercel.com/account/tokens
   - `VERCEL_ORG_ID`: From `.vercel/project.json`
   - `VERCEL_PROJECT_ID`: From `.vercel/project.json`
5. Add secrets in GitHub:
   - Go to Settings → Secrets → Actions
   - Add: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

**To Deploy**:
1. Go to Actions tab
2. Select "Deploy to Vercel"
3. Click "Run workflow"
4. Choose production or preview
5. Click "Run workflow"

---

### 4. **Deploy to Netlify** (`.github/workflows/deploy-netlify.yml`)
**Triggers**: Manual only (via GitHub UI)

**Setup Required**:
1. Create account at [netlify.com](https://netlify.com)
2. Create a new site
3. Get your tokens:
   - `NETLIFY_AUTH_TOKEN`: https://app.netlify.com/user/applications#personal-access-tokens
   - `NETLIFY_SITE_ID`: Site settings → General → Site details → API ID
4. Add secrets in GitHub:
   - Go to Settings → Secrets → Actions
   - Add: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

**To Deploy**:
1. Go to Actions tab
2. Select "Deploy to Netlify"
3. Click "Run workflow"
4. Choose production or preview
5. Click "Run workflow"

---

## 🚀 Quick Start

### Option 1: GitHub Pages (Easiest)
```bash
# 1. Enable GitHub Pages in repo settings
# 2. Push to main branch
git push origin main

# Done! Your site will be available at:
# https://<username>.github.io/<repo-name>/
```

### Option 2: Vercel (Recommended for Production)
```bash
# 1. Setup (one time)
vercel link
# Follow prompts, then add secrets to GitHub

# 2. Deploy via GitHub Actions
# Go to Actions → Deploy to Vercel → Run workflow

# Or deploy directly:
vercel --prod
```

### Option 3: Netlify
```bash
# 1. Setup (one time)
# Get auth token and site ID from Netlify dashboard
# Add secrets to GitHub

# 2. Deploy via GitHub Actions
# Go to Actions → Deploy to Netlify → Run workflow

# Or deploy directly:
netlify deploy --prod
```

### Option 4: Docker (Self-hosted)
```bash
# Build and run with Docker Compose
docker-compose up -d

# Your app will be available at http://localhost:8080

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🔧 Workflow Configuration

### Customizing CI Workflow

Edit `.github/workflows/ci.yml` to:
- Change Node.js version
- Add additional test steps
- Modify security audit levels
- Add code coverage reporting

### Customizing Deployment Workflows

Edit deployment workflows to:
- Add environment variables
- Change deployment branches
- Add deployment notifications
- Integrate with Slack/Discord

---

## 📊 Monitoring Deployments

### View Workflow Runs
1. Go to Actions tab
2. Select a workflow
3. View status, logs, and artifacts

### Check Deployment Status
- **GitHub Pages**: Settings → Pages
- **Vercel**: https://vercel.com/dashboard
- **Netlify**: https://app.netlify.com

### Download Build Artifacts
1. Go to Actions tab
2. Click on a workflow run
3. Scroll to "Artifacts"
4. Download dist.zip or test-results

---

## 🔐 Security Best Practices

### Secrets Management
- ✅ Never commit secrets to git
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate tokens periodically
- ✅ Use environment-specific secrets

### Branch Protection
Recommended settings for main branch:
- ✅ Require pull request reviews
- ✅ Require status checks (CI) to pass
- ✅ Require branches to be up to date
- ✅ Include administrators

To enable:
1. Settings → Branches
2. Add rule for `main`
3. Enable protections

---

## 🐛 Troubleshooting

### Workflow Not Running
- Check: Workflow file is in `.github/workflows/`
- Check: YAML syntax is valid
- Check: Branch name matches trigger conditions

### Deployment Failing
- Check: All required secrets are set
- Check: Build succeeds locally (`npm run build`)
- Check: Tests pass locally (`npm test`)
- Check: Deployment platform credentials are valid

### Build Artifacts Missing
- Check: Build step completed successfully
- Check: Upload artifact step ran
- Check: Artifact retention period hasn't expired (default 7 days)

---

## 📈 Next Steps

### Enhance CI/CD
- [ ] Add code coverage reporting (Codecov)
- [ ] Add automated dependency updates (Dependabot)
- [ ] Add performance testing (Lighthouse CI)
- [ ] Add E2E tests (Playwright)
- [ ] Add deployment previews for PRs

### Monitoring & Analytics
- [ ] Add error tracking (Sentry)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Add uptime monitoring (UptimeRobot)
- [ ] Add performance monitoring (Web Vitals)

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Docker Documentation](https://docs.docker.com)

---

**Last Updated**: 2025-10-30
**Maintained by**: Claude Code
