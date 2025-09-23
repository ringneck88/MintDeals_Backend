#!/usr/bin/env node

/**
 * Check database structure for permissions
 */

const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');

console.log('🔍 Checking database structure...\n');

try {
  const Database = require('better-sqlite3');
  const db = new Database(dbPath, { readonly: true });

  // Check up_permissions table structure
  console.log('📋 up_permissions table structure:');
  const permTableInfo = db.prepare("PRAGMA table_info(up_permissions)").all();
  permTableInfo.forEach(col => {
    console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });

  // Check up_roles table
  console.log('\n👥 up_roles table:');
  const roles = db.prepare("SELECT * FROM up_roles").all();
  roles.forEach(role => {
    console.log(`  ID: ${role.id}, Type: ${role.type}, Name: ${role.name}`);
  });

  // Check existing permissions
  console.log('\n🔐 Existing permissions:');
  const permissions = db.prepare("SELECT * FROM up_permissions LIMIT 5").all();
  permissions.forEach(perm => {
    console.log(`  Action: ${perm.action}, Role: ${perm.role || 'N/A'}`);
  });

  // Look for store-related permissions
  console.log('\n🏪 Store-related permissions:');
  const storePerms = db.prepare("SELECT * FROM up_permissions WHERE action LIKE '%store%'").all();
  if (storePerms.length === 0) {
    console.log('  None found');
  } else {
    storePerms.forEach(perm => {
      console.log(`  Action: ${perm.action}, Role: ${perm.role}`);
    });
  }

  db.close();

} catch (error) {
  console.log(`❌ Error: ${error.message}`);
  console.log('💡 Try: npm install better-sqlite3');
}