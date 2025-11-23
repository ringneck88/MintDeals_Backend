'use strict';

module.exports = {
  register({ strapi }) {
    // Check environment variables on startup
    console.log('=== Strapi Register Called ===');
    const envCheck = require('../config/env-check');
    const isValid = envCheck();

    if (!isValid && process.env.NODE_ENV === 'production') {
      strapi.log.warn('Missing required environment variables in production!');
    }
    console.log('=== Strapi Register Completed ===');
  },

  async bootstrap({ strapi }) {
    // Log successful Cloudinary configuration
    const uploadConfig = strapi.config.get('plugin.upload');

    if (uploadConfig?.provider === 'cloudinary') {
      strapi.log.info('Cloudinary provider configured');
      strapi.log.info(`Cloud name: ${uploadConfig.providerOptions?.cloud_name || 'NOT SET'}`);
    } else {
      strapi.log.warn(`Upload provider: ${uploadConfig?.provider || 'NOT SET'}`);
    }

    // Set up public permissions for API endpoints
    await setPublicPermissions(strapi);
  },
};

/**
 * Set public permissions for specified content types
 */
async function setPublicPermissions(strapi) {
  // Define which actions to enable for public role
  const publicPermissions = [
    // Inventory API
    { api: 'inventory', actions: ['find', 'findOne'] },
    // Discount API
    { api: 'discount', actions: ['find', 'findOne'] },
  ];

  // Get the public role
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('Public role not found, skipping permissions setup');
    return;
  }

  for (const { api, actions } of publicPermissions) {
    for (const action of actions) {
      const permissionAction = `api::${api}.${api}.${action}`;

      // Check if permission already exists
      const existingPermission = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({
          where: {
            action: permissionAction,
            role: publicRole.id,
          },
        });

      if (!existingPermission) {
        // Create the permission
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: permissionAction,
            role: publicRole.id,
          },
        });
        strapi.log.info(`Created public permission: ${permissionAction}`);
      }
    }
  }
}