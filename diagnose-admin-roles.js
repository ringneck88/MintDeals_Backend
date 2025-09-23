#!/usr/bin/env node

/**
 * Diagnose Admin Roles Issue
 * Check why admin roles are not showing up in the admin panel
 */

const Database = require('better-sqlite3');
const path = require('path');

async function diagnoseAdminRoles() {
  console.log('🔍 Diagnosing Admin Roles Issue');
  console.log('=================================\n');

  const dbPath = path.join(__dirname, '.tmp', 'data.db');

  try {
    const db = new Database(dbPath);

    // Check admin roles table
    console.log('👑 Admin Roles:');
    const adminRoles = db.prepare(`
      SELECT * FROM admin_roles ORDER BY id
    `).all();

    if (adminRoles.length === 0) {
      console.log('   ❌ NO ADMIN ROLES FOUND!');
      console.log('   This is likely why roles are not showing up.');
    } else {
      adminRoles.forEach(role => {
        console.log(`   ${role.id}: ${role.name}`);
        console.log(`      Code: ${role.code}`);
        console.log(`      Description: ${role.description || 'None'}`);
        console.log(`      Created: ${new Date(role.created_at).toLocaleString()}`);
        console.log(`      Published: ${role.published_at ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    // Check admin users
    console.log('👤 Admin Users:');
    const adminUsers = db.prepare(`
      SELECT * FROM admin_users ORDER BY id
    `).all();

    if (adminUsers.length === 0) {
      console.log('   ❌ NO ADMIN USERS FOUND!');
    } else {
      adminUsers.forEach(user => {
        console.log(`   ${user.id}: ${user.firstname} ${user.lastname} (${user.email})`);
        console.log(`      Active: ${user.is_active ? 'Yes' : 'No'}`);
        console.log(`      Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log('');
      });
    }

    // Check user-role relationships
    console.log('🔗 User-Role Relationships:');
    const userRoles = db.prepare(`
      SELECT
        au.email,
        ar.name as role_name,
        ar.code as role_code
      FROM admin_users_roles_lnk aurl
      JOIN admin_users au ON aurl.user_id = au.id
      JOIN admin_roles ar ON aurl.role_id = ar.id
      ORDER BY au.email
    `).all();

    if (userRoles.length === 0) {
      console.log('   ❌ NO USER-ROLE RELATIONSHIPS FOUND!');
      console.log('   Users may not be assigned to any roles.');
    } else {
      userRoles.forEach(ur => {
        console.log(`   ${ur.email} → ${ur.role_name} (${ur.role_code})`);
      });
    }

    // Check admin permissions structure
    console.log('\n🔐 Admin Permissions Summary:');
    const permissionCount = db.prepare(`
      SELECT COUNT(*) as count FROM admin_permissions
    `).get();

    console.log(`   Total admin permissions: ${permissionCount.count}`);

    const rolePermissions = db.prepare(`
      SELECT
        ar.name as role_name,
        COUNT(aprl.permission_id) as permission_count
      FROM admin_roles ar
      LEFT JOIN admin_permissions_role_lnk aprl ON ar.id = aprl.role_id
      GROUP BY ar.id, ar.name
      ORDER BY ar.id
    `).all();

    rolePermissions.forEach(rp => {
      console.log(`   ${rp.role_name}: ${rp.permission_count} permissions`);
    });

    // Check for bootstrap/seeding issues
    console.log('\n🌱 Bootstrap Status:');

    // Check if roles have document_id (Strapi v5 requirement)
    const rolesWithoutDocId = db.prepare(`
      SELECT COUNT(*) as count FROM admin_roles WHERE document_id IS NULL OR document_id = ''
    `).get();

    if (rolesWithoutDocId.count > 0) {
      console.log(`   ⚠️  ${rolesWithoutDocId.count} roles missing document_id (Strapi v5 issue)`);
    } else {
      console.log('   ✅ All roles have document_id');
    }

    // Check for duplicate or malformed roles
    const duplicateRoles = db.prepare(`
      SELECT code, COUNT(*) as count
      FROM admin_roles
      GROUP BY code
      HAVING COUNT(*) > 1
    `).all();

    if (duplicateRoles.length > 0) {
      console.log('   ⚠️  Duplicate role codes found:');
      duplicateRoles.forEach(dup => {
        console.log(`      - ${dup.code}: ${dup.count} entries`);
      });
    } else {
      console.log('   ✅ No duplicate role codes');
    }

    db.close();

    console.log('\n💡 Potential Issues & Solutions:');

    if (adminRoles.length === 0) {
      console.log('   🔧 CRITICAL: No admin roles exist');
      console.log('      - Strapi may not have completed initial bootstrap');
      console.log('      - Consider running: npx strapi admin:reset');
      console.log('      - Or restart Strapi to trigger role creation');
    }

    if (rolesWithoutDocId.count > 0) {
      console.log('   🔧 Strapi v5 compatibility issue');
      console.log('      - Admin roles missing document_id field');
      console.log('      - This can prevent proper role display');
    }

    if (userRoles.length === 0 && adminUsers.length > 0) {
      console.log('   🔧 Users exist but no role assignments');
      console.log('      - Users may need to be re-assigned to roles');
      console.log('      - Check admin panel user management');
    }

    console.log('\n📋 Next Steps:');
    console.log('   1. Check admin panel at: http://localhost:1337/admin');
    console.log('   2. Try logging in with existing admin credentials');
    console.log('   3. Navigate to Settings → Administration Panel → Roles');
    console.log('   4. If roles still not visible, consider admin reset');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Install better-sqlite3 if not available
try {
  require('better-sqlite3');
  diagnoseAdminRoles().catch(console.error);
} catch (e) {
  console.log('📦 Installing better-sqlite3...');
  const { spawn } = require('child_process');
  const install = spawn('npm', ['install', 'better-sqlite3'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ better-sqlite3 installed, retrying...');
      delete require.cache[require.resolve('better-sqlite3')];
      diagnoseAdminRoles().catch(console.error);
    } else {
      console.error('❌ Failed to install better-sqlite3');
    }
  });
}