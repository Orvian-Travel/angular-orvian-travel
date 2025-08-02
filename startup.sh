#!/bin/sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Start the application
echo "Starting the application..."
node server.js
