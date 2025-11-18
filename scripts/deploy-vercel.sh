#!/bin/bash

# Deploy Media Pipeline to Vercel
# Usage: ./scripts/deploy-vercel.sh

set -e

echo "🚀 Deploying Media Pipeline to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the Next.js app
echo "📦 Building Next.js application..."
cd web
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "Remember to set environment variables in Vercel dashboard:"
echo "  - MEDIA_SERVER_URL"
echo "  - GCS_BUCKET"
echo "  - WEAVIATE_URL"
echo "  - ANTHROPIC_API_KEY"
echo "  - and all other variables from .env.example"
