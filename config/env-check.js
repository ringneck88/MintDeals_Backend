module.exports = () => {
  const required = {
    // Cloudinary
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
    // Strapi Keys
    APP_KEYS: process.env.APP_KEYS,
    API_TOKEN_SALT: process.env.API_TOKEN_SALT,
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  // In development, check DATABASE_URL OR individual database vars
  if (process.env.NODE_ENV !== 'development') {
    required.DATABASE_URL = process.env.DATABASE_URL;
  }

  const missing = [];
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      missing.push(key);
    }
  }

  // Only log in development or if there are missing vars
  if (process.env.NODE_ENV === 'development') {
    console.log('=== Environment Variables Check ===');
    for (const [key, value] of Object.entries(required)) {
      console.log(`${value ? '✅' : '❌'} ${key}: ${value ? 'Set' : 'MISSING'}`);
    }
    console.log(missing.length === 0 ? '\n✅ All env vars set' : '\n⚠️  Missing:', missing.join(', '));
  } else if (missing.length > 0) {
    console.error('⚠️  Missing env vars:', missing.join(', '));
  }

  return missing.length === 0;
};