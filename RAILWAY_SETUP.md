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
2. Upload a test image
3. Check if it appears in your Cloudinary dashboard at cloudinary.com