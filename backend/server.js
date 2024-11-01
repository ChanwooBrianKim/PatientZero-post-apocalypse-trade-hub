import express from 'express';
import cors from 'cors';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import router from './routes.js';
import { User, Item } from './models.js';
import { swaggerUi, swaggerDocs } from './swaggerConfig.js';

import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
console.log("SECRET_KEY:", SECRET_KEY);

mongoose.connect('mongodb://localhost:27017/post_apocalypse_trade_hub', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', router);

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied: No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
}

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username: user.username, id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Add item route
app.post('/items', authenticateToken, async (req, res) => {
    const { name, type, quantity, image } = req.body;
    const item = new Item({
        name,
        type,
        quantity,
        image,
        owner: req.user.id
    });
    await item.save();
    res.status(201).json(item);
});

// Get items route
app.get('/items', authenticateToken, async (req, res) => {
    try {
        const myItems = await Item.find({ owner: req.user.id });
        const othersItems = await Item.find({ owner: { $ne: req.user.id } });

        res.json({ myItems, othersItems });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

// Export the app for testing purposes
export default app;
