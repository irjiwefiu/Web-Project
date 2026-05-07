const express = require("express");
const AuthController = require("../controllers/auth.controller");
const { validateRequestBody } = require("../middlewares/validation.middleware");

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

module.exports = router;
