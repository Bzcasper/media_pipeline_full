#!/bin/bash

# Deploy Agent Service to Google Cloud Run
# Usage: ./scripts/deploy-cloudrun.sh

set -e

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-"your-project-id"}
REGION=${GCP_REGION:-"us-central1"}
SERVICE_NAME="media-pipeline-agent"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Deploying Media Pipeline Agent to Cloud Run..."

# Build the agent
echo "📦 Building agent..."
cd agent
npm run build

# Create Dockerfile if it doesn't exist
if [ ! -f Dockerfile ]; then
    echo "📝 Creating Dockerfile..."
    cat > Dockerfile <<EOF
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist ./dist
COPY jobs ./jobs

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]
EOF
fi

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t ${IMAGE_NAME} .

# Push to Google Container Registry
echo "📤 Pushing to GCR..."
docker push ${IMAGE_NAME}

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 3600 \
  --set-env-vars MEDIA_SERVER_URL=${MEDIA_SERVER_URL} \
  --set-env-vars GCS_BUCKET=${GCS_BUCKET} \
  --set-env-vars WEAVIATE_URL=${WEAVIATE_URL}

echo "✅ Deployment complete!"
echo "🌐 Service URL:"
gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format 'value(status.url)'
