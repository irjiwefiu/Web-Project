import express from "express";
import UserController from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateRequestBody } from "../middlewares/validation.middleware.js";

const router = express.Router();

/**
 * User Profile Routes
 */

/**
 * GET /users/profile
 * Get authenticated user's profile
 * Protected: authenticateUser
 */
router.get(
    "/profile",
    authenticateUser,
    UserController.getUserProfileController
);

/**
 * PATCH /users/profile
 * Update authenticated user's profile
 * Protected: authenticateUser
 */
router.patch(
    "/profile",
    authenticateUser,
    validateRequestBody,
    UserController.updateUserProfileController
);

/**
 * Admin User Management Routes
 */

/**
 * GET /users
 * Get all users
 * Protected: Admin only
 */
router.get(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    UserController.getAllUsersController
);

/**
 * GET /users/role/:role
 * Get users by specific role
 * Protected: Admin only
 */
router.get(
    "/role/:role",
    authenticateUser,
    authorizeRoles("admin"),
    UserController.getUsersByRoleController
);

/**
 * DELETE /users/:id
 * Delete a user by ID
 * Protected: Admin only
 */
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("admin"),
    UserController.deleteUserController
);

export default router;
