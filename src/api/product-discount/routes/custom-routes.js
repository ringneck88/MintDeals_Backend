module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/product-discounts/diagnostics',
      handler: 'product-discount.diagnostics',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/product-discounts',
      handler: 'product-discount.getProductDiscounts',
      config: {
        auth: false,
      },
    },
  ],
};
