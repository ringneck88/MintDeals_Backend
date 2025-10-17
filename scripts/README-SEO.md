# SEO Metadata Automation Script

## Overview

This script automatically generates and populates comprehensive SEO metadata for all store locations in the Strapi database. It creates optimized meta titles, descriptions, keywords, structured data, and canonical URLs based on each store's location, services, and attributes.

## Features

The script generates the following SEO elements for each store:

### 1. **Meta Title** (60-70 characters)
- Format: `{Store Name} - {Type} Cannabis Dispensary in {City}, {State}`
- Example: `Mint Cannabis - Recreational & Medical Dispensary in Phoenix, AZ`
- Optimized for search engines and click-through rates

### 2. **Meta Description** (155-160 characters)
- Includes store name, location, product types, and call-to-action
- Mentions special features (like cannabis cafe if applicable)
- Example: `Visit Mint Cannabis dispensary in Phoenix, AZ for premium recreational and medical cannabis products. Browse our menu, check deals, and shop online.`

### 3. **Keywords** (Comprehensive)
Location-based keywords:
- `cannabis dispensary {city}`
- `marijuana dispensary {city} {state}`
- `dispensary near me {city}`
- `weed dispensary {city}`

Type-specific keywords:
- Medical: `medical marijuana {city}`, `mmj dispensary`, `medical cannabis card`
- Recreational: `recreational marijuana {city}`, `adult use cannabis`, `21+ dispensary`

Product & service keywords:
- `cannabis deals`, `online cannabis menu`
- `dispensary delivery`, `cannabis pickup`

State/regional keywords:
- `{state} dispensary`
- `cannabis {state}`
- `dispensary {zipcode}`

Special features:
- Cafe: `cannabis cafe`, `marijuana cafe`, `cannabis lounge`

###4. **Structured Data** (Schema.org LocalBusiness)
Generates JSON-LD structured data including:
- Store name and description
- Full address (street, city, state, zip)
- Geographic coordinates (lat/lng)
- Phone number and email
- Opening hours
- Price range
- Payment methods
- Service area
- Store images

This helps search engines display rich snippets in search results.

### 5. **Canonical URL**
- Format: `https://mintdeals.com/stores/{slug}`
- Prevents duplicate content issues

### 6. **Meta Robots**
- Set to `index, follow` for maximum visibility

### 7. **Meta Viewport**
- Set to `width=device-width, initial-scale=1` for mobile optimization

## Script Location

```
MintDeals_Backend/scripts/add-seo-metadata.js
```

## Prerequisites

1. **Node.js** installed (already available in your project)
2. **Strapi API Token** with write permissions:
   - Log into Strapi admin panel
   - Go to Settings → API Tokens
   - Create a new token with "Full access" or at least "Store" write permissions
   - Copy the token value

## Usage

### Option 1: Run against Production (Recommended)

```bash
# Set environment variables
export STRAPI_URL=https://mintdealsbackend-production.up.railway.app
export STRAPI_API_TOKEN="your-api-token-here"

# Run the script
node scripts/add-seo-metadata.js
```

### Option 2: Run against Local Development

```bash
# Make sure local Strapi is running
npm run develop

# In another terminal
export STRAPI_URL=http://localhost:1337
export STRAPI_API_TOKEN="your-local-api-token"

node scripts/add-seo-metadata.js
```

### Option 3: Windows (PowerShell)

```powershell
$env:STRAPI_URL="https://mintdealsbackend-production.up.railway.app"
$env:STRAPI_API_TOKEN="your-api-token-here"

node scripts/add-seo-metadata.js
```

## Script Behavior

- **Safety**: The script will skip stores that already have SEO metadata (checks for `metaTitle`)
- **Rate Limiting**: Includes 500ms delay between updates to avoid overwhelming the API
- **Error Handling**: Continues processing other stores if one fails
- **Logging**: Provides detailed console output showing:
  - Which stores are being processed
  - Generated meta titles and descriptions
  - Success/failure status for each store
  - Final summary with counts

