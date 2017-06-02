FROM hypriot/rpi-node:7.4.0-slim

# Create app directory
RUN         mkdir -p /usr/src/app
WORKDIR     /usr/src/app

# Install app dependencies
ADD         package.json                /usr/src/app/
RUN                                     apt-get install build-essential
RUN                                     npm install --silent

# Bundle app source
ADD         .                           /usr/src/app

CMD         [ "npm", "start" ]
