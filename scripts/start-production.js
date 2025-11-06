#!/usr/bin/env node

console.log('Starting Strapi Production Server...');

// Minimal environment check
const missingEnv = [];
if (!process.env.DATABASE_URL) missingEnv.push('DATABASE_URL');
if (!process.env.APP_KEYS) missingEnv.push('APP_KEYS');
if (!process.env.JWT_SECRET) missingEnv.push('JWT_SECRET');
if (missingEnv.length > 0) {
  console.warn('⚠️  Missing env vars:', missingEnv.join(', '));
}

// Set minimal required environment variables if missing
const crypto = require('crypto');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

if (!process.env.APP_KEYS) {
  const key1 = crypto.randomBytes(16).toString('base64');
  const key2 = crypto.randomBytes(16).toString('base64');
  process.env.APP_KEYS = `${key1},${key2}`;
  console.warn('⚠️  Generated temporary APP_KEYS');
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(16).toString('base64');
  console.warn('⚠️  Generated temporary JWT_SECRET');
}

if (!process.env.API_TOKEN_SALT) {
  process.env.API_TOKEN_SALT = crypto.randomBytes(16).toString('base64');
}

if (!process.env.ADMIN_JWT_SECRET) {
  process.env.ADMIN_JWT_SECRET = process.env.JWT_SECRET;
}

if (!process.env.TRANSFER_TOKEN_SALT) {
  process.env.TRANSFER_TOKEN_SALT = crypto.randomBytes(16).toString('base64');
}

// Check database configuration
if (!process.env.DATABASE_URL && !process.env.DATABASE_HOST) {
  console.error('❌ No database configuration found! Using SQLite fallback.');
}

// Check Cloudinary configuration (minimal logging)
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  console.error('❌ WARNING: Cloudinary is not fully configured!');
  if (!process.env.CLOUDINARY_NAME) console.error('   - CLOUDINARY_NAME missing');
  if (!process.env.CLOUDINARY_KEY) console.error('   - CLOUDINARY_KEY missing');
  if (!process.env.CLOUDINARY_SECRET) console.error('   - CLOUDINARY_SECRET missing');
} else {
  console.log('✅ Cloudinary configured');
}

console.log('Starting Strapi...');

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