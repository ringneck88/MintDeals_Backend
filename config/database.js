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

  // PostgreSQL configuration only
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'mintdeals_db'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD', ''),
        ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
      },
      debug: false,
    },
  };
};