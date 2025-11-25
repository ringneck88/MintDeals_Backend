'use strict';

module.exports = {
  async getProductDiscounts(ctx) {
    try {
      const { dutchie_store_id } = ctx.query;

      // Direct SQL query to product_discounts table
      const knex = strapi.db.connection;

      let query = `SELECT * FROM product_discounts`;
      const params = [];

      if (dutchie_store_id) {
        query += ` WHERE dutchie_store_id = ?`;
        params.push(dutchie_store_id);
      }

      query += ` ORDER BY created_at DESC`;

      const results = await knex.raw(query, params);
      const rows = results.rows || results[0] || [];

      ctx.send({
        data: rows,
        meta: { total: rows.length }
      });

    } catch (error) {
      console.error('Error fetching product discounts:', error);
      ctx.throw(500, error);
    }
  },
};
