#!/usr/bin/env node

/**
 * Create Test Store via Admin API
 * Create a simple store to test admin panel visibility
 */

const Database = require('better-sqlite3');
const path = require('path');

async function createTestStore() {
  console.log('🧪 Creating Test Store');
  console.log('====================\n');

  const dbPath = path.join(__dirname, '.tmp', 'data.db');

  try {
    const db = new Database(dbPath);

    // Generate unique IDs
    const now = Date.now();
    const testStoreDocumentId = require('crypto').randomBytes(12).toString('hex');

    console.log('📍 Creating simple test store...');

    // Create address component first
    const insertAddress = db.prepare(`
      INSERT INTO components_common_addresses (
        street_1, city, state, postal_code, country, formatted_address
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const addressResult = insertAddress.run(
      '123 Test Street',
      'Test City',
      'AZ',
      '12345',
      'US',
      '123 Test Street, Test City, AZ 12345'
    );

    const addressId = addressResult.lastInsertRowid;
    console.log(`   ✅ Created address component (ID: ${addressId})`);

    // Create test store
    const insertStore = db.prepare(`
      INSERT INTO stores (
        document_id, name, slug, phone, timezone, is_active,
        created_at, updated_at, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const storeResult = insertStore.run(
      testStoreDocumentId,
      'Test Store Admin Check',
      'test-store-admin-check',
      '(555) 123-4567',
      'America/Phoenix',
      1, // is_active = true
      now, now, now // created, updated, published
    );

    const storeId = storeResult.lastInsertRowid;
    console.log(`   ✅ Created test store (ID: ${storeId})`);

    // Link address to store
    const linkAddress = db.prepare(`
      INSERT INTO stores_cmps (
        entity_id, cmp_id, component_type, field, "order"
      ) VALUES (?, ?, 'common.address', 'address', 1)
    `);

    linkAddress.run(storeId, addressId);
    console.log(`   ✅ Linked address component`);

    db.close();

    console.log('\n🎉 Test store created successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Refresh the Strapi admin panel');
    console.log('   2. Go to Content Manager → Store');
    console.log('   3. Look for "Test Store Admin Check"');
    console.log('   4. If it appears, the issue was with the original data');
    console.log('   5. If it doesn\'t appear, there\'s a deeper admin panel issue');

  } catch (error) {
    console.error('❌ Error creating test store:', error.message);
  }
}

// Install better-sqlite3 if not available
try {
  require('better-sqlite3');
  createTestStore().catch(console.error);
} catch (e) {
  console.log('📦 Installing better-sqlite3...');
  const { spawn } = require('child_process');
  const install = spawn('npm', ['install', 'better-sqlite3'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ better-sqlite3 installed, retrying...');
      delete require.cache[require.resolve('better-sqlite3')];
      createTestStore().catch(console.error);
    } else {
      console.error('❌ Failed to install better-sqlite3');
    }
  });
}