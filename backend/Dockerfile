# Backend Dockerfile
FROM node:14

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port 5000 for the backend
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
