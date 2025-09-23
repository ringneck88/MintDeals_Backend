const strapi = require('@strapi/strapi');

async function createAdminUser() {
  try {
    console.log('🔍 Checking for existing admin users...');
    
    // Initialize Strapi
    const app = await strapi().load();
    
    // Check if any admin users exist
    const adminUsers = await strapi.db.query('admin::user.user').findMany();
    console.log(`Found ${adminUsers.length} admin users`);
    
    if (adminUsers.length === 0) {
      console.log('📝 Creating first admin user...');
      
      // Create admin user
      const adminUser = await strapi.db.query('admin::user.user').create({
        data: {
          firstname: 'Admin',
          lastname: 'User',
          email: 'admin@flmintdeal.com',
          password: await strapi.admin.services.auth.hashPassword('FLMintDeal2024!'),
          isActive: true,
          blocked: false,
          roles: [1] // Super Admin role
        }
      });
      
      console.log('✅ Admin user created:', adminUser.email);
      console.log('🔑 Login credentials:');
      console.log('   Email: admin@flmintdeal.com');
      console.log('   Password: FLMintDeal2024!');
    } else {
      console.log('👤 Existing admin users:');
      adminUsers.forEach(user => {
        console.log(`   - ${user.firstname} ${user.lastname} (${user.email})`);
      });
      console.log('');
      console.log('💡 If you can\'t log in, the password might be from the old SQLite database.');
      console.log('   You can reset it in the admin panel or create a new admin user.');
    }
    
    await app.destroy();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();