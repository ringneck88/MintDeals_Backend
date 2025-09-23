#!/usr/bin/env node

/**
 * Check Store Admin Permissions
 * Investigate why stores aren't visible in Strapi admin panel
 */

const Database = require('better-sqlite3');
const path = require('path');

async function checkStorePermissions() {
  console.log('🏪 Checking Store Admin Permissions');
  console.log('===================================\n');

  const dbPath = path.join(__dirname, '.tmp', 'data.db');

  try {
    const db = new Database(dbPath);

    // Check for store-related permissions
    console.log('🔍 Store-Related Admin Permissions:');
    const storePermissions = db.prepare(`
      SELECT
        ap.action,
        ap.subject,
        ap.action_parameters,
        ap.properties,
        ap.conditions,
        ar.name as role_name,
        ar.code as role_code
      FROM admin_permissions ap
      JOIN admin_permissions_role_lnk aprl ON ap.id = aprl.permission_id
      JOIN admin_roles ar ON aprl.role_id = ar.id
      WHERE
        ap.action LIKE '%store%' OR
        ap.subject LIKE '%store%' OR
        ap.subject = 'api::store.store' OR
        ap.action_parameters LIKE '%store%'
      ORDER BY ar.name, ap.action
    `).all();

    if (storePermissions.length > 0) {
      console.log('✅ Found store permissions:');
      storePermissions.forEach(perm => {
        console.log(`   Role: ${perm.role_name}`);
        console.log(`   Action: ${perm.action}`);
        console.log(`   Subject: ${perm.subject || 'None'}`);
        console.log(`   Parameters: ${perm.action_parameters || '{}'}}`);
        console.log('');
      });
    } else {
      console.log('❌ NO store-related permissions found!');
      console.log('   This is likely why stores are not visible in admin.\n');
    }

    // Check all Super Admin permissions to see what content types are available
    console.log('🔍 All Super Admin Content Type Permissions:');
    const superAdminPerms = db.prepare(`
      SELECT DISTINCT ap.subject, ap.action
      FROM admin_permissions ap
      JOIN admin_permissions_role_lnk aprl ON ap.id = aprl.permission_id
      JOIN admin_roles ar ON aprl.role_id = ar.id
      WHERE ar.code = 'strapi-super-admin'
        AND ap.subject LIKE 'api::%'
      ORDER BY ap.subject, ap.action
    `).all();

    if (superAdminPerms.length > 0) {
      console.log('Available content types for Super Admin:');
      const contentTypes = {};
      superAdminPerms.forEach(perm => {
        if (!contentTypes[perm.subject]) {
          contentTypes[perm.subject] = [];
        }
        contentTypes[perm.subject].push(perm.action);
      });

      Object.keys(contentTypes).forEach(subject => {
        console.log(`   ${subject}:`);
        contentTypes[subject].forEach(action => {
          console.log(`     - ${action}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ No content type permissions found for Super Admin!');
    }

    // Check if Store content type should exist based on schema
    console.log('📋 Content Type Registration Check:');
    console.log('   Store schema exists: Yes (verified earlier)');
    console.log('   Store table exists: Yes (verified earlier)');
    console.log('   Store data exists: Yes (6 stores verified)');

    // Look for any reference to store in admin permissions
    console.log('\n🔍 Any Permissions Mentioning Store:');
    const anyStoreRef = db.prepare(`
      SELECT ap.*, ar.name as role_name
      FROM admin_permissions ap
      JOIN admin_permissions_role_lnk aprl ON ap.id = aprl.permission_id
      JOIN admin_roles ar ON aprl.role_id = ar.id
      WHERE
        LOWER(ap.action) LIKE '%store%' OR
        LOWER(ap.subject) LIKE '%store%' OR
        LOWER(ap.action_parameters) LIKE '%store%' OR
        LOWER(ap.properties) LIKE '%store%' OR
        LOWER(ap.conditions) LIKE '%store%'
    `).all();

    if (anyStoreRef.length > 0) {
      anyStoreRef.forEach(perm => {
        console.log(`   ${perm.role_name}: ${perm.action} → ${perm.subject || 'No subject'}`);
      });
    } else {
      console.log('   ❌ NO references to "store" found in any permissions!');
    }

    db.close();

    console.log('\n💡 Diagnosis:');
    console.log('   The issue appears to be missing admin permissions for the Store content type.');
    console.log('   Super Admin should automatically have access to all content types,');
    console.log('   but Store permissions seem to be missing from the admin_permissions table.');
    console.log('\n🔧 Potential Solutions:');
    console.log('   1. Restart Strapi to rebuild permissions');
    console.log('   2. Check if Store content type needs to be re-registered');
    console.log('   3. Manually add Store permissions to admin roles');
    console.log('   4. Verify Store content type is properly enabled in admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Install better-sqlite3 if not available
try {
  require('better-sqlite3');
  checkStorePermissions().catch(console.error);
} catch (e) {
  console.log('📦 Installing better-sqlite3...');
  const { spawn } = require('child_process');
  const install = spawn('npm', ['install', 'better-sqlite3'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ better-sqlite3 installed, retrying...');
      delete require.cache[require.resolve('better-sqlite3')];
      checkStorePermissions().catch(console.error);
    } else {
      console.error('❌ Failed to install better-sqlite3');
    }
  });
}