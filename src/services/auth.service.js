import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import RoleRepository from "../repositories/role.repository.js";

/**
 * Service to handle Authentication logic
 */
const AuthService = {
    
    // 1. registerUser: Handles password hashing and role assignment
    async registerUser(userData) {
        const { name, email, password, roleName } = userData;

        // Check if user already exists
        const existingUser = await UserRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Fetch the role (default to 'customer' if not provided)
        const role = await RoleRepository.findRoleByName(roleName || "customer");
        if (!role) {
            throw new Error("Invalid role specified");
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user
        return await UserRepository.createUser({
            name,
            email,
            password: hashedPassword,
            role: role // Link the Role entity
        });
    },

    // 2. verifyUserCredentials: Validates email and password
    async verifyUserCredentials(email, password) {
        const user = await UserRepository.findUserByEmail(email);
        
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        // Return user without the password field
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    // 3. generateToken: Creates a JWT for session management
    generateToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role?.name // Include role for RBAC in middleware
        };

        // Use a secret from environment variables
        const secret = process.env.JWT_SECRET || "your_fallback_secret";
        const options = { expiresIn: "1d" };

        return jwt.sign(payload, secret, options);
    },

    // 4. loginUser: Orchestrates the verification and token generation
    async loginUser(email, password) {
        const user = await this.verifyUserCredentials(email, password);
        
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const token = this.generateToken(user);

        return {
            user,
            token
        };
    }
};

export default AuthService;