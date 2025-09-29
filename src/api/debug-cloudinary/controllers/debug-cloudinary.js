'use strict';

module.exports = {
  async check(ctx) {
    const uploadConfig = strapi.config.get('plugin.upload');

    // Don't expose secrets in production
    const isProduction = process.env.NODE_ENV === 'production';

    const debugInfo = {
      environment: process.env.NODE_ENV,
      provider: uploadConfig?.provider || 'not set',
      cloudinaryName: process.env.CLOUDINARY_NAME ?
        (isProduction ? 'Set (hidden)' : process.env.CLOUDINARY_NAME) :
        'NOT SET',
      cloudinaryKey: process.env.CLOUDINARY_KEY ?
        (isProduction ? 'Set (hidden)' : process.env.CLOUDINARY_KEY) :
        'NOT SET',
      cloudinarySecret: process.env.CLOUDINARY_SECRET ? 'Set (hidden)' : 'NOT SET',
      configCheck: {
        hasProvider: !!uploadConfig?.provider,
        hasCloudName: !!uploadConfig?.providerOptions?.cloud_name,
        hasApiKey: !!uploadConfig?.providerOptions?.api_key,
        hasApiSecret: !!uploadConfig?.providerOptions?.api_secret,
      },
      actualConfig: isProduction ? 'Hidden in production' : {
        cloud_name: uploadConfig?.providerOptions?.cloud_name,
        api_key: uploadConfig?.providerOptions?.api_key?.substring(0, 5) + '***',
      }
    };

    // Test actual Cloudinary connection
    try {
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
      });

      await cloudinary.api.ping();
      debugInfo.connectionTest = 'SUCCESS - Cloudinary API is accessible';
    } catch (error) {
      debugInfo.connectionTest = `FAILED - ${error.message}`;
    }

    ctx.body = debugInfo;
  },
};