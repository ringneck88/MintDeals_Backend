#!/usr/bin/env node

console.log('=================================');
console.log('Starting Strapi Production Server');
console.log('=================================\n');

// Log environment info
console.log('Environment Information:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('PORT:', process.env.PORT || 'not set');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set (hidden)' : 'NOT SET');
console.log('APP_KEYS:', process.env.APP_KEYS ? 'set (hidden)' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set (hidden)' : 'NOT SET');
console.log('\n');

// Set minimal required environment variables if missing
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log('⚠️  NODE_ENV not set, defaulting to production');
}

if (!process.env.APP_KEYS) {
  // Generate temporary keys for Railway
  const crypto = require('crypto');
  const key1 = crypto.randomBytes(16).toString('base64');
  const key2 = crypto.randomBytes(16).toString('base64');
  process.env.APP_KEYS = `${key1},${key2}`;
  console.log('⚠️  APP_KEYS not set, generating temporary keys');
  console.log('   Please set permanent APP_KEYS in Railway dashboard!');
}

if (!process.env.JWT_SECRET) {
  const crypto = require('crypto');
  process.env.JWT_SECRET = crypto.randomBytes(16).toString('base64');
  console.log('⚠️  JWT_SECRET not set, generating temporary secret');
  console.log('   Please set permanent JWT_SECRET in Railway dashboard!');
}

if (!process.env.API_TOKEN_SALT) {
  const crypto = require('crypto');
  process.env.API_TOKEN_SALT = crypto.randomBytes(16).toString('base64');
  console.log('⚠️  API_TOKEN_SALT not set, generating temporary salt');
}

if (!process.env.ADMIN_JWT_SECRET) {
  process.env.ADMIN_JWT_SECRET = process.env.JWT_SECRET;
  console.log('⚠️  ADMIN_JWT_SECRET not set, using JWT_SECRET');
}

if (!process.env.TRANSFER_TOKEN_SALT) {
  const crypto = require('crypto');
  process.env.TRANSFER_TOKEN_SALT = crypto.randomBytes(16).toString('base64');
  console.log('⚠️  TRANSFER_TOKEN_SALT not set, generating temporary salt');
}

// Check database configuration
if (!process.env.DATABASE_URL && !process.env.DATABASE_HOST) {
  console.error('\n❌ CRITICAL: No database configuration found!');
  console.error('   Railway should provide DATABASE_URL automatically.');
  console.error('   Please ensure you have added PostgreSQL to your Railway project.');

  // Use SQLite as fallback for initial deployment
  console.log('\n📦 Using SQLite as temporary database...');
  console.log('   Add PostgreSQL service in Railway for production use!');
}

// Check Cloudinary configuration
console.log('\nCloudinary Configuration:');
console.log('CLOUDINARY_NAME:', process.env.CLOUDINARY_NAME || 'NOT SET ❌');
console.log('CLOUDINARY_KEY:', process.env.CLOUDINARY_KEY ? `${process.env.CLOUDINARY_KEY.substring(0, 6)}... ✅` : 'NOT SET ❌');
console.log('CLOUDINARY_SECRET:', process.env.CLOUDINARY_SECRET ? `${process.env.CLOUDINARY_SECRET.substring(0, 6)}... ✅` : 'NOT SET ❌');

if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  console.error('\n❌ WARNING: Cloudinary is not fully configured!');
  console.error('   Image uploads will fail. Please set these in Railway:');
  if (!process.env.CLOUDINARY_NAME) console.error('   - CLOUDINARY_NAME');
  if (!process.env.CLOUDINARY_KEY) console.error('   - CLOUDINARY_KEY');
  if (!process.env.CLOUDINARY_SECRET) console.error('   - CLOUDINARY_SECRET');
} else {
  console.log('✅ Cloudinary appears to be configured correctly');
}

console.log('\n=================================');
console.log('Starting Strapi...');
console.log('=================================\n');

// Start Strapi directly
const strapi = require('@strapi/strapi');

async function startStrapi() {
  try {
    const app = await strapi.createStrapi();
    await app.start();
    console.log('✅ Strapi started successfully!');
  } catch (error) {
    console.error('❌ Failed to start Strapi:', error.message || error);
    process.exit(1);
  }
}

startStrapi();