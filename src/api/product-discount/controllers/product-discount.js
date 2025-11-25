'use strict';

const { Client } = require('pg');

module.exports = {
  // Diagnostic endpoint to check database contents
  async diagnostics(ctx) {
    const { database = 'railway' } = ctx.query; // Default to railway database
    let client;
    try {
      const postgresDatabaseUrl = process.env.POSTGRES_DATABASE_URL || process.env.DATABASE_URL;
      let connectionConfig;

      if (postgresDatabaseUrl) {
        const url = new URL(postgresDatabaseUrl);
        connectionConfig = {
          host: url.hostname,
          port: parseInt(url.port, 10) || 5432,
          database: database, // Use query parameter
          user: url.username,
          password: url.password,
          ssl: { rejectUnauthorized: false },
        };
      } else {
        const dbConfig = strapi.config.get('database.connection.connection');
        connectionConfig = {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: database, // Use query parameter
          ssl: dbConfig.ssl,
        };
      }

      client = new Client(connectionConfig);
      await client.connect();

      // Get all materialized views
      const matviewsResult = await client.query(`
        SELECT schemaname, matviewname
        FROM pg_matviews
        ORDER BY schemaname, matviewname
      `);

      // Get all tables
      const tablesResult = await client.query(`
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
        ORDER BY schemaname, tablename
      `);

      // Get all databases
      const databasesResult = await client.query(`
        SELECT datname FROM pg_database
        WHERE datistemplate = false
        ORDER BY datname
      `);

      ctx.body = {
        connectionInfo: {
          host: connectionConfig.host,
          port: connectionConfig.port,
          database: connectionConfig.database,
          user: connectionConfig.user,
        },
        databases: databasesResult.rows,
        materializedViews: matviewsResult.rows,
        tables: tablesResult.rows.slice(0, 20), // Limit to first 20 tables
      };
    } catch (error) {
      console.error('Diagnostics error:', error);
      ctx.status = 500;
      ctx.body = {
        error: 'Diagnostics failed',
        message: error.message,
        details: error.toString(),
      };
    } finally {
      if (client) {
        try {
          await client.end();
        } catch (e) {
          console.error('Error closing connection:', e);
        }
      }
    }
  },

  async getProductDiscounts(ctx) {
    let client;
    try {
      const { dutchie_store_id } = ctx.query;

      // Check for POSTGRES_DATABASE_URL first (for production)
      const postgresDatabaseUrl = process.env.POSTGRES_DATABASE_URL || process.env.DATABASE_URL;

      let connectionConfig;

      if (postgresDatabaseUrl) {
        // Parse the URL - use railway database (where materialized view exists)
        const url = new URL(postgresDatabaseUrl);
        connectionConfig = {
          host: url.hostname,
          port: parseInt(url.port, 10) || 5432,
          database: url.pathname.slice(1), // Use the database from URL (should be 'railway')
          user: url.username,
          password: url.password,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      } else {
        // Fallback to Strapi config (already uses correct database)
        const dbConfig = strapi.config.get('database.connection.connection');
        connectionConfig = {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.database,
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

      query += ` LIMIT 1000`;

      console.log('Executing query:', query, 'with params:', params);
      const result = await client.query(query, params);

      ctx.send({
        data: result.rows,
        meta: { total: result.rows.length }
      });

    } catch (error) {
      console.error('Error fetching product discounts:', error);

      // Return detailed error for debugging
      ctx.status = 500;
      ctx.body = {
        error: 'Failed to fetch product discounts',
        message: error.message,
        details: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      };
    } finally {
      if (client) {
        try {
          await client.end();
        } catch (endError) {
          console.error('Error closing database connection:', endError);
        }
      }
    }
  },
};
