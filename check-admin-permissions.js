#!/usr/bin/env node

/**
 * Check Admin Role Permissions
 * Investigate why stores aren't visible in Strapi admin panel
 */

const Database = require('better-sqlite3');
const path = require('path');

async function checkAdminPermissions() {
  console.log('🔍 Checking Admin Role Permissions');
  console.log('================================\n');

  const dbPath = path.join(__dirname, '.tmp', 'data.db');

  try {
    const db = new Database(dbPath);

    // Check admin roles
    console.log('👑 Admin Roles:');
    const adminRoles = db.prepare(`
      SELECT * FROM admin_roles ORDER BY id
    `).all();

    adminRoles.forEach(role => {
      console.log(`   - ${role.name} (ID: ${role.id})`);
      console.log(`     Code: ${role.code}`);
      console.log(`     Description: ${role.description || 'None'}`);
      console.log('');
    });

    // Check admin permissions
    console.log('🔐 Admin Permissions:');
    const adminPermissions = db.prepare(`
      SELECT ap.*, ar.name as role_name
      FROM admin_permissions ap
      LEFT JOIN admin_roles ar ON ap.role_id = ar.id
      WHERE ap.action_parameters LIKE '%store%' OR ap.subject LIKE '%store%'
      ORDER BY ap.role_id, ap.action
    `).all();

    if (adminPermissions.length > 0) {
      adminPermissions.forEach(perm => {
        console.log(`   Role: ${perm.role_name}`);
        console.log(`   Subject: ${perm.subject}`);
        console.log(`   Action: ${perm.action}`);
        console.log(`   Properties: ${perm.properties || 'None'}`);
        console.log(`   Conditions: ${perm.conditions || 'None'}`);
        console.log('');
      });
    } else {
      console.log('   ❌ No store-related admin permissions found!');
    }

    // Check all admin permissions to see what's available
    console.log('📋 All Admin Permissions by Role:');
    const allPermissions = db.prepare(`
      SELECT ar.name as role_name, COUNT(ap.id) as permission_count,
             GROUP_CONCAT(DISTINCT ap.subject) as subjects
      FROM admin_roles ar
      LEFT JOIN admin_permissions ap ON ar.id = ap.role_id
      GROUP BY ar.id, ar.name
      ORDER BY ar.id
    `).all();

    allPermissions.forEach(rolePerms => {
      console.log(`   ${rolePerms.role_name}: ${rolePerms.permission_count} permissions`);
      if (rolePerms.subjects) {
        const subjects = rolePerms.subjects.split(',').filter(s => s.trim());
        console.log(`     Subjects: ${subjects.join(', ')}`);
      }
      console.log('');
    });

    // Check admin users and their roles
    console.log('👤 Admin Users:');
    const adminUsers = db.prepare(`
      SELECT au.*, GROUP_CONCAT(ar.name) as role_names
      FROM admin_users au
      LEFT JOIN admin_users_roles_lnk aurl ON au.id = aurl.user_id
      LEFT JOIN admin_roles ar ON aurl.role_id = ar.id
      GROUP BY au.id
      ORDER BY au.id
    `).all();

    adminUsers.forEach(user => {
      console.log(`   ${user.firstname} ${user.lastname} (${user.email})`);
      console.log(`   Roles: ${user.role_names || 'No roles assigned!'}`);
      console.log(`   Active: ${user.is_active ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Check content types registration
    console.log('📝 Content Types in Admin:');
    const contentTypes = db.prepare(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name LIKE '%stores%'
      ORDER BY name
    `).all();

    console.log('   Database tables related to stores:');
    contentTypes.forEach(table => {
      console.log(`     - ${table.name}`);
    });

    db.close();

    console.log('\n💡 Diagnosis:');
    console.log('   1. Check if admin user has proper role assignments');
    console.log('   2. Verify store content type permissions exist');
    console.log('   3. Check if store content type is properly registered');
    console.log('   4. Access admin panel: http://localhost:1337/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Install better-sqlite3 if not available
try {
  require('better-sqlite3');
  checkAdminPermissions().catch(console.error);
} catch (e) {
  console.log('📦 Installing better-sqlite3...');
  const { spawn } = require('child_process');
  const install = spawn('npm', ['install', 'better-sqlite3'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ better-sqlite3 installed, retrying...');
      delete require.cache[require.resolve('better-sqlite3')];
      checkAdminPermissions().catch(console.error);
    } else {
      console.error('❌ Failed to install better-sqlite3');
    }
  });
}