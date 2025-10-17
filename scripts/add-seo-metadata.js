const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN; // You'll need to set this

// Helper function to generate SEO metadata for a store
function generateStoreSEO(store) {
  const { name, address, region, isMedical, isRecreational, hasCafe } = store;

  // Build store type description
  const storeTypes = [];
  if (isMedical) storeTypes.push('medical');
  if (isRecreational) storeTypes.push('recreational');
  const storeTypeText = storeTypes.length > 0 ? storeTypes.join(' and ') : 'cannabis';

  // Extract location details
  const city = address?.city || '';
  const state = address?.state || '';
  const zipCode = address?.postalCode || '';
  const regionName = region?.name || '';

  // Build location string
  const locationStr = [city, state].filter(Boolean).join(', ');
  const fullLocation = [city, state, zipCode].filter(Boolean).join(', ');

  // Generate meta title (optimized for 60 characters)
  const metaTitle = `${name} - ${storeTypeText.charAt(0).toUpperCase() + storeTypeText.slice(1)} Cannabis Dispensary in ${city}, ${state}`;

  // Generate meta description (optimized for 155-160 characters)
  const cafeText = hasCafe ? ' Visit our cannabis cafe for a unique experience.' : '';
  const metaDescription = `Visit ${name} dispensary in ${locationStr} for premium ${storeTypeText} cannabis products. Browse our menu, check deals, and shop online.${cafeText}`;

  // Generate keywords
  const baseKeywords = [
    `${name}`,
    `${name} dispensary`,
    `cannabis dispensary ${city}`,
    `marijuana dispensary ${city} ${state}`,
    `${storeTypeText} cannabis ${city}`,
    `weed dispensary ${city}`,
    `dispensary near me ${city}`,
    `cannabis store ${locationStr}`,
    'marijuana products',
    'cannabis deals',
    'online cannabis menu',
    'dispensary delivery',
    'cannabis pickup',
  ];

  if (hasCafe) {
    baseKeywords.push('cannabis cafe', 'marijuana cafe', 'cannabis lounge');
  }

  if (isMedical) {
    baseKeywords.push(
      `medical marijuana ${city}`,
      'medical cannabis card',
      'mmj dispensary',
      'medical marijuana products'
    );
  }

  if (isRecreational) {
    baseKeywords.push(
      `recreational marijuana ${city}`,
      'recreational cannabis',
      'adult use cannabis',
      '21+ dispensary'
    );
  }

  // Add state-specific keywords
  baseKeywords.push(
    `${state} dispensary`,
    `cannabis ${state}`,
    `marijuana ${state}`,
    `dispensary ${zipCode}`
  );

  const keywords = baseKeywords.join(', ');

  // Generate canonical URL
  const canonicalURL = `https://mintdeals.com/stores/${store.slug || store.id}`;

  // Generate structured data (LocalBusiness schema)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': canonicalURL,
    'name': name,
    'description': metaDescription,
    'url': canonicalURL,
    'telephone': store.phone || undefined,
    'email': store.email || undefined,
    'address': address ? {
      '@type': 'PostalAddress',
      'streetAddress': address.street1 || undefined,
      'addressLocality': city,
      'addressRegion': state,
      'postalCode': zipCode,
      'addressCountry': 'US'
    } : undefined,
    'geo': store.geo ? {
      '@type': 'GeoCoordinates',
      'latitude': store.geo.lat || store.geo.latitude,
      'longitude': store.geo.lng || store.geo.longitude
    } : undefined,
    'openingHoursSpecification': store.hours ? store.hours.map(hour => ({
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': hour.day_of_week,
      'opens': hour.open_time,
      'closes': hour.close_time
    })) : undefined,
    'priceRange': '$$',
    'image': store.hero_media?.url || undefined,
    'paymentAccepted': 'Cash, Debit Card, Credit Card',
    'currenciesAccepted': 'USD',
    'areaServed': {
      '@type': 'City',
      'name': city,
      'containedInPlace': {
        '@type': 'State',
        'name': state
      }
    }
  };

  // Remove undefined values
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });

  return {
    metaTitle: metaTitle.substring(0, 70), // Ensure it's not too long
    metaDescription: metaDescription.substring(0, 160), // Optimal length
    keywords,
    metaRobots: 'index, follow',
    structuredData,
    metaViewport: 'width=device-width, initial-scale=1',
    canonicalURL
  };
}

// Main function to update all stores with SEO data
async function updateStoreSEO() {
  try {
    console.log('Fetching stores from Strapi...');

    // Fetch all stores with related data
    const response = await axios.get(`${STRAPI_URL}/api/stores`, {
      params: {
        'populate': '*',
        'pagination[pageSize]': 100
      },
      headers: API_TOKEN ? {
        'Authorization': `Bearer ${API_TOKEN}`
      } : {}
    });

    const stores = response.data.data;
    console.log(`Found ${stores.length} stores to update`);

    let updated = 0;
    let errors = 0;

    for (const store of stores) {
      try {
        const storeData = store.attributes;
        const storeId = store.id;

        console.log(`\nProcessing: ${storeData.name} (ID: ${storeId})`);

        // Check if SEO data already exists
        if (storeData.seo && storeData.seo.metaTitle) {
          console.log(`  ⏭️  Skipping - SEO data already exists`);
          continue;
        }

        // Generate SEO metadata
        const seoData = generateStoreSEO({
          ...storeData,
          id: storeId,
          slug: storeData.slug,
          region: storeData.region?.data?.attributes
        });

        console.log(`  📝 Generated SEO data:`);
        console.log(`     Title: ${seoData.metaTitle}`);
        console.log(`     Description: ${seoData.metaDescription.substring(0, 100)}...`);

        // Update the store with SEO data
        await axios.put(`${STRAPI_URL}/api/stores/${storeId}`, {
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
        console.error(`  ❌ Error updating store ID ${store.id}:`, error.response?.data || error.message);
        errors++;
      }
    }

    console.log(`\n\n=== Summary ===`);
    console.log(`Total stores: ${stores.length}`);
    console.log(`Successfully updated: ${updated}`);
    console.log(`Errors: ${errors}`);
    console.log(`Skipped (already had SEO): ${stores.length - updated - errors}`);

  } catch (error) {
    console.error('Fatal error:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  updateStoreSEO()
    .then(() => {
      console.log('\n✨ Script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { generateStoreSEO, updateStoreSEO };
