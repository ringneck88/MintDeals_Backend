/**
 * Script to fetch stores from production and add lat/long coordinates to geo field
 */

const PRODUCTION_URL = 'https://mintdeals-backend-production.up.railway.app';
const LOCAL_URL = 'http://localhost:1337';

async function fetchProductionStores() {
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/stores?pagination[pageSize]=100&populate=address`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching production stores:', error);
    return [];
  }
}

async function geocodeAddress(address) {
  // For now, return mock coordinates based on address
  // In production, you would use a geocoding service like Google Maps or OpenCage
  const mockCoordinates = {
    // Add known store locations here
    'Florida': { lat: 28.5383, lng: -81.3792 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'California': { lat: 34.0522, lng: -118.2437 },
  };

  // Try to match state from address
  for (const [state, coords] of Object.entries(mockCoordinates)) {
    if (address && address.state && address.state.includes(state)) {
      return coords;
    }
  }

  return null;
}

async function updateStoreGeo(storeId, coordinates) {
  try {
    const response = await fetch(`${LOCAL_URL}/api/stores/${storeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          geo: coordinates
        }
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating store ${storeId}:`, error);
    return null;
  }
}

async function main() {
  console.log('Fetching stores from production...');
  const stores = await fetchProductionStores();

  console.log(`Found ${stores.length} stores`);

  for (const store of stores) {
    console.log(`\nProcessing store: ${store.attributes.name}`);

    const address = store.attributes.address;
    const coordinates = await geocodeAddress(address);

    if (coordinates) {
      console.log(`  Found coordinates: ${coordinates.lat}, ${coordinates.lng}`);
      const result = await updateStoreGeo(store.id, coordinates);
      if (result) {
        console.log(`  ✓ Updated store ${store.id}`);
      } else {
        console.log(`  ✗ Failed to update store ${store.id}`);
      }
    } else {
      console.log(`  ⚠ Could not geocode address for ${store.attributes.name}`);
      console.log(`    Address:`, address);
    }
  }

  console.log('\nDone!');
}

main();
