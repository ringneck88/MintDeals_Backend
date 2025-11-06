module.exports = ({ env }) => {
  // Generate default keys for development/fallback
  const defaultKeys = [
    'toBeModified1',
    'toBeModified2',
  ];

  // Ensure we have APP_KEYS or use defaults
  const appKeys = env.array('APP_KEYS') || defaultKeys;

  if (env('NODE_ENV') === 'production' && (!appKeys || appKeys.length === 0 || appKeys[0] === 'toBeModified1')) {
    console.error('⚠️  APP_KEYS not configured for production!');
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: appKeys,
    },
    // Disable unnecessary logging for production
    logger: {
      level: env('NODE_ENV') === 'production' ? 'error' : 'debug',
    },
    webhooks: {
      populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
    },
    transfer: {
      remote: {
        enabled: true,
      },
    },
  };
};