module.exports = ({ env }) => ({
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    },
  },
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'FLMintDeals API',
        description: 'API documentation for FLMintDeals application',
        termsOfService: 'YOUR_TERMS_OF_SERVICE_URL',
        contact: {
          name: 'FLMintDeals Team',
          email: 'contact@flmintdeals.com',
          url: 'https://flmintdeal-frontend.fly.dev'
        },
        license: {
          name: 'Apache 2.0',
          url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        },
      },
      'x-strapi-config': {
        plugins: ['users-permissions', 'upload'],
        path: '/documentation',
      },
      servers: [
        {
          url: env('NODE_ENV') === 'development'
            ? 'https://flmintdeal-dev.fly.dev/api'
            : 'https://flmintdeal.fly.dev/api',
          description: env('NODE_ENV') === 'development' ? 'Development server' : 'Production server'
        }
      ],
      externalDocs: {
        description: 'Find out more',
        url: 'https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html'
      },
    }
  }
});