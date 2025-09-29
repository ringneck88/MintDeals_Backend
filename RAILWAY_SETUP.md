# Railway Environment Variables Setup

## Required Environment Variables

Copy and paste these EXACTLY as shown (NO SPACES around = signs) into Railway's Variables section:

### 1. Cloudinary Configuration
```
CLOUDINARY_NAME=Root
CLOUDINARY_KEY=387245489575974
CLOUDINARY_SECRET=FCouQGTn49tH9dttYxhxAZ1zUH8
```

### 2. Strapi Security Keys
```
APP_KEYS=xxVfCNeymEsmHA9HRpixkw==,yxWfCNeymEsmHA9HRpixkw==,zxVfCNeymEsmHA9HRpixkw==,axVfCNeymEsmHA9HRpixkw==
API_TOKEN_SALT=xxVfCNeymEsmHA9HRpixkw==
ADMIN_JWT_SECRET=yxWfCNeymEsmHA9HRpixkw==
TRANSFER_TOKEN_SALT=zxVfCNeymEsmHA9HRpixkw==
JWT_SECRET=uE1PqjgLJlU+UyZh00z2Qg==
```

### 3. Server Configuration
```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
```

### 4. Database
Railway automatically provides `DATABASE_URL`. Do NOT set any other database variables.

## Setup Instructions

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Click "Raw Editor"
5. Paste ALL the variables above
6. Click "Save"
7. Railway will automatically redeploy

## Verification

After deployment, check the logs for:
- "Cloudinary provider configured"
- "All required environment variables are set"

## Common Issues

1. **Spaces in variables**: Make sure there are NO spaces around = signs
2. **Missing variables**: All variables must be set exactly as shown
3. **Case sensitivity**: Variable names are case-sensitive (CLOUDINARY_NAME not cloudinary_name)

## Testing Upload

After deployment, test image upload in Strapi admin:
1. Go to Media Library
2. Upload a test image (JPG, PNG, or GIF)
3. Check if it appears in your Cloudinary dashboard at cloudinary.com

## Troubleshooting Upload Errors

If you get "Internal Server Error" when uploading:

### Step 1: Check Railway Logs for Cloudinary Configuration
Look for these lines when Strapi starts:
```
Cloudinary Configuration:
CLOUDINARY_NAME: Root ✅
CLOUDINARY_KEY: 387245... ✅
CLOUDINARY_SECRET: FCouQG... ✅
✅ Cloudinary appears to be configured correctly
```

If you see "NOT SET ❌" for any variable, the environment variables aren't set properly in Railway.

### Step 2: Verify Environment Variables in Railway
1. Go to Railway project → Your service → Variables tab
2. Click "Raw Editor" to see all variables
3. Verify these EXACT values (case-sensitive, NO spaces):
```
CLOUDINARY_NAME=Root
CLOUDINARY_KEY=387245489575974
CLOUDINARY_SECRET=FCouQGTn49tH9dttYxhxAZ1zUH8
```

### Step 3: Common Issues & Fixes

**Issue: Variables show as "NOT SET" in logs**
- Solution: Copy variables again into Railway Raw Editor, ensure no spaces around `=`
- Click "Deploy" button after saving to trigger a fresh deployment

**Issue: Variables are set but uploads still fail**
- Check Cloudinary dashboard (cloudinary.com) to verify:
  - Cloud name is exactly "Root" (capital R)
  - API credentials are active and not restricted
  - Account is not suspended or over quota

**Issue: Error says "Invalid cloud_name"**
- Your CLOUDINARY_NAME must match your Cloudinary account name exactly
- Login to cloudinary.com and check your cloud name in Settings → Account
- If it's different from "Root", update the Railway variable to match

### Step 4: Test After Fixing
1. Redeploy in Railway after setting variables
2. Wait for deployment to complete
3. Check logs for the ✅ Cloudinary success message
4. Try uploading a small test image (JPG/PNG under 1MB)
5. Check your Cloudinary dashboard to see if the image appears in the "mintdeals" folder

### Step 5: If Still Failing
Check Railway logs during upload attempt for specific errors like:
- "Authentication failed" → Wrong API credentials
- "Resource not found" → Wrong cloud name
- "Upload failed" → Check file size/format restrictions