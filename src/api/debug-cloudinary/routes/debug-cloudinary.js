module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/debug-cloudinary',
      handler: 'debug-cloudinary.check',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};