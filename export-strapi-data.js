#!/usr/bin/env node

/**
 * Strapi Data Export Script
 *
 * This script exports all content types and their data from a Strapi instance
 * so it can be imported into another Strapi instance.
 */

const fs = require('fs').promises;
const path = require('path');

async function exportStrapiData() {
  try {
    console.log('🚀 Starting Strapi data export...');

    // Create export directory
    const exportDir = path.join(__dirname, 'strapi-export');
    await fs.mkdir(exportDir, { recursive: true });

    // Create subdirectories
    await fs.mkdir(path.join(exportDir, 'content-types'), { recursive: true });
    await fs.mkdir(path.join(exportDir, 'data'), { recursive: true });
    await fs.mkdir(path.join(exportDir, 'config'), { recursive: true });

    console.log('📁 Created export directories');

    // Export content type schemas
    await exportContentTypeSchemas(exportDir);

    // Export configuration files
    await exportConfig(exportDir);

    // Export API files
    await exportApiFiles(exportDir);

    console.log('✅ Export completed successfully!');
    console.log(`📦 Export files saved to: ${exportDir}`);
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Copy the strapi-export folder to your target Strapi instance');
    console.log('2. Run the import script in your target instance');
    console.log('3. Use "strapi transfer" for data migration');

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

async function exportContentTypeSchemas(exportDir) {
  console.log('📋 Exporting content type schemas...');

  const apiDir = path.join(__dirname, 'src', 'api');
  const apis = await fs.readdir(apiDir);

  const contentTypes = {};

  for (const api of apis) {
    const schemaPath = path.join(apiDir, api, 'content-types', api, 'schema.json');

    try {
      const schemaContent = await fs.readFile(schemaPath, 'utf8');
      const schema = JSON.parse(schemaContent);

      contentTypes[api] = schema;

      // Copy schema file
      const targetPath = path.join(exportDir, 'content-types', `${api}.json`);
      await fs.writeFile(targetPath, JSON.stringify(schema, null, 2));

      console.log(`  ✓ Exported schema: ${api}`);
    } catch (error) {
      console.log(`  ⚠️  Could not export schema for ${api}: ${error.message}`);
    }
  }

  // Create a summary file
  const summary = {
    exportDate: new Date().toISOString(),
    contentTypes: Object.keys(contentTypes),
    totalContentTypes: Object.keys(contentTypes).length
  };

  await fs.writeFile(
    path.join(exportDir, 'content-types', '_summary.json'),
    JSON.stringify(summary, null, 2)
  );
}

async function exportConfig(exportDir) {
  console.log('⚙️  Exporting configuration files...');

  const configFiles = [
    'config/database.ts',
    'config/server.ts',
    'config/admin.ts',
    'config/middlewares.ts',
    'config/plugins.ts'
  ];

  for (const configFile of configFiles) {
    const sourcePath = path.join(__dirname, configFile);
    const fileName = path.basename(configFile);
    const targetPath = path.join(exportDir, 'config', fileName);

    try {
      await fs.copyFile(sourcePath, targetPath);
      console.log(`  ✓ Exported config: ${fileName}`);
    } catch (error) {
      console.log(`  ⚠️  Could not export config ${fileName}: ${error.message}`);
    }
  }
}

async function exportApiFiles(exportDir) {
  console.log('🔌 Exporting API files...');

  const apiDir = path.join(__dirname, 'src', 'api');
  const apis = await fs.readdir(apiDir);

  const apiExportDir = path.join(exportDir, 'api');
  await fs.mkdir(apiExportDir, { recursive: true });

  for (const api of apis) {
    const apiPath = path.join(apiDir, api);
    const targetApiPath = path.join(apiExportDir, api);

    try {
      await copyDirectory(apiPath, targetApiPath);
      console.log(`  ✓ Exported API: ${api}`);
    } catch (error) {
      console.log(`  ⚠️  Could not export API ${api}: ${error.message}`);
    }
  }
}

async function copyDirectory(source, target) {
  await fs.mkdir(target, { recursive: true });

  const items = await fs.readdir(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    const stat = await fs.stat(sourcePath);

    if (stat.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

// Run the export
if (require.main === module) {
  exportStrapiData();
}

module.exports = { exportStrapiData };