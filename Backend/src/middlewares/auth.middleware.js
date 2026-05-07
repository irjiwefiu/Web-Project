import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";

/**
 * authenticateUser
 * * Logic:
 * 1. Extracts the 'Bearer' token from the Authorization header.
 * 2. Verifies the JWT signature and expiration.
 * 3. (Optional but Recommended) Verifies the user still exists in the database.
 * 4. Attaches the user payload to req.user for use in subsequent middleware/controllers.
 */
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check if the Authorization header exists and follows the Bearer pattern
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No authentication token provided." 
            });
        }

        // 2. Extract the token
        const token = authHeader.split(" ")[1];

        // 3. Verify the token using your secret key
        const secret = process.env.JWT_SECRET || "development_secret_key";
        let decoded;
        
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token." 
            });
        }

        // 4. (Optional Security Check) Verify user still exists in the DB
        // This prevents access if a user account was deleted but the token is still "valid"
        const user = await UserRepository.findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "The user belonging to this token no longer exists." 
            });
        }

        // 5. Attach the user object to the request
        // We attach the full user object (excluding sensitive data) so controllers 
        // can access things like req.user.id or req.user.role.name
        req.user = user;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An internal error occurred during authentication." 
        });
    }
};

export { authenticateUser };