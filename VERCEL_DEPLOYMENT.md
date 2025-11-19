# Vercel Deployment Instructions

## 🚀 Deploy to Vercel

### Prerequisites
- Vercel account (vercel.com)
- GitHub repository with this codebase
- Environment variables configured

### Step 1: Connect Repository
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run in web/ directory)
cd web/
vercel link
```

### Step 2: Configure Environment Variables
In Vercel dashboard or via CLI:

```bash
# Required for production
vercel env add MEDIA_SERVER_URL
vercel env add BEARER_TOKEN
vercel env add XAI_API_KEY

# Optional but recommended
vercel env add QWEN_BEARER_TOKEN
vercel env add GCS_PROJECT_ID
vercel env add GCS_BUCKET
```

### Step 3: Deploy
```bash
# Deploy to production
vercel --prod

# Or deploy from dashboard
# Go to vercel.com → Import Project → Select your repo
```

### Step 4: Configure Domain (Optional)
```bash
# Add custom domain
vercel domains add yourdomain.com
```

## 🔧 Vercel Configuration

### Build Settings
- **Framework**: Next.js
- **Root Directory**: `web/` (for monorepo)
- **Build Command**: `pnpm build` (prebuild script handles dependencies)
- **Install Command**: `pnpm install`

### Environment Variables
```
MEDIA_SERVER_URL=https://your-media-server-url.com
BEARER_TOKEN=your_bearer_token_here
XAI_API_KEY=xai-your_token_here
QWEN_BEARER_TOKEN=your_qwen_token_here
NODE_ENV=production
```

### Function Configuration
- **API Routes**: Max duration 300 seconds
- **Memory**: Default (1024 MB)
- **Region**: Washington, D.C. (iad1)

## 🎯 Post-Deployment

### Test the Application
1. Visit your Vercel domain
2. Go to `/youtube` page
3. Test video creation with different aspect ratios
4. Verify API endpoints work (`/api/health`)

### Monitor Performance
- Check Vercel analytics
- Monitor API response times
- Watch for function timeouts (video generation can take time)

### Scaling Considerations
- Video generation is compute-intensive
- Consider upgrading to Pro plan for higher limits
- Monitor usage costs for AI API calls

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and redeploy
vercel --force
```

### Environment Variables
```bash
# Check env vars
vercel env ls
```

### Logs
```bash
# View deployment logs
vercel logs
```

## ✅ Production Checklist

- [x] **Build Success**: All packages compile
- [x] **Dependencies**: Workspace packages built correctly
- [x] **Environment**: Variables configured
- [x] **API Routes**: Function timeouts set
- [x] **Security**: Headers configured
- [x] **Performance**: Optimized for production

**Ready for deployment!** 🎉