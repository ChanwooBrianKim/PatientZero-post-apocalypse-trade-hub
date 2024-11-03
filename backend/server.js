import express from 'express';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import router from './routes.js';
import { User, Item } from './models.js';
import { swaggerUi, swaggerDocs } from './swaggerConfig.js';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from a .env file

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
console.log("SECRET_KEY:", SECRET_KEY);

// Connect to MongoDB using Mongoose
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/post_apocalypse_trade_hub';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use('/', router); // Use main router for API routes

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from Authorization header
    if (!token) {
        return res.status(401).json({ message: "Access denied: No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => { // Verify token with secret key
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user; // Store user data in request object
        next(); // Proceed to next middleware or route
    });
}

// Register route for new users
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username }); // Check if username already exists
    if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10); // Hash password with bcrypt
    const user = new User({ username, password: hashedPassword }); // Create new user with hashed password
    await user.save(); // Save user to the database
    res.status(201).json({ message: "User registered successfully" });
});

// Login route for users
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // Find user by username
    if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password); // Compare hashed password
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token valid for 1 hour
    const token = jwt.sign({ username: user.username, id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token }); // Send token to client
});

// Add item route for authenticated users
app.post('/items', authenticateToken, async (req, res) => {
    const { name, type, quantity, image } = req.body;
    const item = new Item({
        name,
        type,
        quantity,
        image,
        owner: req.user.id // Set item owner to authenticated user
    });
    await item.save(); // Save item to the database
    res.status(201).json(item); // Send saved item as response
});

// Get items route, fetching "my items" and "others' items" for the user
app.get('/items', authenticateToken, async (req, res) => {
    try {
        const myItems = await Item.find({ owner: req.user.id }); // Find items owned by the user
        const othersItems = await Item.find({ owner: { $ne: req.user.id } }); // Find items owned by others

        res.json({ myItems, othersItems }); // Send items in response
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch items' }); // Handle error
    }
});

// Swagger route for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Serve Swagger docs

// Start the server and print info on the console
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

// Export the app for testing purposes
export default app;

/*
 Further Improvement:
 * the MVC (Model-View-Controller) architecture. This will involve:
 * - Moving route handler logic to dedicated controller files (e.g., userController.js, itemController.js)
 * - Separating routes into individual route files (e.g., userRoutes.js, itemRoutes.js)
 * - Keeping server setup and configuration focused in server.js
 * 
 * This approach will help improve code organization, maintainability, and scalability as the project grows.
 */