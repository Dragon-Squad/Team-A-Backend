# Use the official Node.js 18 image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the script into the container
COPY . .


# Set the default command to run the script
CMD ["node", "setup.js"]
