#!/usr/bin/env node

const requiredEnvVars = {
  production: [
    'DATABASE_URL',
    'APP_KEYS',
    'JWT_SECRET',
    'NODE_ENV',
  ],
  development: [
    'JWT_SECRET',
  ],
};

const optionalEnvVars = [
  'CLOUDINARY_NAME',
  'CLOUDINARY_KEY',
  'CLOUDINARY_SECRET',
  'API_TOKEN_SALT',
  'ADMIN_JWT_SECRET',
  'TRANSFER_TOKEN_SALT',
];

const env = process.env.NODE_ENV || 'development';
console.log(`Checking environment variables for ${env} environment...`);

const requiredVars = requiredEnvVars[env] || requiredEnvVars.development;
const missing = [];
const warnings = [];

// Check required variables
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    missing.push(varName);
  }
});

// Check optional variables
optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    warnings.push(varName);
  }
});

// Special check for APP_KEYS format
if (process.env.APP_KEYS) {
  const keys = process.env.APP_KEYS.split(',');
  if (keys.length < 2) {
    console.warn('⚠️  APP_KEYS should contain at least 2 comma-separated keys');
  }
}

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(varName => {
    console.error(`   - ${varName}`);
  });

  console.error('\n📝 To fix this on Railway:');
  console.error('1. Go to your Railway project dashboard');
  console.error('2. Navigate to Variables section');
  console.error('3. Add the missing variables');

  if (missing.includes('DATABASE_URL')) {
    console.error('\n💡 DATABASE_URL: Railway provides this automatically when you add PostgreSQL service');
  }

  if (missing.includes('APP_KEYS')) {
    console.error('\n💡 APP_KEYS: Generate secure keys with:');
    console.error('   node -e "console.log(require(\'crypto\').randomBytes(16).toString(\'base64\'))"');
    console.error('   Add at least 2 keys separated by commas: key1,key2');
  }

  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('\n⚠️  Missing optional environment variables (app may work without these):');
  warnings.forEach(varName => {
    console.warn(`   - ${varName}`);
  });
}

console.log('✅ All required environment variables are set');
process.exit(0);