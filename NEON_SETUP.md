# Neon PostgreSQL Setup Guide

## Step 1: Create Neon Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up/Login with your account
3. Click "Create a project"
4. Choose your region and PostgreSQL version
5. Name your database (e.g., "media-pipeline")
6. Click "Create project"

## Step 2: Get Connection String
1. In your Neon dashboard, go to "Connection Details"
2. Copy the connection string that looks like:
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

## Step 3: Set Environment Variable
1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add a new variable:
   - Name: `DATABASE_URL`
   - Value: Your Neon connection string
   - Environment: Production (and Preview/Staging if needed)

## Step 4: Run Database Migration
Once DATABASE_URL is set, run:
```bash
cd web
npx prisma db push
```

This will create all the tables: jobs, job_steps, files, logs.

## Step 5: Verify Setup
Test the database connection:
```bash
npx prisma studio
```

This opens a web interface to view your database.

## Database Schema Overview

- **jobs**: Main job records with status, progress, metadata
- **job_steps**: Individual pipeline steps (transcription, generation, etc.)
- **files**: Media server file references with metadata
- **logs**: Structured logging for debugging and monitoring

## Environment Variables Summary

Add to your `.env.local`:
```
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

The system will automatically use PostgreSQL for persistent storage of all job data, file metadata, and logs.