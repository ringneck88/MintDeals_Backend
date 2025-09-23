#!/usr/bin/env node

/**
 * Create Store API permissions using correct database structure
 */

const path = require('path');

const dbPath = path.join(__dirname, '.tmp', 'data.db');

console.log('🔧 Creating Store API permissions...\n');

try {
  const Database = require('better-sqlite3');
  const db = new Database(dbPath);

  // Get current max permission ID for new entries
  const maxPerm = db.prepare("SELECT MAX(id) as max_id FROM up_permissions").get();
  const maxLnk = db.prepare("SELECT MAX(id) as max_id FROM up_permissions_role_lnk").get();

  let nextPermId = (maxPerm.max_id || 0) + 1;
  let nextLnkId = (maxLnk.max_id || 0) + 1;

  console.log(`📊 Next permission ID: ${nextPermId}`);
  console.log(`📊 Next link ID: ${nextLnkId}`);

  // Define Store permissions to create
  const storePermissions = [
    'api::store.store.find',
    'api::store.store.findOne',
    'api::store.store.create'
  ];

  const publicRoleId = 2; // We know this from previous checks

  // Insert permissions and link them to public role
  const insertPermission = db.prepare(`
    INSERT INTO up_permissions (id, document_id, action, created_at, updated_at, published_at, created_by_id, updated_by_id, locale)
    VALUES (?, ?, ?, ?, ?, ?, null, null, null)
  `);

  const insertRoleLink = db.prepare(`
    INSERT INTO up_permissions_role_lnk (id, permission_id, role_id, permission_ord)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    let createdCount = 0;

    storePermissions.forEach((action, index) => {
      // Check if permission already exists
      const existing = db.prepare("SELECT id FROM up_permissions WHERE action = ?").get(action);

      if (existing) {
        console.log(`⏭️  Permission already exists: ${action} (ID: ${existing.id})`);

        // Check if it's linked to public role
        const existingLink = db.prepare("SELECT id FROM up_permissions_role_lnk WHERE permission_id = ? AND role_id = ?").get(existing.id, publicRoleId);

        if (!existingLink) {
          console.log(`🔗 Linking existing permission to public role...`);
          insertRoleLink.run(nextLnkId++, existing.id, publicRoleId, index + 1);
          createdCount++;
        } else {
          console.log(`✅ Permission already linked to public role`);
        }
      } else {
        // Create new permission
        const currentTime = Date.now();
        const documentId = `store_perm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log(`📝 Creating permission: ${action}`);
        insertPermission.run(nextPermId, documentId, action, currentTime, currentTime, currentTime);

        console.log(`🔗 Linking permission to public role...`);
        insertRoleLink.run(nextLnkId, nextPermId, publicRoleId, index + 1);

        nextPermId++;
        nextLnkId++;
        createdCount++;
      }
    });

    return createdCount;
  });

  const createdCount = transaction();

  console.log(`\n🎉 Successfully processed ${storePermissions.length} permissions`);
  console.log(`✨ Created/linked ${createdCount} permissions`);

  // Verify the permissions were created
  console.log('\n🔍 Verifying Store permissions:');
  const verification = db.prepare(`
    SELECT p.action, p.id, l.role_id
    FROM up_permissions p
    JOIN up_permissions_role_lnk l ON p.id = l.permission_id
    WHERE p.action LIKE '%store%' AND l.role_id = ?
  `).all(publicRoleId);

  if (verification.length > 0) {
    verification.forEach(perm => {
      console.log(`✅ ${perm.action} → Role ${perm.role_id}`);
    });
  } else {
    console.log('❌ No Store permissions found after creation');
  }

  db.close();

  console.log('\n🔄 Next steps:');
  console.log('1. Restart Strapi server');
  console.log('2. Test with: node scripts/direct-store-import.js');
  console.log('3. Check permissions in admin: http://localhost:1337/admin');

} catch (error) {
  console.log(`❌ Error: ${error.message}`);
  console.log('💡 Make sure Strapi is stopped before running this script');
}