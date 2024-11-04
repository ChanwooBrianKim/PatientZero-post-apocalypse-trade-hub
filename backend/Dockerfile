# Stage 1: Build stage
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY ./backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code into the container
COPY ./backend .

# Stage 2: Production stage
FROM node:16 AS production

# Set the working directory in the production container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app .

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
