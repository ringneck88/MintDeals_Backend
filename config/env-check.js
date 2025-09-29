module.exports = () => {
  const required = {
    // Cloudinary
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
    // Database (Railway provides DATABASE_URL)
    DATABASE_URL: process.env.DATABASE_URL,
    // Strapi Keys
    APP_KEYS: process.env.APP_KEYS,
    API_TOKEN_SALT: process.env.API_TOKEN_SALT,
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  console.log('=== Environment Variables Check ===');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');

  const missing = [];
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      missing.push(key);
      console.log(`❌ ${key}: MISSING`);
    } else {
      console.log(`✅ ${key}: Set`);
    }
  }

  if (missing.length > 0) {
    console.error('\n⚠️  Missing required environment variables:', missing.join(', '));
    console.error('Please set these in Railway dashboard or .env file');
  } else {
    console.log('\n✅ All required environment variables are set');
  }

  // Log Cloudinary config (without secrets)
  if (process.env.CLOUDINARY_NAME) {
    console.log('\nCloudinary Config:');
    console.log('  Cloud Name:', process.env.CLOUDINARY_NAME);
    console.log('  API Key:', process.env.CLOUDINARY_KEY ? `${process.env.CLOUDINARY_KEY.substring(0, 5)}...` : 'NOT SET');
  }

  return missing.length === 0;
};