# Base this image on Node.js
FROM node

# Create the location of our app within the image
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the package json containing dependencies, then install
COPY package.json /usr/src/app/
RUN npm install

# Copy the current source to the image
COPY . /usr/src/app

# Expose 5858 for debugging, and 3000 is the port on which this service listens
EXPOSE 3000 5858

# Start the service
ENTRYPOINT ["npm", "start"]
