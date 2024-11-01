# 🏙️ The Post-Apocalypse Trade Hub
Welcome to The Post-Apocalypse Trade Hub, a real-time trading app where users in a post-apocalyptic world can trade items with others in the community. This project includes user and item management, seamless item trading, and Dockerized setup for easy deployment.

## ✨ Features
- 📜 **User Authentication**: Secure user login using JWT.
- 🔄 **Add & Remove Items**: Users can list items they own and remove items they no longer want to trade.
- 🗃️ **Database Integration**: MongoDB database for storing user and item data.
- 🔄 **Simple Trade Management**: Separate views for “My Items” and “Other Users’ Items,” so users can manage their own inventory and see items available for trade from others.
- 🐳 **Dockerized Setup**: Simplified development and deployment with Docker.

## 🚀 Getting Started

### 🛠️ Prerequisites
- Docker and Docker Compose installed
- Node.js and npm installed
- A MongoDB instance if not using Docker's MongoDB setup

### 📥 Installation
1. **Clone the Repository**

    ```bash
    git clone https://github.com/ChanwooBrianKim/PatientZero-post-apocalypse-trade-hub.git
    cd post-apocalypse-trade-hub
    ```

2. **Set Up Environment Variables**
- Create a .env file in the backend root directory and add:

    ```bash
    SECRET_KEY=your_secret_key
    MONGO_URI=mongodb://mongo:27017/post_apocalypse_trade_hub
    ```

3. **Install Dependencies** (Frontend & Backend each)

    ```bash
    npm install
    ```
4. **Run with Docker Compose**

    ```bash
    docker-compose up --build
    ```
Docker will build and run the frontend, backend, and MongoDB services.

5. **Access the App**

- Navigate to http://localhost:3000 for the frontend, and backend at http://localhost:5000.

## 💡 Usage

1. **Register and Login**: Create an account and authenticate to start trading.
2. **Item Management**: Add items to your inventory or remove items you no longer want to trade.
3. **Accept or Remove Trades**: Accept other users' items or remove your own listed items.

## 🛠️ Technologies Used

- **Frontend**: React, JavaScript
- **Backend**: Node.js, Express, JWT for authentication
- **Database**: MongoDB for persistent storage of user and item data
- **Containerization**: Docker for simplified deployment

## 🐳 Docker Setup

This project uses Docker Compose to manage the following services:

- **Backend**: Node.js + Express server
- **Frontend**: React application
- **Database**: MongoDB for persistent data storage

To bring down the containers, use:
    ```bash
    docker-compose up --build
    ```

## Troubleshooting

- **Container Not Starting**: Check .env variables and ensure Docker is running.
- **Frontend/Backend Errors**: Review console logs for details.
- **JWT or Authorization Issues**: Verify the SECRET_KEY is correctly set in the .env file.

## 📄 License
MIT License

## 📂 Project Structure

    ```bash
        📦 BRIAN KIM - THE POST-APOCALYPSE TRADE HUB
    ├── backend
    │   ├── middleware
    │   │   └── authenticateToken.js     # Middleware for token authentication
    │   ├── tests
    │   │   └── routes.test.js           # Tests for backend routes
    │   ├── .env                         # Environment variables (e.g., database URL, secret key)
    │   ├── Dockerfile                   # Docker configuration for backend
    │   ├── generateHash.js              # Utility for generating password hashes
    │   ├── jest.config.js               # Jest configuration file
    │   ├── models.js                    # Database models (e.g., User, Item)
    │   ├── package.json                 # Backend dependencies and scripts
    │   ├── routes.js                    # API route definitions
    │   ├── server.js                    # Main server setup
    │   ├── serverTest.js                # Test file for server functionality
    │   ├── swaggerConfig.js             # Swagger configuration for API documentation
    │
    ├── trade-hub-frontend
    │   ├── src                          # Frontend source files
    │   │   ├── AddItemComponent.js      # Component for adding items to trade
    │   │   ├── App.js                   # Main App component
    │   │   ├── ItemsComponent.js        # Component displaying items
    │   │   ├── LoginComponent.js        # Component for user login
    │   │   ├── RegisterComponent.js     # Component for user registration
    │   │   ├── NotificationsComponent.js # Component for displaying notifications
    │   ├── public                       # Public assets (e.g., logos, index.html)
    │   ├── Dockerfile                   # Docker configuration for frontend
    │   ├── .dockerignore                # Ignore unnecessary files in Docker
    │   ├── package.json                 # Frontend dependencies and scripts
    │   ├── README.md                    # Project documentation
    │
    ├── .gitignore                       # Ignore node_modules, .env, etc.
    ├── docker-compose.yml               # Docker Compose for orchestrating services
    └── README.md                        # This README file
    ```

Enjoy trading in the new world! 🌍
