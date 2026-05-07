const express = require("express");
const ServiceRequestController = require("../controllers/serviceRequest.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validateRequestBody } = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * Service Request Routes (Core Booking System)
 */

/**
 * POST /requests
 * Create a new service request
 * Protected: authenticateUser, Customer only
 */
router.post(
    "/",
    authenticateUser,
    authorizeRoles("customer"),
    validateRequestBody,
    ServiceRequestController.createServiceRequestController
);

/**
 * GET /requests
 * Get all service requests
 * Protected: Admin only
 */
router.get(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    ServiceRequestController.getAllServiceRequestsController
);

/**
 * GET /requests/:id
 * Get a specific service request by ID
 * Protected: authenticateUser
 */
router.get(
    "/:id",
    authenticateUser,
    ServiceRequestController.getServiceRequestByIdController
);

/**
 * PATCH /requests/:id
 * Update a service request
 * Protected: Customer only (can update own request)
 */
router.patch(
    "/:id",
    authenticateUser,
    authorizeRoles("customer"),
    validateRequestBody,
    ServiceRequestController.updateServiceRequestController
);

/**
 * PATCH /requests/:id/cancel
 * Cancel a service request
 * Protected: Customer only
 */
router.patch(
    "/:id/cancel",
    authenticateUser,
    authorizeRoles("customer"),
    ServiceRequestController.cancelServiceRequestController
);

/**
 * GET /requests/customer/me
 * Get all service requests for the logged-in customer
 * Protected: authenticateUser, Customer only
 */
router.get(
    "/customer/me",
    authenticateUser,
    authorizeRoles("customer"),
    ServiceRequestController.getCustomerRequestsController
);

/**
 * GET /requests/filter
 * Search and filter service requests
 * Protected: Admin only
 * Query params: status, categoryId, area, etc.
 */
router.get(
    "/filter",
    authenticateUser,
    authorizeRoles("admin"),
    ServiceRequestController.filterServiceRequestsController
);

/**
 * GET /requests/search
 * Full-text search for service requests
 * Protected: Admin only
 * Query params: q (search query)
 */
router.get(
    "/search",
    authenticateUser,
    authorizeRoles("admin"),
    ServiceRequestController.searchServiceRequestsController
);

module.exports = router;
