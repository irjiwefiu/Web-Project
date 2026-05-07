import express from "express";
import ReviewController from "../controllers/review.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateRequestBody } from "../middlewares/validation.middleware.js";

const router = express.Router();

/**
 * Review and Rating Routes
 */

/**
 * POST /reviews
 * Create a new review for a completed service
 * Protected: Customer only
 * Body: { request_id, rating, comment }
 */
router.post(
    "/",
    authenticateUser,
    authorizeRoles("customer"),
    validateRequestBody,
    ReviewController.createReviewController
);

/**
 * GET /reviews/request/:requestId
 * Get review for a specific service request
 * Protected: authenticateUser
 */
router.get(
    "/request/:requestId",
    authenticateUser,
    ReviewController.getReviewByRequestController
);

/**
 * GET /reviews/technician/:technicianId
 * Get all reviews for a specific technician
 * Protected: authenticateUser
 */
router.get(
    "/technician/:technicianId",
    authenticateUser,
    ReviewController.getTechnicianReviewsController
);

/**
 * GET /reviews/customer/me
 * Get all reviews written by the logged-in customer
 * Protected: Customer only
 */
router.get(
    "/customer/me",
    authenticateUser,
    authorizeRoles("customer"),
    ReviewController.getCustomerReviewsController
);

/**
 * PATCH /reviews/:id
 * Update a review
 * Protected: Customer only (owner of the review)
 */
router.patch(
    "/:id",
    authenticateUser,
    authorizeRoles("customer"),
    validateRequestBody,
    ReviewController.updateReviewController
);

/**
 * DELETE /reviews/:id
 * Delete a review
 * Protected: Customer only (owner of the review)
 */
router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("customer"),
    ReviewController.deleteReviewController
);

export default router;
