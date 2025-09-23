#!/usr/bin/env node

/**
 * Detailed Store Data Check
 * Check store data structure and required field compliance
 */

const Database = require('better-sqlite3');
const path = require('path');

async function detailedStoreCheck() {
  console.log('🔍 Detailed Store Data Check');
  console.log('============================\n');

  const dbPath = path.join(__dirname, '.tmp', 'data.db');

  try {
    const db = new Database(dbPath);

    // Get detailed store information
    console.log('📋 Checking store data structure...');
    const stores = db.prepare(`
      SELECT
        s.*,
        GROUP_CONCAT(sc.component_type) as component_types,
        GROUP_CONCAT(sc.field) as component_fields
      FROM stores s
      LEFT JOIN stores_cmps sc ON s.id = sc.entity_id
      GROUP BY s.id
      ORDER BY s.id
    `).all();

    console.log(`Found ${stores.length} stores:\n`);

    stores.forEach((store, index) => {
      console.log(`${index + 1}. Store ID ${store.id}: "${store.name}"`);
      console.log(`   Document ID: ${store.document_id}`);
      console.log(`   Slug: ${store.slug || 'MISSING'}`);
      console.log(`   Published: ${store.published_at ? 'Yes' : 'No'}`);
      console.log(`   Created: ${new Date(store.created_at).toLocaleString()}`);
      console.log(`   Updated: ${new Date(store.updated_at).toLocaleString()}`);

      if (store.component_types) {
        console.log(`   Components: ${store.component_types}`);
        console.log(`   Fields: ${store.component_fields}`);
      } else {
        console.log(`   ⚠️  NO COMPONENTS LINKED`);
      }

      // Check for required fields
      const requiredFields = ['name', 'slug'];
      const missingFields = requiredFields.filter(field => !store[field]);
      if (missingFields.length > 0) {
        console.log(`   ❌ Missing required fields: ${missingFields.join(', ')}`);
      } else {
        console.log(`   ✅ All required scalar fields present`);
      }

      console.log('');
    });

    // Check for required component - address
    console.log('🔍 Checking address component requirement...');

    const storesWithoutAddress = db.prepare(`
      SELECT s.id, s.name
      FROM stores s
      LEFT JOIN stores_cmps sc ON s.id = sc.entity_id AND sc.component_type = 'common.address'
      WHERE sc.id IS NULL
    `).all();

    if (storesWithoutAddress.length > 0) {
      console.log('❌ Stores missing REQUIRED address component:');
      storesWithoutAddress.forEach(store => {
        console.log(`   - ${store.name} (ID: ${store.id})`);
      });
    } else {
      console.log('✅ All stores have required address component');
    }

    // Check component data integrity
    console.log('\n🔗 Checking component data integrity...');

    const brokenComponents = db.prepare(`
      SELECT sc.*, s.name as store_name
      FROM stores_cmps sc
      JOIN stores s ON s.id = sc.entity_id
      LEFT JOIN components_common_addresses ca ON sc.cmp_id = ca.id AND sc.component_type = 'common.address'
      LEFT JOIN components_common_hours ch ON sc.cmp_id = ch.id AND sc.component_type = 'common.hours'
      LEFT JOIN components_store_service_tags st ON sc.cmp_id = st.id AND sc.component_type = 'store.service-tag'
      WHERE
        (sc.component_type = 'common.address' AND ca.id IS NULL) OR
        (sc.component_type = 'common.hours' AND ch.id IS NULL) OR
        (sc.component_type = 'store.service-tag' AND st.id IS NULL)
    `).all();

    if (brokenComponents.length > 0) {
      console.log('❌ Broken component links found:');
      brokenComponents.forEach(comp => {
        console.log(`   - ${comp.store_name}: ${comp.component_type} → component ID ${comp.cmp_id} (MISSING)`);
      });
    } else {
      console.log('✅ All component links are valid');
    }

    db.close();

    console.log('\n💡 Recommendations:');
    console.log('   1. Check if stores show up in admin at: http://localhost:1337/admin');
    console.log('   2. Navigate to Content Manager → Store');
    console.log('   3. If still not visible, the issue may be schema validation');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Install better-sqlite3 if not available
try {
  require('better-sqlite3');
  detailedStoreCheck().catch(console.error);
} catch (e) {
  console.log('📦 Installing better-sqlite3...');
  const { spawn } = require('child_process');
  const install = spawn('npm', ['install', 'better-sqlite3'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ better-sqlite3 installed, retrying...');
      delete require.cache[require.resolve('better-sqlite3')];
      detailedStoreCheck().catch(console.error);
    } else {
      console.error('❌ Failed to install better-sqlite3');
    }
  });
}