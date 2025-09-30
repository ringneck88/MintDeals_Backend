#!/usr/bin/env node

/**
 * Cloudinary Credentials Verification Script
 * Run this to verify your Cloudinary credentials are correct
 */

console.log('=================================');
console.log('Cloudinary Credentials Verification');
console.log('=================================\n');

// Check environment variables
const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET;

console.log('Checking environment variables...\n');

// Display what we have (partial for security)
console.log('CLOUDINARY_NAME:', cloudName || '❌ NOT SET');
console.log('CLOUDINARY_KEY:', apiKey ? `${apiKey.substring(0, 8)}... (${apiKey.length} chars)` : '❌ NOT SET');
console.log('CLOUDINARY_SECRET:', apiSecret ? `${apiSecret.substring(0, 8)}... (${apiSecret.length} chars)` : '❌ NOT SET');

// Check for common issues
console.log('\n=================================');
console.log('Checking for common issues...');
console.log('=================================\n');

let hasIssues = false;

if (!cloudName || !apiKey || !apiSecret) {
  console.log('❌ CRITICAL: Missing credentials');
  hasIssues = true;
}

// Check for spaces (common copy-paste error)
if (cloudName && (cloudName.startsWith(' ') || cloudName.endsWith(' '))) {
  console.log('❌ ISSUE: CLOUDINARY_NAME has leading/trailing spaces');
  console.log(`   Actual value: "${cloudName}"`);
  hasIssues = true;
}

if (apiKey && (apiKey.startsWith(' ') || apiKey.endsWith(' '))) {
  console.log('❌ ISSUE: CLOUDINARY_KEY has leading/trailing spaces');
  hasIssues = true;
}

if (apiSecret && (apiSecret.startsWith(' ') || apiSecret.endsWith(' '))) {
  console.log('❌ ISSUE: CLOUDINARY_SECRET has leading/trailing spaces');
  hasIssues = true;
}

// Check API key format (should be numeric)
if (apiKey && !/^\d+$/.test(apiKey)) {
  console.log('⚠️  WARNING: CLOUDINARY_KEY should be all numbers');
  console.log(`   Your key: ${apiKey.substring(0, 10)}...`);
  hasIssues = true;
}

// Check cloud name format
if (cloudName && cloudName.includes(' ')) {
  console.log('❌ ISSUE: CLOUDINARY_NAME contains spaces (invalid)');
  console.log(`   Your cloud name: "${cloudName}"`);
  hasIssues = true;
}

if (!hasIssues && cloudName && apiKey && apiSecret) {
  console.log('✅ No obvious issues detected with format\n');
  console.log('=================================');
  console.log('Testing connection to Cloudinary...');
  console.log('=================================\n');

  // Try to load cloudinary and test connection
  try {
    const cloudinary = require('cloudinary').v2;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Test API call
    cloudinary.api.ping((error, result) => {
      if (error) {
        console.log('❌ CONNECTION FAILED:', error.message);
        console.log('\nPossible reasons:');
        console.log('1. Cloud name is incorrect');
        console.log('2. API key/secret don\'t match this cloud name');
        console.log('3. Credentials are from a different Cloudinary account');
        console.log('4. Account is suspended or inactive');
        console.log('\nTo fix:');
        console.log('1. Login to cloudinary.com');
        console.log('2. Go to Dashboard');
        console.log('3. Copy credentials from the "Account Details" section');
        console.log('4. Make sure they match exactly (no extra spaces)');
      } else {
        console.log('✅ SUCCESS! Connected to Cloudinary');
        console.log('   Status:', result.status);
        console.log('\nYour credentials are correct!');
      }
    });
  } catch (error) {
    console.log('⚠️  Could not test connection (cloudinary package not loaded)');
    console.log('   This is normal - just verify credentials match your Cloudinary dashboard');
  }
}

console.log('\n=================================');
console.log('How to Get Correct Credentials:');
console.log('=================================\n');
console.log('1. Go to: https://cloudinary.com/console');
console.log('2. Login to your account');
console.log('3. Look for "Account Details" or "API Keys" section');
console.log('4. You\'ll see:');
console.log('   - Cloud name (like: dxyz123abc or your-app-name)');
console.log('   - API Key (15-digit number)');
console.log('   - API Secret (long alphanumeric string)');
console.log('5. Copy these EXACTLY as shown');
console.log('6. Update in Railway Variables tab');
console.log('\nIMPORTANT: All three must be from the SAME account!');