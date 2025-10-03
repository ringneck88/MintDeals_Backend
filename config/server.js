module.exports = ({ env }) => {
  // Generate default keys for development/fallback
  const defaultKeys = [
    'toBeModified1',
    'toBeModified2',
  ];

  // Ensure we have APP_KEYS or use defaults
  const appKeys = env.array('APP_KEYS') || defaultKeys;

  if (env('NODE_ENV') === 'production' && (!appKeys || appKeys.length === 0 || appKeys[0] === 'toBeModified1')) {
    console.error('WARNING: APP_KEYS not properly configured for production!');
    console.error('Please set APP_KEYS environment variable with secure random keys.');
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: appKeys,
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