# Stage 1: Build the React app
FROM node:16 AS build

WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker cache
COPY ./trade-hub-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY ./trade-hub-frontend .

# Build the production-ready assets
RUN npm run build

# Stage 2: Serve the production build with Nginx
FROM nginx:alpine AS production

# Copy the build output from the previous stage to Nginx's HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose Nginx's default HTTP port
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
