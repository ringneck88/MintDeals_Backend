module.exports = ({ env }) => {
  // Check if DATABASE_URL exists (Railway provides this)
  const databaseUrl = env('DATABASE_URL');

  if (databaseUrl) {
    // Parse DATABASE_URL for PostgreSQL
    try {
      const url = new URL(databaseUrl);
      return {
        connection: {
          client: 'postgres',
          connection: {
            host: url.hostname,
            port: parseInt(url.port, 10) || 5432,
            database: url.pathname.slice(1),
            user: url.username,
            password: url.password,
            ssl: {
              rejectUnauthorized: false,
            },
          },
          debug: false,
        },
      };
    } catch (error) {
      console.error('Error parsing DATABASE_URL:', error.message);
    }
  }

  // Fallback to SQLite for development or if no DATABASE_URL
  if (env('NODE_ENV') === 'production' && !databaseUrl) {
    console.warn('⚠️  No DATABASE_URL found, using SQLite (not recommended for production)');
  }

  return {
    connection: {
      client: env('DATABASE_CLIENT', 'sqlite'),
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
      debug: false,
    },
  };
};