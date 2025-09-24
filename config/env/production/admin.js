module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', env('JWT_SECRET', 'fallback-jwt-secret')),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'fallback-api-token-salt'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'fallback-transfer-token-salt'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});