module.exports = ({ env }) => {
  // Check if DATABASE_URL is provided (Railway provides this)
  const databaseUrl = env('DATABASE_URL');

  if (databaseUrl) {
    // Parse DATABASE_URL for PostgreSQL
    const url = new URL(databaseUrl);

    return {
      connection: {
        client: 'postgres',
        connection: {
          host: url.hostname,
          port: parseInt(url.port, 10),
          database: url.pathname.slice(1),
          user: url.username,
          password: url.password,
          ssl: {
            rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
          },
        },
        debug: false,
      },
    };
  }

  // Fallback to individual environment variables
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', true) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
        },
      },
      debug: false,
    },
  };
};