'use strict';

const { Client } = require('pg');

module.exports = {
  async getProductDiscounts(ctx) {
    let client;
    try {
      const { dutchie_store_id } = ctx.query;

      // Connect to postgres database (not railway database)
      // Use the same host/credentials but different database name
      const dbConfig = strapi.config.get('database.connection.connection');

      client = new Client({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: 'postgres', // Connect to postgres database instead of railway
        ssl: dbConfig.ssl,
      });

      await client.connect();

      let query = `SELECT * FROM product_discounts`;
      const params = [];

      if (dutchie_store_id) {
        query += ` WHERE dutchie_store_id = $1`;
        params.push(dutchie_store_id);
      }

      query += ` ORDER BY created_at DESC LIMIT 1000`;

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
