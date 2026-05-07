const express = require("express");
const UserController = require("../controllers/user.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validateRequestBody } = require("../middlewares/validation.middleware");

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

module.exports = router;
