import express from "express";
import AuthController from "../controllers/auth.controller.js";
import validateRequestBody from "../middlewares/validation.middleware.js";

const router = express.Router();

/**
 * Authentication Routes
 */

/**
 * POST /auth/register
 * Register a new user
 * Middleware: validateRequestBody
 */
router.post(
    "/register",
    validateRequestBody,
    AuthController.registerUserController
);

/**
 * POST /auth/login
 * Login user and receive JWT token
 * Middleware: validateRequestBody
 */
router.post(
    "/login",
    validateRequestBody,
    AuthController.loginUserController
);

export default router;