## Expected Output

```
Fetching stores from Strapi...
Found 32 stores to update

Processing: Mint Cannabis - Tempe (ID: 1)
  📝 Generated SEO data:
     Title: Mint Cannabis - Tempe - Recreational Cannabis Dispensary in Tempe, AZ
     Description: Visit Mint Cannabis - Tempe dispensary in Tempe, AZ for premium recreational cannabis products. Browse our menu, check deals...
  ✅ Successfully updated

Processing: Mint Cannabis - Phoenix (ID: 2)
  ⏭️  Skipping - SEO data already exists

...

=== Summary ===
Total stores: 32
Successfully updated: 31
Errors: 0
Skipped (already had SEO): 1

✨ Script completed successfully
```

## SEO Best Practices Implemented

1. **Title Length**: Kept to 60-70 characters for optimal display in search results
2. **Description Length**: 155-160 characters for complete display without truncation
3. **Keyword Relevance**: Includes high-intent keywords like "dispensary near me" and location-specific terms
4. **Structured Data**: Implements LocalBusiness schema for rich snippets
5. **Canonical URLs**: Prevents duplicate content penalties
6. **Mobile Optimization**: Includes viewport meta tag
7. **Local SEO**: Heavy focus on city, state, and ZIP code keywords
8. **Long-tail Keywords**: Includes specific product and service terms

## Content Types Supported

Currently configured for:
- **Stores** (32 locations across AZ, NV, MO, MI, FL)

Can be extended to support:
- Pages
- Events
- Promotions
- Brand pages

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'name')"
- The API may require authentication
- Make sure you've set the `STRAPI_API_TOKEN` environment variable
- Verify the token has the correct permissions

### Error: "Request failed with status code 401"
- The API token is invalid or expired
- Generate a new token from the Strapi admin panel

### Error: "Request failed with status code 400"
- The populate parameter may be incorrectly formatted
- Check that the store schema matches the script expectations

### Script completes but no updates
- Check if stores already have SEO metadata
- The script skips stores with existing `metaTitle` values
- Remove `metaTitle` from stores to force regeneration

## Future Enhancements

Potential improvements:
1. Support for multiple languages/locales
2. A/B testing different meta descriptions
3. Dynamic keyword suggestions based on search trends
4. Integration with Google Search Console for performance tracking
5. Automatic regeneration when store details change
6. Social media meta tags (Open Graph, Twitter Cards)
7. FAQ schema for common questions

## Database Impact

### Tables Affected
- `stores` - Updated with `seo` component reference
- `components_seo_metas` - New rows created for each store's SEO data

### Rollback
To remove all SEO data:

```sql
-- Connect to database
UPDATE stores SET seo = NULL;
DELETE FROM components_seo_metas WHERE id NOT IN (
  SELECT seo FROM pages WHERE seo IS NOT NULL
);
```

## Performance

- **Execution Time**: ~16 seconds for 32 stores (500ms delay between updates)
- **Database Impact**: Minimal - adds one row per store to seo_metas table
- **API Load**: Light - sequential updates with built-in rate limiting

## Monitoring

After running the script, verify the SEO data:

1. **Via Strapi Admin**:
   - Go to Content Manager → Stores
   - Open any store and check the SEO component
   - Verify all fields are populated

2. **Via API**:
   ```bash
   curl "https://mintdealsbackend-production.up.railway.app/api/stores?populate=seo"
   ```

3. **Via Frontend**:
   - Check page source for meta tags
   - Use browser dev tools to inspect structured data
   - Test with Google Rich Results Test: https://search.google.com/test/rich-results

## Support

For issues or questions:
1. Check the script output for specific error messages
2. Verify API token permissions in Strapi admin
3. Test with a single store first before running on all stores
4. Review Strapi logs for additional context

## License

Internal use only - Mint Cannabis / MintDeals.com
