#!/usr/bin/env node

/**
 * Direct Database Store Import
 * This script directly inserts stores into the SQLite database, bypassing API restrictions
 */

const Database = require('better-sqlite3');
const path = require('path');

const stores = [
  // Arizona Locations
  {
    name: "Mint Cannabis Tempe",
    phone: "(480) 749-6468",
    address: {
      street_1: "5210 S Priest Dr.",
      city: "Tempe",
      state: "AZ",
      postal_code: "85283",
      country: "US",
      formatted_address: "5210 S Priest Dr., Tempe, AZ 85283"
    },
    timezone: "America/Phoenix",
    is_active: true,
    hours: {
      monday_open: "00:00:00.000",
      monday_close: "23:59:59.000",
      tuesday_open: "00:00:00.000",
      tuesday_close: "23:59:59.000",
      wednesday_open: "00:00:00.000",
      wednesday_close: "23:59:59.000",
      thursday_open: "00:00:00.000",
      thursday_close: "23:59:59.000",
      friday_open: "00:00:00.000",
      friday_close: "23:59:59.000",
      saturday_open: "00:00:00.000",
      saturday_close: "23:59:59.000",
      sunday_open: "00:00:00.000",
      sunday_close: "23:59:59.000",
      timezone: "America/Phoenix",
      notes: "Open 24 hours"
    },
    services: [
      { name: "Medical", is_active: true },
      { name: "Recreational", is_active: true },
      { name: "Cafe", is_active: true }
    ]
  },
  {
    name: "Mint Cannabis Phoenix",
    phone: "(602) 354-3344",
    address: {
      street_1: "314 W McDowell Rd.",
      city: "Phoenix",
      state: "AZ",
      postal_code: "85003",
      country: "US",
      formatted_address: "314 W McDowell Rd., Phoenix, AZ 85003"
    },
    timezone: "America/Phoenix",
    is_active: true,
    hours: {
      monday_open: "00:00:00.000",
      monday_close: "23:59:59.000",
      tuesday_open: "00:00:00.000",
      tuesday_close: "23:59:59.000",
      wednesday_open: "00:00:00.000",
      wednesday_close: "23:59:59.000",
      thursday_open: "00:00:00.000",
      thursday_close: "23:59:59.000",
      friday_open: "00:00:00.000",
      friday_close: "23:59:59.000",
      saturday_open: "00:00:00.000",
      saturday_close: "23:59:59.000",
      sunday_open: "00:00:00.000",
      sunday_close: "23:59:59.000",
      timezone: "America/Phoenix",
      notes: "Open 24 hours"
    },
    services: [
      { name: "Medical", is_active: true },
      { name: "Recreational", is_active: true },
      { name: "Delivery", is_active: true }
    ]
  },
  {
    name: "Mint Cannabis Mesa",
    phone: "(480) 590-3010",
    address: {
      street_1: "1235 S Power Rd.",
      city: "Mesa",
      state: "AZ",
      postal_code: "85206",
      country: "US",
      formatted_address: "1235 S Power Rd., Mesa, AZ 85206"
    },
    timezone: "America/Phoenix",
    is_active: true,
    hours: {
      monday_open: "00:00:00.000",
      monday_close: "23:59:59.000",
      tuesday_open: "00:00:00.000",
      tuesday_close: "23:59:59.000",
      wednesday_open: "00:00:00.000",
      wednesday_close: "23:59:59.000",
      thursday_open: "00:00:00.000",
      thursday_close: "23:59:59.000",
      friday_open: "00:00:00.000",
      friday_close: "23:59:59.000",
      saturday_open: "00:00:00.000",
      saturday_close: "23:59:59.000",
      sunday_open: "00:00:00.000",
      sunday_close: "23:59:59.000",
      timezone: "America/Phoenix",
      notes: "Open 24 hours"
    },
    services: [
      { name: "Medical", is_active: true },
      { name: "Recreational", is_active: true }
    ]
  }
];

