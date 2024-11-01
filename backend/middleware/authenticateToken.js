// Import dotenv to manage environment variables securely
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from a .env file into process.env

// Import jsonwebtoken for token-based authentication
import jwt from 'jsonwebtoken';

// Retrieve the secret key from environment variables for token verification
const SECRET_KEY = process.env.SECRET_KEY;
console.log("SECRET_KEY in authenticateToken:", SECRET_KEY); // Log the secret key for debugging

// Middleware function to authenticate token from request headers
function authenticateToken(req, res, next) {
    // Retrieve the Authorization header from the request headers
    const authHeader = req.headers['authorization'];
    // Extract the token, if present, by splitting the Bearer <token> format
    const token = authHeader && authHeader.split(' ')[1];
    
    // If no token is provided, deny access with a 401 Unauthorized status
    if (!token) {
        return res.status(401).json({ message: "Access denied: No token provided" });
    }

    // Verify the token using the SECRET_KEY
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            // Log any error that occurs during token verification for debugging
            console.log("Token verification error:", err);
            // Respond with a 403 Forbidden status if the token is invalid or expired
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        // If the token is valid, attach the decoded user info to the request object
        req.user = user;
        // Call the next middleware or route handler
        next();
    });
}

// Export the authenticateToken middleware for use in other parts of the application
export default authenticateToken;
