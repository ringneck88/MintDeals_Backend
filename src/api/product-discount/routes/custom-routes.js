module.exports = {
  routes: [
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
