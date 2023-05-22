# Use the official Node.js image based on Alpine Linux as the base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Install Python
RUN apk add --no-cache python3

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire application directory to the working directory
COPY . .

# Expose the port your Node.js app is listening on
EXPOSE 7000

# Start the Node.js application
CMD ["npm", "start"]
