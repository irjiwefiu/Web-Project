const express = require("express");
const TechnicianController = require("../controllers/technician.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validateRequestBody } = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * Technician Profile Routes
 */

/**
 * POST /technicians/profile
 * Create technician profile
 * Protected: authenticateUser, Technician only
 */
router.post(
    "/profile",
    authenticateUser,
    authorizeRoles("technician"),
    validateRequestBody,
    TechnicianController.createTechnicianProfileController
);

/**
 * PATCH /technicians/profile
 * Update technician profile
 * Protected: authenticateUser, Technician only
 */
router.patch(
    "/profile",
    authenticateUser,
    authorizeRoles("technician"),
    validateRequestBody,
    TechnicianController.updateTechnicianProfileController
);

/**
 * Availability Management Routes
 */

/**
 * PATCH /technicians/availability
 * Update technician availability status
 * Protected: authenticateUser, Technician only
 * Body: { status: 'available' | 'busy' | 'offline' }
 */
router.patch(
    "/availability",
    authenticateUser,
    authorizeRoles("technician"),
    validateRequestBody,
    TechnicianController.updateAvailabilityStatusController
);

/**
 * Technician Discovery Routes
 */

/**
 * GET /technicians/available
 * Get all available technicians
 * Protected: authenticateUser
 */
router.get(
    "/available",
    authenticateUser,
    TechnicianController.getAvailableTechniciansController
);

/**
 * GET /technicians/category/:categoryId
 * Get technicians by service category
 * Protected: authenticateUser
 */
router.get(
    "/category/:categoryId",
    authenticateUser,
    TechnicianController.getTechniciansByCategoryController
);

/**
 * GET /technicians/area/:area
 * Get technicians by service area
 * Protected: authenticateUser
 */
router.get(
    "/area/:area",
    authenticateUser,
    TechnicianController.getTechniciansByAreaController
);

/**
 * GET /technicians/:id/rating
 * Get technician rating and reviews count
 * Protected: authenticateUser
 */
router.get(
    "/:id/rating",
    authenticateUser,
    TechnicianController.getTechnicianRatingController
);

export default router;
