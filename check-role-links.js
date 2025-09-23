#!/usr/bin/env node

/**
 * Check role-permission relationship tables
 */

const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');

console.log('🔍 Checking role-permission relationships...\n');

try {
  const Database = require('better-sqlite3');
  const db = new Database(dbPath, { readonly: true });

  // List all tables
  console.log('📋 All tables in database:');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  tables.forEach(table => {
    if (table.name.includes('permission') || table.name.includes('role')) {
      console.log(`  🔗 ${table.name}`);
    } else {
      console.log(`    ${table.name}`);
    }
  });

  // Check role permission link table
  const linkTables = tables.filter(t => t.name.includes('permissions_role') || t.name.includes('up_permissions'));

  console.log('\n🔗 Permission-related tables:');
  linkTables.forEach(table => {
    console.log(`\n📋 Table: ${table.name}`);
    try {
      const structure = db.prepare(`PRAGMA table_info(${table.name})`).all();
      structure.forEach(col => {
        console.log(`  ${col.name}: ${col.type}`);
      });

      // Show sample data
      const sampleData = db.prepare(`SELECT * FROM ${table.name} LIMIT 3`).all();
      if (sampleData.length > 0) {
        console.log('  Sample data:');
        sampleData.forEach(row => {
          console.log(`    ${JSON.stringify(row)}`);
        });
      }
    } catch (e) {
      console.log(`  Error reading table: ${e.message}`);
    }
  });

  db.close();

} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}