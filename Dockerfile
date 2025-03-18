# Use an official Node runtime as the base image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the ports the app runs on
EXPOSE 3000
EXPOSE 5000

# Start the application using the dev script
CMD ["npm", "run", "dev"]