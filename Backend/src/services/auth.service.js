import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/user.repository.js";
import RoleRepository from "../repositories/role.repository.js";
import TechnicianRepository from "../repositories/technician.repository.js";

/**
 * Service to handle Authentication logic
 */
const AuthService = {
    
    // 1. registerUser: Handles password hashing and role assignment
    async registerUser(userData) {
        const { name, username, email, password, roleName, skills, bio, service_area } = userData;

        // Check if user already exists
        const existingUser = await UserRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Allow public registration as customer or technician
        const allowedRoles = ["customer", "technician"];
        const selectedRole = (roleName || "customer").toLowerCase();
        if (!allowedRoles.includes(selectedRole)) {
            throw new Error("Only customer and technician roles can be self-registered.");
        }

        const role = await RoleRepository.findRoleByName(selectedRole);
        if (!role) {
            throw new Error(`Role "${selectedRole}" is not configured.`);
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user
        const newUser = await UserRepository.createUser({
            name,
            username,
            email,
            password: hashedPassword,
            role
        });

        // If registering as technician, create the technician profile
        if (selectedRole === "technician") {
            await TechnicianRepository.createTechnicianProfile({
                user: { id: newUser.id },
                bio: bio || null,
                skills: skills || [],
                service_area: service_area || null,
                availability_status: "offline",
                rating: 0,
                total_jobs: 0,
            });
        }

        return newUser;
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