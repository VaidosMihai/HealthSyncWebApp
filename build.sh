#!/bin/bash

# Ensure we're using the correct Node.js version
export NVM_DIR="$HOME/.nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source "$NVM_DIR/nvm.sh"
nvm install 20.13.1
nvm use 20.13.1

# Install Angular CLI and dependencies
npm install -g @angular/cli@latest
npm install --legacy-peer-deps --prefix Frontend/FrontMedicalApplication

# Build the Angular project
npm run build --prefix Frontend/FrontMedicalApplication