async function directDatabaseImport() {
  console.log('🗃️  Direct Database Store Import');
  console.log('================================\n');

  const dbPath = path.join(__dirname, '.tmp', 'data.db');
  console.log(`📁 Database path: ${dbPath}`);

  try {
    const db = new Database(dbPath);
    console.log('✅ Connected to database\n');

    // Begin transaction
    db.exec('BEGIN TRANSACTION');

    let storesCreated = 0;

    for (const store of stores) {
      console.log(`📍 Creating store: ${store.name}`);

      try {
        // Generate unique IDs
        const now = Date.now();
        const storeDocumentId = require('crypto').randomBytes(12).toString('hex');
        const addressComponentId = require('crypto').randomBytes(12).toString('hex');
        const hoursComponentId = require('crypto').randomBytes(12).toString('hex');

        // Create address component
        const insertAddress = db.prepare(`
          INSERT INTO components_common_addresses (
            street_1, city, state, postal_code, country, formatted_address
          ) VALUES (?, ?, ?, ?, ?, ?)
        `);

        const addressResult = insertAddress.run(
          store.address.street_1,
          store.address.city,
          store.address.state,
          store.address.postal_code,
          store.address.country,
          store.address.formatted_address
        );

        const addressId = addressResult.lastInsertRowid;

        // Create hours component
        const insertHours = db.prepare(`
          INSERT INTO components_common_hours (
            monday_open, monday_close, tuesday_open, tuesday_close,
            wednesday_open, wednesday_close, thursday_open, thursday_close,
            friday_open, friday_close, saturday_open, saturday_close,
            sunday_open, sunday_close, timezone, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const hoursResult = insertHours.run(
          store.hours.monday_open, store.hours.monday_close,
          store.hours.tuesday_open, store.hours.tuesday_close,
          store.hours.wednesday_open, store.hours.wednesday_close,
          store.hours.thursday_open, store.hours.thursday_close,
          store.hours.friday_open, store.hours.friday_close,
          store.hours.saturday_open, store.hours.saturday_close,
          store.hours.sunday_open, store.hours.sunday_close,
          store.hours.timezone, store.hours.notes
        );

        const hoursId = hoursResult.lastInsertRowid;

        // Create store
        const insertStore = db.prepare(`
          INSERT INTO stores (
            document_id, name, phone, timezone, is_active,
            created_at, updated_at, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const storeResult = insertStore.run(
          storeDocumentId,
          store.name,
          store.phone,
          store.timezone,
          store.is_active ? 1 : 0,
          now, now, now
        );

        const storeId = storeResult.lastInsertRowid;

        // Link address to store
        const linkAddress = db.prepare(`
          INSERT INTO stores_cmps (
            entity_id, cmp_id, component_type, field, "order"
          ) VALUES (?, ?, 'common.address', 'address', 1)
        `);

        linkAddress.run(storeId, addressId);

        // Link hours to store
        const linkHours = db.prepare(`
          INSERT INTO stores_cmps (
            entity_id, cmp_id, component_type, field, "order"
          ) VALUES (?, ?, 'common.hours', 'hours', 1)
        `);

        linkHours.run(storeId, hoursId);

        // Create service components
        for (let i = 0; i < store.services.length; i++) {
          const service = store.services[i];

          const insertService = db.prepare(`
            INSERT INTO components_store_service_tags (
              name, is_active
            ) VALUES (?, ?)
          `);

          const serviceResult = insertService.run(
            service.name,
            service.is_active ? 1 : 0
          );

          const serviceId = serviceResult.lastInsertRowid;

          // Link service to store
          const linkService = db.prepare(`
            INSERT INTO stores_cmps (
              entity_id, cmp_id, component_type, field, "order"
            ) VALUES (?, ?, 'store.service-tag', 'services', ?)
          `);

          linkService.run(storeId, serviceId, i + 1);
        }

        console.log(`   ✅ Created store with ID ${storeId}`);
        storesCreated++;

      } catch (error) {
        console.log(`   ❌ Failed to create ${store.name}: ${error.message}`);
      }
    }

    // Commit transaction
    db.exec('COMMIT');

    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Successfully created: ${storesCreated} stores`);
    console.log(`   ❌ Failed: ${stores.length - storesCreated} stores`);

    if (storesCreated > 0) {
      console.log('\n🎉 Stores have been imported directly into the database!');
      console.log('\n📋 Next steps:');
      console.log('   1. Refresh Strapi admin panel');
      console.log('   2. Go to Content Manager → Store');
      console.log('   3. You should see the imported stores');
      console.log('   4. Test the API endpoints');
    }

    db.close();

  } catch (error) {
    console.error('❌ Error during direct import:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Install better-sqlite3 if not available
try {
  require('better-sqlite3');
  directDatabaseImport().catch(console.error);
} catch (e) {
  console.log('📦 Installing better-sqlite3...');
  const { spawn } = require('child_process');
  const install = spawn('npm', ['install', 'better-sqlite3'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ better-sqlite3 installed, retrying...');
      delete require.cache[require.resolve('better-sqlite3')];
      directDatabaseImport().catch(console.error);
    } else {
      console.error('❌ Failed to install better-sqlite3');
    }
  });
}