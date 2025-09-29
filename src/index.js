'use strict';

module.exports = {
  register({ strapi }) {
    // Check environment variables on startup
    const envCheck = require('../config/env-check');
    const isValid = envCheck();

    if (!isValid && process.env.NODE_ENV === 'production') {
      strapi.log.warn('Missing required environment variables in production!');
    }
  },

  bootstrap({ strapi }) {
    // Log successful Cloudinary configuration
    const uploadConfig = strapi.config.get('plugin.upload');

    if (uploadConfig?.provider === 'cloudinary') {
      strapi.log.info('Cloudinary provider configured');
      strapi.log.info(`Cloud name: ${uploadConfig.providerOptions?.cloud_name || 'NOT SET'}`);
    } else {
      strapi.log.warn(`Upload provider: ${uploadConfig?.provider || 'NOT SET'}`);
    }
  },
};