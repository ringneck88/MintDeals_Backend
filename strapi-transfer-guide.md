# Strapi Transfer Guide

This guide explains how to export your current Strapi instance and import it into another Strapi instance.

## What Gets Exported

### 1. Content Type Schemas (17 content types)
- `announcement` - Announcements
- `brand` - Brand information
- `cannaboid-type` - Cannaboid types
- `city` - City data
- `compliance-policy` - Compliance policies
- `deal` - Deals and offers
- `dosage-form` - Dosage forms
- `dosage-product` - Dosage products
- `event` - Events
- `global` - Global settings
- `ingredient` - Ingredients
- `legal` - Legal information
- `page` - Pages
- `promotion` - Promotions
- `region` - Regions
- `store` - Store information
- `unit-type` - Unit types

### 2. Configuration Files
- `database.ts` - Database configuration
- `server.ts` - Server configuration
- `admin.ts` - Admin panel configuration
- `middlewares.ts` - Middleware configuration
- `plugins.ts` - Plugin configuration

### 3. API Files
- Controllers, routes, services, and policies for each content type

## Export Process

### Step 1: Run Export Script
```bash
cd backend
node export-strapi-data.js
```

This creates a `strapi-export/` directory with all your Strapi configuration and schemas.

### Step 2: Create Data Transfer File (Optional)
For actual data migration, use Strapi's built-in transfer functionality:

```bash
# Export data to a transfer file
npx strapi transfer --to file://./strapi-data-export.tar.gz

# Or export to a remote Strapi instance directly
npx strapi transfer --to strapi://admin:password@target-strapi-url
```

## Import Process

### Step 1: Set Up Target Strapi Instance
1. Create a new Strapi project:
   ```bash
   npx create-strapi-app@latest target-strapi --quickstart
   cd target-strapi
   ```

2. Copy the export files:
   ```bash
   # Copy the entire export directory to your target instance
   cp -r /path/to/source/backend/strapi-export ./
   cp /path/to/source/backend/import-strapi-data.js ./
   ```

### Step 2: Run Import Script
```bash
node import-strapi-data.js
```

This will:
- Import all content type schemas
- Import API files (controllers, routes, services)
- Import configuration files (with backup of existing files)

### Step 3: Build and Start
```bash
npm run build
npm run develop
```

### Step 4: Import Data (if using transfer file)
```bash
# Import from transfer file
npx strapi transfer --from file://./strapi-data-export.tar.gz

# Or import from remote source
npx strapi transfer --from strapi://admin:password@source-strapi-url
```

## Alternative: Direct Database Transfer

If both instances use the same database type (SQLite), you can also:

1. **Copy the database file directly:**
   ```bash
   cp source/backend/.tmp/data.db target/backend/.tmp/data.db
   ```

2. **Or use Strapi's transfer between live instances:**
   ```bash
   # From source instance
   npx strapi transfer --to strapi://admin:password@target-url
   ```

## Important Notes

### Configuration Files
- Review imported configuration files for environment-specific settings
- Update database connections, secrets, and API keys
- Check plugin configurations for compatibility

### Environment Variables
Make sure your target instance has the required environment variables:
```bash
# Required Strapi secrets
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
ENCRYPTION_KEY=

# Database configuration
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Server configuration
HOST=0.0.0.0
PORT=1337
```

### Version Compatibility
- Ensure target Strapi version matches or is compatible with source version
- Your source is using Strapi v5.23.1
- Check plugin compatibility if using custom plugins

## Troubleshooting

### Content Types Not Appearing
1. Check that all schema files are in the correct directory structure
2. Run `npm run build` to regenerate types
3. Restart the development server

### Database Issues
1. Make sure database credentials are correct in target instance
2. Check file permissions on SQLite database
3. Verify database directory exists and is writable

### Permission Errors
1. Ensure proper file permissions on copied files
2. Run with appropriate user permissions
3. Check directory ownership

## Verification

After import, verify:
1. All content types appear in admin panel
2. API endpoints are accessible
3. Relationships between content types work correctly
4. Admin panel functionality is intact

## Data Migration Best Practices

1. **Test First**: Always test the migration process with a copy of your data
2. **Backup**: Keep backups of both source and target instances
3. **Incremental**: For large datasets, consider incremental transfers
4. **Validation**: Verify data integrity after migration
5. **Environment**: Keep production and development transfers separate