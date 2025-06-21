# Use official Node.js LTS base image
FROM node:latest

# Create app directory
WORKDIR /mybackend 
# every folder from here will get copied inside ,ybacdkend

# Copy package.json and lock file first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables if needed
# (or use --env-file when running)

# Expose the port your app runs on
EXPOSE 5000

# Start the application
CMD ["node", "src/index.js"]
