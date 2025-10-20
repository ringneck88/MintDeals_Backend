const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

// Helper function to generate SEO metadata for a region
function generateRegionSEO(region) {
  const { name, region_type, stores } = region;

  // Determine region type (State, City, etc.)
  const regionTypeName = region_type?.data?.attributes?.name || 'Region';
  const isState = regionTypeName.toLowerCase().includes('state');
  const storeCount = stores?.data?.length || 0;

  // Generate meta title (optimized for 60 characters)
  let metaTitle;
  if (isState) {
    metaTitle = `Cannabis Dispensaries in ${name} | Mint Dispensary Locations`;
  } else {
    metaTitle = `${name} Cannabis Dispensaries | Premium Marijuana Products`;
  }

  // Generate meta description (optimized for 155-160 characters)
  let metaDescription;
  if (storeCount > 0) {
    metaDescription = `Find ${storeCount} Mint Cannabis dispensar${storeCount === 1 ? 'y' : 'ies'} in ${name}. Shop premium cannabis products, check deals, browse menus, and order online for pickup or delivery.`;
  } else {
    metaDescription = `Explore Mint Cannabis dispensaries in ${name}. Discover premium cannabis products, special deals, and convenient shopping options including online ordering and delivery.`;
  }

  // Generate keywords
  const baseKeywords = [
    `cannabis dispensary ${name}`,
    `marijuana dispensary ${name}`,
    `weed dispensary ${name}`,
    `dispensary near me ${name}`,
    `cannabis store ${name}`,
    `marijuana store ${name}`,
    `cannabis shops ${name}`,
    `pot shops ${name}`,
    `Mint Cannabis ${name}`,
    `Mint Dispensary ${name}`,
  ];

  // Add state-specific keywords
  if (isState) {
    baseKeywords.push(
      `${name} cannabis laws`,
      `${name} marijuana laws`,
      `${name} dispensary license`,
      `legal cannabis ${name}`,
      `recreational marijuana ${name}`,
      `medical marijuana ${name}`,
      `cannabis delivery ${name}`,
      `dispensary locations ${name}`
    );
  } else {
    baseKeywords.push(
      `${name} weed delivery`,
      `${name} cannabis pickup`,
      `best dispensary ${name}`,
      `${name} marijuana deals`,
      `${name} cannabis menu`
    );
  }

  // Add product keywords
  baseKeywords.push(
    'cannabis flower',
    'marijuana edibles',
    'cannabis concentrates',
    'cannabis vapes',
    'CBD products',
    'THC products',
    'cannabis topicals',
    'marijuana pre-rolls',
    'cannabis tinctures',
    'dispensary deals',
    'cannabis specials'
  );

  const keywords = baseKeywords.join(', ');

  // Generate canonical URL
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const canonicalURL = `https://mintdeals.com/regions/${slug}`;

  // Generate structured data (Place schema)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': isState ? 'State' : 'Place',
    'name': name,
    'description': metaDescription,
    'url': canonicalURL,
    'containedInPlace': isState ? {
      '@type': 'Country',
      'name': 'United States',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'US'
      }
    } : undefined,
    'additionalType': regionTypeName,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `https://mintdeals.com/stores?region=${slug}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // If there are stores, add them as hasMap
  if (storeCount > 0) {
    structuredData.hasMap = {
      '@type': 'Map',
      'mapType': 'VenueMap',
      'url': `https://mintdeals.com/regions/${slug}/map`
    };
  }

  // Remove undefined values
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });

  return {
    metaTitle: metaTitle.substring(0, 70),
    metaDescription: metaDescription.substring(0, 160),
    keywords,
    metaRobots: 'index, follow',
    structuredData,
    metaViewport: 'width=device-width, initial-scale=1',
    canonicalURL
  };
}

// Main function to update all regions with SEO data
async function updateRegionSEO() {
  try {
    console.log('Fetching regions from Strapi...');

    // Fetch all regions with related data
    const response = await axios.get(`${STRAPI_URL}/api/regions`, {
      params: {
        'populate': ['region_type', 'stores'],
        'pagination[pageSize]': 100
      },
      headers: API_TOKEN ? {
        'Authorization': `Bearer ${API_TOKEN}`
      } : {}
    });

    const regions = response.data.data;
    console.log(`Found ${regions.length} regions to update`);

    let updated = 0;
    let errors = 0;

    for (const region of regions) {
      try {
        const regionData = region.attributes;
        const regionId = region.id;

        console.log(`\nProcessing: ${regionData.name} (ID: ${regionId})`);

        // Check if SEO data already exists
        if (regionData.seo && regionData.seo.metaTitle) {
          console.log(`  ⏭️  Skipping - SEO data already exists`);
          continue;
        }

        // Generate SEO metadata
        const seoData = generateRegionSEO({
          ...regionData,
          id: regionId,
          region_type: regionData.region_type,
          stores: regionData.stores
        });

        console.log(`  📝 Generated SEO data:`);
        console.log(`     Title: ${seoData.metaTitle}`);
        console.log(`     Description: ${seoData.metaDescription.substring(0, 100)}...`);

        // Update the region with SEO data
        await axios.put(`${STRAPI_URL}/api/regions/${regionId}`, {
          data: {
            seo: seoData
          }
        }, {
          headers: API_TOKEN ? {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        });

        console.log(`  ✅ Successfully updated`);
        updated++;

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`  ❌ Error updating region ID ${region.id}:`, error.response?.data || error.message);
        errors++;
      }
    }

    console.log(`\n\n=== Summary ===`);
    console.log(`Total regions: ${regions.length}`);
    console.log(`Successfully updated: ${updated}`);
    console.log(`Errors: ${errors}`);
    console.log(`Skipped (already had SEO): ${regions.length - updated - errors}`);

  } catch (error) {
    console.error('Fatal error:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  updateRegionSEO()
    .then(() => {
      console.log('\n✨ Script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { generateRegionSEO, updateRegionSEO };
