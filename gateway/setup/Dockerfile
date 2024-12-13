# Use the official Node.js 18 image as the base
FROM node:18-alpine

# Install curl
RUN apk add --no-cache curl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./
COPY wait-for-kong.sh /usr/src/app/wait-for-kong.sh

# Install dependencies
RUN npm install

# Copy the script into the container
COPY . .

# Make the script executable
RUN chmod +x /usr/src/app/wait-for-kong.sh

# Set the default command to run the script
CMD ["./wait-for-kong.sh"]
