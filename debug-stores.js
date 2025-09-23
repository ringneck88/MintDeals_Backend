#!/usr/bin/env node

/**
 * Debug Store Visibility Issues
 * Check if stores exist in database and why they might not appear in CMS
 */

const Database = require('better-sqlite3');
const path = require('path');

async function debugStores() {
  console.log('🔍 Debugging Store Visibility');
  console.log('============================\n');

  const dbPath = path.join(__dirname, '.tmp', 'data.db');

  try {
    const db = new Database(dbPath);

    // Check if stores exist
    console.log('📋 Checking stores in database...');
    const stores = db.prepare(`
      SELECT * FROM stores ORDER BY id
    `).all();

    console.log(`Found ${stores.length} stores:`);
    stores.forEach(store => {
      console.log(`   ${store.id}: ${store.name}`);
      console.log(`      Document ID: ${store.document_id}`);
      console.log(`      Published: ${store.published_at ? 'Yes' : 'No'}`);
      console.log(`      Created: ${new Date(store.created_at).toLocaleString()}`);
      console.log('');
    });

    // Check components linking
    console.log('🔗 Checking component relationships...');
    const components = db.prepare(`
      SELECT sc.*, ca.street_1, ca.city, ch.timezone
      FROM stores_cmps sc
      LEFT JOIN components_common_addresses ca ON sc.cmp_id = ca.id AND sc.component_type = 'common.address'
      LEFT JOIN components_common_hours ch ON sc.cmp_id = ch.id AND sc.component_type = 'common.hours'
      WHERE sc.entity_id IN (9, 10, 11)
      ORDER BY sc.entity_id, sc.field
    `).all();

    console.log(`Found ${components.length} component relationships:`);
    components.forEach(comp => {
      console.log(`   Store ${comp.entity_id} → ${comp.field} (${comp.component_type})`);
      if (comp.street_1) console.log(`      Address: ${comp.street_1}, ${comp.city}`);
      if (comp.timezone) console.log(`      Hours: ${comp.timezone}`);
    });

    // Check if there are missing required fields that might prevent CMS display
    console.log('\n🔍 Checking for potential CMS issues...');

    // Check for missing slug field (required by schema)
    const storesWithoutSlug = db.prepare(`
      SELECT id, name FROM stores WHERE slug IS NULL OR slug = ''
    `).all();

    if (storesWithoutSlug.length > 0) {
      console.log('⚠️  Stores missing slug field:');
      storesWithoutSlug.forEach(store => {
        console.log(`   ${store.id}: ${store.name}`);
      });
    } else {
      console.log('✅ All stores have slug field');
    }

    // Check document_id format
    console.log('\n📄 Document ID analysis:');
    stores.forEach(store => {
      const docIdLength = store.document_id ? store.document_id.length : 0;
      console.log(`   ${store.name}: ${store.document_id} (${docIdLength} chars)`);
    });

    db.close();

    console.log('\n💡 Possible solutions:');
    console.log('   1. Add missing slug values');
    console.log('   2. Ensure all required schema fields are populated');
    console.log('   3. Restart Strapi to refresh content type recognition');
    console.log('   4. Check if schema was modified after import');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Install better-sqlite3 if not available
try {
  require('better-sqlite3');
  debugStores().catch(console.error);
} catch (e) {
  console.log('📦 Installing better-sqlite3...');
  const { spawn } = require('child_process');
  const install = spawn('npm', ['install', 'better-sqlite3'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ better-sqlite3 installed, retrying...');
      delete require.cache[require.resolve('better-sqlite3')];
      debugStores().catch(console.error);
    } else {
      console.error('❌ Failed to install better-sqlite3');
    }
  });
}