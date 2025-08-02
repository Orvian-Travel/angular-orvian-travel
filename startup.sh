#!/bin/sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Start the application
echo "Starting the application..."
npx serve dist/angular-orvian-travel/browser -s -p ${PORT:-8080}
