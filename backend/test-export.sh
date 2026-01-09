#!/bin/bash

# Script to test Excel export functionality
# Usage: ./test-export.sh

echo "📥 Testing Sephora Questionnaire Excel Export"
echo ""

# Check if server is running
if ! curl -s http://localhost:5000/health > /dev/null; then
    echo "❌ Server is not running!"
    echo "Please start the server first: npm run dev"
    exit 1
fi

echo "✅ Server is running"
echo ""

# Export Excel
echo "📤 Exporting questionnaire to Excel..."
OUTPUT_FILE="SEPHORA-Export-$(date +%Y%m%d-%H%M%S).xlsx"

curl -s http://localhost:5000/api/excel/export \
    --output "../$OUTPUT_FILE"

if [ -f "../$OUTPUT_FILE" ]; then
    echo "✅ Export successful!"
    echo ""
    echo "📄 File created: $OUTPUT_FILE"
    echo "📊 File size: $(du -h "../$OUTPUT_FILE" | cut -f1)"
    echo ""
    echo "🔍 You can now open the file in Excel to verify:"
    echo "   open ../$OUTPUT_FILE"
else
    echo "❌ Export failed!"
    exit 1
fi
