# Backend Dockerfile (backend/Dockerfile)
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json to the container
COPY ./backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code into the container
COPY ./backend .

# Expose the port the backend listens on
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
