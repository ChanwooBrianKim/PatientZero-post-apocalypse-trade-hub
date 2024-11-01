# Dockerfile for Frontend Service
FROM node:16

WORKDIR /app

# Copy package.json and package-lock.json from the frontend folder
COPY ./trade-hub-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY ./trade-hub-frontend .

# Expose the frontend port
EXPOSE 3000

# Start the frontend app
CMD ["npm", "start"]
