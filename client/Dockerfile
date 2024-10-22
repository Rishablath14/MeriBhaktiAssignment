# Frontend Dockerfile
FROM node:14

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy the app source code
COPY . .

# Expose port 3000 for the frontend
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
