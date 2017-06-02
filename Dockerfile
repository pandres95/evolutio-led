FROM node:7.7.3-slim

# Create app directory
RUN         mkdir -p /usr/src/app
WORKDIR     /usr/src/app

# Install app dependencies
ADD         package.json                /usr/src/app/
RUN                                     npm install --silent

# Bundle app source
ADD         .                           /usr/src/app

CMD         [ "npm", "start" ]
