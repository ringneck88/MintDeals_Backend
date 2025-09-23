#!/usr/bin/env node

/**
 * Strapi Data Import Script
 *
 * This script imports content types and configuration from an exported Strapi instance.
 * Run this in your target Strapi instance after copying the export files.
 */

const fs = require('fs').promises;
const path = require('path');

async function importStrapiData() {
  try {
    console.log('📥 Starting Strapi data import...');

    const exportDir = path.join(__dirname, 'strapi-export');

    // Check if export directory exists
    try {
      await fs.access(exportDir);
    } catch (error) {
      console.error('❌ Export directory not found. Please copy the strapi-export folder to this directory.');
      process.exit(1);
    }

    // Import content types
    await importContentTypes(exportDir);

    // Import API files
    await importApiFiles(exportDir);

    // Import configuration (with backup)
    await importConfig(exportDir);

    console.log('✅ Import completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Review imported configurations in config/ directory');
    console.log('2. Update database and environment settings as needed');
    console.log('3. Run "npm run build" to build with new content types');
    console.log('4. Run "npm run develop" to start development server');
    console.log('5. Use Strapi transfer commands to migrate actual data');

  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

async function importContentTypes(exportDir) {
  console.log('📋 Importing content type schemas...');

  const contentTypesDir = path.join(exportDir, 'content-types');
  const files = await fs.readdir(contentTypesDir);

  for (const file of files) {
    if (file === '_summary.json') continue;
    if (!file.endsWith('.json')) continue;

    const apiName = path.basename(file, '.json');
    const schemaPath = path.join(contentTypesDir, file);
    const schema = JSON.parse(await fs.readFile(schemaPath, 'utf8'));

    // Create API directory structure
    const apiDir = path.join(__dirname, 'src', 'api', apiName);
    const contentTypeDir = path.join(apiDir, 'content-types', apiName);

    await fs.mkdir(contentTypeDir, { recursive: true });
    await fs.mkdir(path.join(apiDir, 'controllers'), { recursive: true });
    await fs.mkdir(path.join(apiDir, 'routes'), { recursive: true });
    await fs.mkdir(path.join(apiDir, 'services'), { recursive: true });

    // Write schema file
    const targetSchemaPath = path.join(contentTypeDir, 'schema.json');
    await fs.writeFile(targetSchemaPath, JSON.stringify(schema, null, 2));

    console.log(`  ✓ Imported content type: ${apiName}`);
  }
}

async function importApiFiles(exportDir) {
  console.log('🔌 Importing API files...');

  const apiExportDir = path.join(exportDir, 'api');

  try {
    await fs.access(apiExportDir);
  } catch (error) {
    console.log('  ⚠️  No API files to import');
    return;
  }

  const apis = await fs.readdir(apiExportDir);

  for (const api of apis) {
    const sourceApiPath = path.join(apiExportDir, api);
    const targetApiPath = path.join(__dirname, 'src', 'api', api);

    try {
      await copyDirectory(sourceApiPath, targetApiPath);
      console.log(`  ✓ Imported API: ${api}`);
    } catch (error) {
      console.log(`  ⚠️  Could not import API ${api}: ${error.message}`);
    }
  }
}

async function importConfig(exportDir) {
  console.log('⚙️  Importing configuration files...');

  const configExportDir = path.join(exportDir, 'config');

  try {
    await fs.access(configExportDir);
  } catch (error) {
    console.log('  ⚠️  No config files to import');
    return;
  }

  const configFiles = await fs.readdir(configExportDir);

  for (const configFile of configFiles) {
    const sourcePath = path.join(configExportDir, configFile);
    const targetPath = path.join(__dirname, 'config', configFile);

    try {
      // Backup existing config if it exists
      try {
        await fs.access(targetPath);
        const backupPath = `${targetPath}.backup-${Date.now()}`;
        await fs.copyFile(targetPath, backupPath);
        console.log(`  📋 Backed up existing config: ${configFile}`);
      } catch (error) {
        // File doesn't exist, no backup needed
      }

      await fs.copyFile(sourcePath, targetPath);
      console.log(`  ✓ Imported config: ${configFile}`);
    } catch (error) {
      console.log(`  ⚠️  Could not import config ${configFile}: ${error.message}`);
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

// Run the import
if (require.main === module) {
  importStrapiData();
}

module.exports = { importStrapiData };