/**
 * Script to geocode store addresses using a free geocoding service
 * This will output coordinates that can be added to update-store-geo.js
 */

const stores = [
  { name: 'Mint Cannabis Buckeye', address: '1629 N 195th Ave Suite #101, Buckeye, AZ 85396' },
  { name: 'Mint Cannabis 75th Ave Phoenix', address: '1211 North 75th Avenue, Phoenix, Arizona 85043' },
  { name: 'Mint Cannabis El Mirage', address: '15235 North Dysart Road ste 111d, El Mirage, Arizona 85335' },
  { name: 'Mint Cannabis Mesa', address: '330 E Southern Ave, Mesa, AZ 85210' },
  { name: 'Mint Cannabis Tempe', address: '5210 South Priest Drive, Guadalupe, AZ 85283' },
  { name: 'Mint Cannabis Northern Phoenix', address: '2444 W Northern Ave, Phoenix, AZ 85021' },
  { name: 'Mint Cannabis Phoenix', address: '17036 North Cave Creek Road, Phoenix, AZ 85032' },
  { name: 'Mint Cannabis Scottsdale', address: '8729 East Manzanita Drive, Phoenix, AZ 85258' },
  { name: 'Mint Cannabis - Willowbrook IL Dispensary', address: '900 75th Street, Willowbrook, Illinois 60527' },
  { name: 'Mint Cannabis - St. Peters Dispensary', address: '150 Mid Rivers Mall Circle, St. Peters, Missouri 63376' },
  { name: 'Mint Cannabis Las Vegas Strip Dispensary', address: '4503 Paradise Road, Las Vegas, Nevada 89119' },
  { name: 'Mint Cannabis West Las Vegas Dispensary', address: '6332 South Rainbow Boulevard #105, Las Vegas, Nevada 89118' },
  { name: 'Mint Cannabis Monroe MI Dispensary', address: '760 South Telegraph Road, Monroe, Michigan 48161' },
  { name: 'Mint Cannabis Kalamazoo MI Dispensary', address: '730 E. Cork St, Kalamazoo, Michigan 49001' },
  { name: 'Mint Cannabis Coldwater MI Dispensary', address: '365 N Willowbrook Rd, Coldwater, Michigan 49036' },
  { name: 'Mint Cannabis Portage MI Dispensary', address: '5747 S Westnedge Ave, Portage, Michigan 49002' },
  { name: 'Mint Cannabis Roseville MI Dispensary', address: '28970 Hayes Road, Roseville, Michigan 48066' },
  { name: 'Mint Cannabis New Buffalo MI Dispensary', address: '18300 US-12, New Buffalo, Michigan 49117' },
  { name: 'Mint Cannabis Bonita Springs FL Dispensary', address: '8800 Terrene Ct., Bonita Springs, Florida 34135' },
  { name: 'Mint Cannabis Bradenton FL Dispensary', address: '4549 14th St. West, Bradenton, Florida 34207' },
  { name: 'Mint Cannabis Brandon FL Dispensary', address: '2116 West Brandon Boulevard, Brandon, Florida 33511' },
  { name: 'Mint Cannabis Cape Coral FL Dispensary', address: '2126 Del Prado Boulevard South, Cape Coral, Florida 33990' },
  { name: 'Mint Cannabis Delray Beach FL Dispensary', address: '6110 West Atlantic Avenue, Delray Beach, Florida 33484' },
  { name: 'Mint Cannabis Gainesville FL Dispensary', address: '318 NW 13th St., Gainesville, Florida 32601' },
  { name: 'Mint Cannabis Jacksonville FL Dispensary', address: '4332 University Blvd S., Jacksonville, Florida 32216' },
  { name: 'Mint Cannabis Longwood FL Dispensary', address: '1415 West State Road 434, Longwood, Florida 32750' },
  { name: 'Mint Cannabis Melbourne FL Dispensary', address: '21 Suntree Place, Melbourne, Florida 32940' },
  { name: 'Mint Cannabis Miami FL Dispensary', address: '12083 SW 117th Ave, Miami, Florida 33186' },
  { name: 'Mint Cannabis  Orlando FL Dispensary', address: '10615 East Colonial Dr., Orlando, Florida 32817' },
  { name: 'Mint Cannabis Sarasota FL Dispensary', address: '6979 S. Tamiami Trail, Sarasota, Florida 34231' },
  { name: 'Mint Cannabis St. Augustine FL Dispensary', address: '160 King St, St Augustine, Florida 32084' },
  { name: 'Mint Cannabis Stuart FL Dispensary', address: '4203 SE Federal Hwy #103, Stuart, Florida 34997' }
];

async function geocode(address) {
  // Using nominatim (OpenStreetMap) free geocoding service
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'MintCannabis/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.statusText}`);
  }

  const data = await response.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }

  return null;
}

async function main() {
  console.log('Geocoding all store addresses...\n');
  console.log('Copy this object into STORE_COORDINATES in update-store-geo.js:\n');
  console.log('const STORE_COORDINATES = {');

  for (const store of stores) {
    try {
      console.log(`  // Geocoding: ${store.name}...`);
      const coords = await geocode(store.address);

      if (coords) {
        console.log(`  '${store.name}': { lat: ${coords.lat}, lng: ${coords.lng} },`);
      } else {
        console.log(`  // '${store.name}': { lat: 0, lng: 0 }, // FAILED TO GEOCODE`);
      }

      // Add delay to respect rate limits (1 request per second for Nominatim)
      await new Promise(resolve => setTimeout(resolve, 1100));
    } catch (error) {
      console.log(`  // '${store.name}': { lat: 0, lng: 0 }, // ERROR: ${error.message}`);
    }
  }

  console.log('};\n');
  console.log('\nDone! Copy the above object into update-store-geo.js');
}

main().catch(console.error);
