#!/bin/bash

# Install Node.js directly
curl -sL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Check Node.js and npm versions
node -v
npm -v

# Install Angular CLI and dependencies
npm install -g @angular/cli@latest
npm install --legacy-peer-deps --prefix Frontend/FrontMedicalApplication

# Build the Angular project
npm run build --prefix Frontend/FrontMedicalApplication
