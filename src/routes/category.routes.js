const express = require("express");
const CategoryController = require("../controllers/category.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validateRequestBody } = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * Service Category Routes
 */

/**
 * POST /categories
 * Create a new service category
 * Protected: Admin only
 */
router.post(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    validateRequestBody,
    CategoryController.createCategoryController
);

/**
 * GET /categories
 * Get all service categories
 * Protected: authenticateUser
 */
router.get(
    "/",
    authenticateUser,
    CategoryController.getAllCategoriesController
);

/**
 * PATCH /categories/:id
 * Update a service category
 * Protected: Admin only
 */
router.patch(
    "/:id",
    authenticateUser,
    authorizeRoles("admin"),
    validateRequestBody,
    CategoryController.updateCategoryController
);

/**
 * DELETE /categories/:id
 * Delete a service category
 * Protected: Admin only
 */
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("admin"),
    CategoryController.deleteCategoryController
);

export default router;
