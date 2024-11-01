import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;
console.log("SECRET_KEY in authenticateToken:", SECRET_KEY); // Confirm the key

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Access denied: No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Token verification error:", err);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
}

export default authenticateToken;
