#!/bin/bash

# Strapi Data Transfer Script
# This script helps transfer data between Strapi instances

echo "🚀 Strapi Data Transfer Utility"
echo "================================"

# Function to export data to file
export_to_file() {
    echo "📦 Exporting data to transfer file..."

    # Create exports directory
    mkdir -p exports

    # Generate filename with timestamp
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    EXPORT_FILE="exports/strapi-data-export-${TIMESTAMP}.tar.gz"

    echo "📁 Export file: $EXPORT_FILE"

    # Run Strapi transfer to file
    npx strapi transfer --to "file://./${EXPORT_FILE}" --exclude-webhook

    if [ $? -eq 0 ]; then
        echo "✅ Export completed successfully!"
        echo "📋 To import this data to another instance:"
        echo "   1. Copy $EXPORT_FILE to your target Strapi instance"
        echo "   2. Run: npx strapi transfer --from file://./$EXPORT_FILE"
    else
        echo "❌ Export failed!"
        exit 1
    fi
}

# Function to export to remote Strapi instance
export_to_remote() {
    echo "🌐 Exporting data to remote Strapi instance..."

    read -p "Enter target Strapi URL (e.g., https://target-strapi.example.com): " TARGET_URL
    read -p "Enter admin username for target instance: " ADMIN_USER
    read -s -p "Enter admin password for target instance: " ADMIN_PASS
    echo

    echo "🔄 Starting transfer to $TARGET_URL..."

    npx strapi transfer --to "strapi://${ADMIN_USER}:${ADMIN_PASS}@${TARGET_URL}" --exclude-webhook

    if [ $? -eq 0 ]; then
        echo "✅ Transfer completed successfully!"
    else
        echo "❌ Transfer failed!"
        exit 1
    fi
}

# Function to import from file
import_from_file() {
    echo "📥 Importing data from transfer file..."

    # List available export files
    echo "Available export files:"
    ls -la exports/*.tar.gz 2>/dev/null || echo "No export files found in exports/ directory"

    read -p "Enter the path to your import file: " IMPORT_FILE

    if [ ! -f "$IMPORT_FILE" ]; then
        echo "❌ File not found: $IMPORT_FILE"
        exit 1
    fi

    echo "📥 Importing from $IMPORT_FILE..."

    npx strapi transfer --from "file://./$IMPORT_FILE" --exclude-webhook

    if [ $? -eq 0 ]; then
        echo "✅ Import completed successfully!"
        echo "🔄 Please rebuild your Strapi instance:"
        echo "   npm run build && npm run develop"
    else
        echo "❌ Import failed!"
        exit 1
    fi
}

# Function to import from remote Strapi instance
import_from_remote() {
    echo "🌐 Importing data from remote Strapi instance..."

    read -p "Enter source Strapi URL (e.g., https://source-strapi.example.com): " SOURCE_URL
    read -p "Enter admin username for source instance: " ADMIN_USER
    read -s -p "Enter admin password for source instance: " ADMIN_PASS
    echo

    echo "🔄 Starting transfer from $SOURCE_URL..."

    npx strapi transfer --from "strapi://${ADMIN_USER}:${ADMIN_PASS}@${SOURCE_URL}" --exclude-webhook

    if [ $? -eq 0 ]; then
        echo "✅ Transfer completed successfully!"
        echo "🔄 Please rebuild your Strapi instance:"
        echo "   npm run build && npm run develop"
    else
        echo "❌ Transfer failed!"
        exit 1
    fi
}

# Main menu
echo "Select an option:"
echo "1. Export data to file"
echo "2. Export data to remote Strapi instance"
echo "3. Import data from file"
echo "4. Import data from remote Strapi instance"
echo "5. Exit"

read -p "Enter your choice (1-5): " CHOICE

case $CHOICE in
    1)
        export_to_file
        ;;
    2)
        export_to_remote
        ;;
    3)
        import_from_file
        ;;
    4)
        import_from_remote
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac