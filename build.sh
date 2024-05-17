#!/bin/bash

# Install Node.js directly
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Check Node.js and npm versions
node -v
npm -v

# Navigate to the project directory
cd Frontend/FrontMedicalApplication

# Install Angular CLI and dependencies
npm install -g @angular/cli@latest
npm install --legacy-peer-deps

# Build the Angular project
npm run build
