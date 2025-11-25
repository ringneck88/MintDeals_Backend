'use strict';

const { Client } = require('pg');

module.exports = {
  async getProductDiscounts(ctx) {
    let client;
    try {
      const { dutchie_store_id } = ctx.query;

      // Check for POSTGRES_DATABASE_URL first (for production)
      const postgresDatabaseUrl = process.env.POSTGRES_DATABASE_URL || process.env.DATABASE_URL;

      let connectionConfig;

      if (postgresDatabaseUrl) {
        // Parse the URL and force database to 'postgres'
        const url = new URL(postgresDatabaseUrl);
        connectionConfig = {
          host: url.hostname,
          port: parseInt(url.port, 10) || 5432,
          database: 'postgres', // Force connection to postgres database
          user: url.username,
          password: url.password,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      } else {
        // Fallback to Strapi config but override database name
        const dbConfig = strapi.config.get('database.connection.connection');
        connectionConfig = {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: 'postgres', // Force connection to postgres database
          ssl: dbConfig.ssl,
        };
      }

      console.log('Connecting to database:', {
        host: connectionConfig.host,
        port: connectionConfig.port,
        user: connectionConfig.user,
        database: connectionConfig.database,
      });

      client = new Client(connectionConfig);

      await client.connect();
      console.log('Successfully connected to postgres database');

      // Check available materialized views for debugging
      const viewsResult = await client.query(`
        SELECT schemaname, matviewname
        FROM pg_matviews
        WHERE schemaname = 'public'
      `);
      console.log('Available materialized views:', viewsResult.rows);

      // Query the materialized view in the public schema
      let query = `SELECT * FROM public.product_discounts`;
      const params = [];

      if (dutchie_store_id) {
        query += ` WHERE dutchie_store_id = $1`;
        params.push(dutchie_store_id);
      }

      query += ` ORDER BY created_at DESC LIMIT 1000`;

      console.log('Executing query:', query, 'with params:', params);
      const result = await client.query(query, params);

      ctx.send({
        data: result.rows,
        meta: { total: result.rows.length }
      });

    } catch (error) {
      console.error('Error fetching product discounts:', error);
      ctx.throw(500, error);
    } finally {
      if (client) {
        await client.end();
      }
    }
  },
};
