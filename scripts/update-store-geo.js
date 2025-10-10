/**
 * Script to update store geo fields in Railway production database
 * Run with: node scripts/update-store-geo.js
 *
 * Usage:
 * 1. First run to see all stores and their addresses
 * 2. Add coordinates to STORE_COORDINATES object below
 * 3. Run again with UPDATE_MODE=true to update stores
 */

const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:krbHBYJkGXmrwUtxfzDcEXSJRzppnDll@crossover.proxy.rlwy.net:45401/railway';
const UPDATE_MODE = process.env.UPDATE_MODE === 'true';

// Store coordinates - geocoded from actual addresses
const STORE_COORDINATES = {
  'Mint Cannabis Buckeye': { lat: 33.466307, lng: -112.478267 },
  'Mint Cannabis 75th Ave Phoenix': { lat: 33.4609786, lng: -112.2205455 },
  'Mint Cannabis El Mirage': { lat: 33.6228378, lng: -112.3402034 },
  'Mint Cannabis Mesa': { lat: 33.3936432, lng: -111.8238394 },
  'Mint Cannabis Tempe': { lat: 33.3771873, lng: -111.9637536 },
  'Mint Cannabis Northern Phoenix': { lat: 33.5533884, lng: -112.1115202 },
  'Mint Cannabis Phoenix': { lat: 33.6410373, lng: -112.0309549 },
  'Mint Cannabis Scottsdale': { lat: 33.5539723, lng: -112.0407997 },
  'Mint Cannabis - Willowbrook IL Dispensary': { lat: 41.7526296, lng: -87.9433317 },
  'Mint Cannabis - St. Peters Dispensary': { lat: 38.7983778, lng: -90.6192403 },
  'Mint Cannabis Las Vegas Strip Dispensary': { lat: 36.1070679, lng: -115.152229 },
  'Mint Cannabis West Las Vegas Dispensary': { lat: 36.0737003, lng: -115.2421173 },
  'Mint Cannabis Monroe MI Dispensary': { lat: 41.8830999, lng: -83.4399075 },
  'Mint Cannabis Kalamazoo MI Dispensary': { lat: 42.2593329, lng: -85.5717185 },
  'Mint Cannabis Coldwater MI Dispensary': { lat: 41.9457237, lng: -84.9713102 },
  'Mint Cannabis Portage MI Dispensary': { lat: 42.2331563, lng: -85.5889628 },
  'Mint Cannabis Roseville MI Dispensary': { lat: 42.5082061, lng: -82.9681106 },
  'Mint Cannabis New Buffalo MI Dispensary': { lat: 41.7890235, lng: -86.7557948 },
  'Mint Cannabis Bonita Springs FL Dispensary': { lat: 26.3538, lng: -81.807441 },
  'Mint Cannabis Bradenton FL Dispensary': { lat: 27.4587096, lng: -82.5752689 },
  'Mint Cannabis Brandon FL Dispensary': { lat: 27.9376226, lng: -82.2977185 },
  'Mint Cannabis Cape Coral FL Dispensary': { lat: 26.6129443, lng: -81.9412084 },
  'Mint Cannabis Delray Beach FL Dispensary': { lat: 26.4577487, lng: -80.1270513 },
  'Mint Cannabis Gainesville FL Dispensary': { lat: 29.6542143, lng: -82.3393713 },
  'Mint Cannabis Jacksonville FL Dispensary': { lat: 30.2785261, lng: -81.6033448 },
  'Mint Cannabis Longwood FL Dispensary': { lat: 28.697834, lng: -81.376002 },
  'Mint Cannabis Melbourne FL Dispensary': { lat: 28.2279756, lng: -80.6794621 },
  'Mint Cannabis Miami FL Dispensary': { lat: 25.654953, lng: -80.3829759 },
  'Mint Cannabis  Orlando FL Dispensary': { lat: 28.5534194, lng: -81.3222076 },
  'Mint Cannabis Sarasota FL Dispensary': { lat: 27.2549537, lng: -82.5177433 },
  'Mint Cannabis St. Augustine FL Dispensary': { lat: 29.8914648, lng: -81.3238198 },
  'Mint Cannabis Stuart FL Dispensary': { lat: 27.1540593, lng: -80.2188957 },
};

async function getStores() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to Railway database');

    const result = await client.query(`
      SELECT
        s.id,
        s.document_id,
        s.name,
        s.geo,
        ca.street,
        ca.city,
        ca.state,
        ca.zip_code
      FROM stores s
      LEFT JOIN stores_cmps sc ON s.id = sc.entity_id AND sc.field = 'address'
      LEFT JOIN components_common_addresses ca ON sc.cmp_id = ca.id
      ORDER BY s.id
    `);

    return result.rows;
  } finally {
    await client.end();
  }
}

async function updateStoreGeo(storeId, geoData) {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();

    const result = await client.query(
      'UPDATE stores SET geo = $1 WHERE id = $2 RETURNING id, name',
      [JSON.stringify(geoData), storeId]
    );

    return result.rows[0];
  } finally {
    await client.end();
  }
}

async function main() {
  console.log('Fetching stores from Railway production database...\n');

  const stores = await getStores();
  console.log(`Found ${stores.length} stores\n`);
  console.log('='.repeat(80) + '\n');

  let updatedCount = 0;
  let skippedCount = 0;
  let missingCoordsCount = 0;

  for (const store of stores) {
    console.log(`Store: ${store.name} (ID: ${store.id})`);
    console.log(`  Document ID: ${store.document_id}`);
    console.log(`  Address: ${store.street || 'N/A'}`);
    console.log(`           ${store.city || 'N/A'}, ${store.state || 'N/A'} ${store.zip_code || 'N/A'}`);
    console.log(`  Current geo: ${store.geo || 'null'}`);

    // Check if coordinates are already set
    if (store.geo && typeof store.geo === 'object' && store.geo.lat && store.geo.lng) {
      console.log(`  ✓ Already has coordinates\n`);
      skippedCount++;
      continue;
    }

    // Try to get coordinates for this store
    const coords = STORE_COORDINATES[store.name];
    if (coords) {
      if (UPDATE_MODE) {
        console.log(`  → Updating with lat: ${coords.lat}, lng: ${coords.lng}`);
        try {
          await updateStoreGeo(store.id, coords);
          console.log(`  ✓ Updated\n`);
          updatedCount++;
        } catch (error) {
          console.log(`  ✗ Failed to update: ${error.message}\n`);
        }
      } else {
        console.log(`  → Would update with lat: ${coords.lat}, lng: ${coords.lng} (set UPDATE_MODE=true to update)\n`);
      }
    } else {
      console.log(`  ⚠ No coordinates found for this store`);
      console.log(`  → Add coordinates to STORE_COORDINATES in the script\n`);
      missingCoordsCount++;
    }
  }

  console.log('='.repeat(80));
  console.log('\nSummary:');
  console.log(`  Total stores: ${stores.length}`);
  console.log(`  Already have coordinates: ${skippedCount}`);
  console.log(`  Updated: ${updatedCount}`);
  console.log(`  Missing coordinates: ${missingCoordsCount}`);

  if (!UPDATE_MODE && missingCoordsCount > 0) {
    console.log('\n  Run with UPDATE_MODE=true to apply updates');
  }
}

main().catch(console.error);
