const AuthService = require("../services/auth.service");

/**
 * AuthController
 * Handles the HTTP interface for User Registration and Login
 */
const AuthController = {

    /**
     * registerUserController
     * POST /auth/register
     */
    async registerUserController(req, res, next) {
        try {
            // Data has already been validated by validation.middleware.js
            const newUser = await AuthService.registerUser(req.body);

            return res.status(201).json({
                success: true,
                message: "User registered successfully.",
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            });
        } catch (error) {
            // Forward error to error.middleware.js
            next(error);
        }
    },

    /**
     * loginUserController
     * POST /auth/login
     */
    async loginUserController(req, res, next) {
        try {
            const { email, password } = req.body;

            // Orchestrates credential verification and token generation
            const result = await AuthService.loginUser(email, password);

            return res.status(200).json({
                success: true,
                message: "Login successful.",
                data: {
                    user: {
                        id: result.user.id,
                        name: result.user.name,
                        email: result.user.email,
                        role: result.user.role?.name
                    },
                    token: result.token
                }
            });
        } catch (error) {
            // If service throws "Invalid credentials", next(error) handles it
            next(error);
        }
    }
};

module.exports = AuthController;