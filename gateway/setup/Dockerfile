# Use the official Node.js image from Docker Hub
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install bash
RUN apt-get update && apt-get install -y bash

# Install Docker CLI
RUN apt-get update && apt-get install -y docker.io

# Copy package.json and package-lock.json (if it exists) to the container
COPY package*.json ./

# Install the dependencies defined in package.json
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Command to run the app with bash
CMD ["bash", "-c", "node setup.js"]