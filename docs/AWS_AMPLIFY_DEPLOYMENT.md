# AWS Amplify Deployment Guide

This guide covers deploying the Packing List app to AWS Amplify with Supabase integration.

## Prerequisites

- AWS account with Amplify access
- Supabase project with API credentials
- GitHub repository connected to AWS Amplify

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 2: Configure Environment Variables in AWS Amplify

### Via AWS Amplify Console (Recommended)

1. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app
3. In the left sidebar, go to **App settings** → **Environment variables**
4. Click **Manage variables**
5. Add the following variables:

   | Variable | Value | Example |
   |----------|-------|---------|
   | `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxxxxxxxxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

6. Click **Save**

### Via AWS CLI

```bash
aws amplify update-app \
  --app-id <YOUR_APP_ID> \
  --environment-variables \
    VITE_SUPABASE_URL=https://your-project.supabase.co \
    VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Verify Build Settings

Ensure your `amplify.yml` (if present) has the correct build commands:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Step 4: Trigger a New Deployment

Environment variables are only applied during build time. You must trigger a new deployment:

### Option A: Via Console
1. Go to your app in AWS Amplify Console
2. Click **Redeploy this version** on the latest build

### Option B: Via Git Push
```bash
git commit --allow-empty -m "Trigger Amplify rebuild with env vars"
git push
```

### Option C: Via AWS CLI
```bash
aws amplify start-job --app-id <YOUR_APP_ID> --branch-name main --job-type RELEASE
```

## Step 5: Verify Deployment

After deployment completes:

1. Open your app URL
2. Open browser DevTools (F12) → Console tab
3. Check for any Supabase-related errors
4. If successful, you should see no errors and be able to authenticate

## Troubleshooting

### Error: "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL"

**Cause:** Environment variables are not set or not being loaded during build.

**Solutions:**

1. **Verify variables are set:**
   - Go to Amplify Console → App settings → Environment variables
   - Ensure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are listed
   - Values should not have quotes or extra whitespace

2. **Check variable names:**
   - Must start with `VITE_` prefix (required by Vite)
   - Must be exact: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. **Redeploy after setting variables:**
   - Environment variables only apply to new builds
   - Click "Redeploy this version" or push a new commit

4. **Check build logs:**
   - Look for environment variable substitution in build phase
   - Vite should show which env vars are being used

### Error: "Missing Supabase environment variables"

This error includes helpful diagnostics showing which variables are missing. Check the console error for details.

### Variables Not Taking Effect

- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Verify you deployed after setting variables
- Check that variable names match exactly (case-sensitive)
- Ensure values don't have leading/trailing spaces

## Local Development Setup

For local development, create a `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
```

Add to `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Never commit `.env` to git. It's already in `.gitignore`.

## Security Notes

- The `VITE_` prefix makes variables available in client-side code
- The anon key is safe to expose (it's public)
- Never expose your Supabase service role key in environment variables
- Use Supabase Row Level Security (RLS) policies to protect your data

## Additional Resources

- [AWS Amplify Environment Variables Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [Vite Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase JavaScript Client Documentation](https://supabase.com/docs/reference/javascript/introduction)
