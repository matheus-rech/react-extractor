# Deployment Platform Comparison

Choose the best deployment platform for your needs.

## 🏆 Recommended Platform: **Vercel**

Best for production deployments with automatic scaling and global CDN.

---

## Platform Comparison

| Feature | GitHub Pages | Vercel | Netlify | Docker (Self-hosted) |
|---------|-------------|--------|---------|---------------------|
| **Free Tier** | ✅ Unlimited | ✅ Generous | ✅ Generous | N/A (your infrastructure) |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **HTTPS** | ✅ Auto | ✅ Auto | ✅ Auto | ⚠️ Manual (Let's Encrypt) |
| **Deploy Time** | ~2 min | ~30 sec | ~1 min | ~5 min |
| **Global CDN** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| **Analytics** | ❌ No | ✅ Yes | ✅ Yes | ⚠️ Manual setup |
| **Build Minutes** | Unlimited | 6000/month | 300/month | Unlimited |
| **Bandwidth** | 100GB/month | 100GB/month | 100GB/month | Depends on host |
| **Preview Deploys** | ❌ No | ✅ Yes | ✅ Yes | ⚠️ Manual |
| **Rollbacks** | ⚠️ Manual | ✅ Instant | ✅ Instant | ⚠️ Manual |
| **Setup Complexity** | ⭐ Easy | ⭐⭐ Moderate | ⭐⭐ Moderate | ⭐⭐⭐ Complex |
| **Best For** | Simple sites | Production apps | Jamstack sites | Full control |

---

## Detailed Platform Guides

### 1. GitHub Pages 🎯 **EASIEST**

**Pros**:
- ✅ Zero configuration needed
- ✅ Free unlimited hosting
- ✅ Automatic deployments from GitHub
- ✅ Perfect for demos and documentation

**Cons**:
- ❌ No server-side logic
- ❌ Limited analytics
- ❌ No preview deployments

**Setup Time**: 2 minutes

**Steps**:
```bash
# 1. Enable in repo settings
Settings → Pages → Source: GitHub Actions

# 2. Push to main
git push origin main

# 3. Done! Site available at:
https://YOUR-USERNAME.github.io/react-extractor/
```

**Cost**: **FREE** forever

---

### 2. Vercel ⚡ **RECOMMENDED**

**Pros**:
- ✅ Fastest deployment (30 seconds)
- ✅ Excellent performance (global edge network)
- ✅ Automatic preview deployments for PRs
- ✅ Built-in analytics
- ✅ Serverless functions support
- ✅ Instant rollbacks

**Cons**:
- ⚠️ Requires Vercel account
- ⚠️ Build minutes limited on free tier

**Setup Time**: 5 minutes

**Steps**:
```bash
# Option A: Vercel Dashboard (Easiest)
1. Visit https://vercel.com
2. Click "Import Project"
3. Connect GitHub repo
4. Click "Deploy"
5. Done!

# Option B: CLI
npm i -g vercel
vercel login
vercel

# Option C: GitHub Actions (Automated)
# See .github/workflows/deploy-vercel.yml
```

**Cost**:
- **FREE**: Hobby (perfect for this app)
- **$20/mo**: Pro (team features, more builds)

**Deployment URL**: `https://your-project.vercel.app`

---

### 3. Netlify 🎨 **GREAT FOR TEAMS**

**Pros**:
- ✅ Excellent developer experience
- ✅ Form handling (if you add forms later)
- ✅ Split testing / A/B testing
- ✅ Deploy previews
- ✅ Serverless functions
- ✅ Edge handlers

**Cons**:
- ⚠️ Fewer build minutes on free tier (300/month)
- ⚠️ Slightly slower than Vercel

**Setup Time**: 5 minutes

**Steps**:
```bash
# Option A: Netlify Dashboard (Easiest)
1. Visit https://netlify.com
2. Click "Add new site"
3. Import from GitHub
4. Build settings auto-detected
5. Click "Deploy"
6. Done!

# Option B: CLI
npm i -g netlify-cli
netlify login
netlify deploy --prod

# Option C: GitHub Actions (Automated)
# See .github/workflows/deploy-netlify.yml
```

**Cost**:
- **FREE**: Starter (perfect for this app)
- **$19/mo**: Pro (more builds, team features)

**Deployment URL**: `https://your-site.netlify.app`

---

### 4. Docker (Self-hosted) 🐳 **FULL CONTROL**

**Pros**:
- ✅ Complete control over infrastructure
- ✅ Run anywhere (AWS, DigitalOcean, VPS)
- ✅ No platform restrictions
- ✅ Unlimited builds and bandwidth (depends on host)
- ✅ Can add custom backend services

**Cons**:
- ❌ Requires server management
- ❌ Manual SSL setup
- ❌ No automatic CDN
- ❌ Higher complexity

**Setup Time**: 30 minutes

**Steps**:
```bash
# 1. Install Docker on your server
curl -fsSL https://get.docker.com | sh

# 2. Clone your repo
git clone https://github.com/YOUR-USERNAME/react-extractor.git
cd react-extractor

# 3. Deploy with docker-compose
docker-compose up -d

# 4. Setup nginx reverse proxy (optional)
# 5. Setup SSL with Let's Encrypt (optional)

# Your app runs at http://YOUR-SERVER-IP:8080
```

**Cost**:
- Depends on hosting provider
- **DigitalOcean**: $5/month (basic droplet)
- **AWS**: $3-10/month (t2.micro/t3.micro)
- **Hetzner**: €4/month (CX11)

---

## Decision Tree

### Choose based on your needs:

**Just want it online quickly?**
→ **GitHub Pages** (2 min setup)

**Building a production app?**
→ **Vercel** (best performance, easy setup)

**Need team features & testing?**
→ **Netlify** (great collaboration tools)

**Need full control or custom backend?**
→ **Docker** (self-hosted)

**Limited budget, high traffic expected?**
→ **Vercel** or **Netlify** (both have generous free tiers)

---

## Migration Guide

### From GitHub Pages to Vercel
```bash
# 1. Import in Vercel dashboard
# 2. Vercel auto-detects settings
# 3. Deploy
# 4. Update DNS (if using custom domain)
```

### From Vercel to Docker
```bash
# 1. Build Docker image
docker build -t pdf-viewer .

# 2. Push to registry (optional)
docker push your-registry/pdf-viewer

# 3. Deploy on server
docker run -p 80:80 pdf-viewer
```

---

## Custom Domain Setup

### All Platforms Support Custom Domains

**GitHub Pages**:
```bash
# 1. Add CNAME file to repo
echo "your-domain.com" > public/CNAME

# 2. Add DNS records (at your domain registrar)
# A record: 185.199.108.153
# A record: 185.199.109.153
# A record: 185.199.110.153
# A record: 185.199.111.153
```

**Vercel**:
```bash
# 1. Project Settings → Domains
# 2. Add your domain
# 3. Follow DNS instructions
# (Usually: CNAME to cname.vercel-dns.com)
```

**Netlify**:
```bash
# 1. Site Settings → Domain Management
# 2. Add custom domain
# 3. Follow DNS instructions
# (Usually: CNAME to your-site.netlify.app)
```

---

## Performance Comparison

Based on real-world tests:

| Metric | GitHub Pages | Vercel | Netlify | Docker (CDN) |
|--------|-------------|--------|---------|--------------|
| **Time to First Byte** | ~200ms | ~50ms | ~80ms | ~150ms |
| **Global Latency** | Good | Excellent | Excellent | Depends |
| **Cache Hit Rate** | Good | Excellent | Excellent | Manual |
| **Build Speed** | Medium | Fast | Medium | Slow |

---

## Recommended Stack

### For This Project

**Development**: Local (`npm run dev`)
**Staging**: GitHub Pages (free, automatic)
**Production**: Vercel (best performance)

### Budget-Conscious

**All environments**: Netlify (single platform, easy management)

### Enterprise

**Production**: Self-hosted Docker on AWS/GCP
**Staging**: Vercel preview deployments
**Development**: Local

---

## Next Steps

1. Choose your platform
2. Follow setup guide above
3. Configure GitHub Actions (optional)
4. Add custom domain (optional)
5. Monitor and optimize

---

**Questions?** Check `.github/WORKFLOWS.md` for CI/CD details.
