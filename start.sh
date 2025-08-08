#!/bin/bash

echo "🚀 Starting Amazon Clone Ecommerce Application..."

# Check if MongoDB is running (optional)
echo "📊 Checking MongoDB connection..."

# Start the development servers
echo "🔥 Starting both frontend and backend servers..."

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Start both servers
echo "🚀 Starting development servers..."
npm run dev