#!/bin/bash

echo "🚀 Post-deployment initialization for Render.com"
echo ""

# Wait a bit for the server to be ready
sleep 5

# Check if database needs initialization
if [ ! -f "./database/questionnaire.db" ]; then
    echo "📊 Database not found, initializing..."
    node scripts/init-data.js
    echo "✅ Database initialized"
else
    echo "✅ Database already exists"
fi

echo ""
echo "🎉 Deployment complete!"
