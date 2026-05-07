const express = require("express");
const StatusController = require("../controllers/status.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validateRequestBody } = require("../middlewares/validation.middleware");

const router = express.Router();

/**
 * Service Status Routes
 */

/**
 * PATCH /status/:requestId
 * Update the status of a service request
 * Protected: Technician only (for progress updates), Admin for overrides
 * Body: { status, notes }
 */
router.patch(
    "/:requestId",
    authenticateUser,
    authorizeRoles("technician", "admin"),
    validateRequestBody,
    StatusController.updateServiceStatusController
);

/**
 * GET /status/:requestId/current
 * Get the current status of a service request
 * Protected: authenticateUser
 */
router.get(
    "/:requestId/current",
    authenticateUser,
    StatusController.getCurrentServiceStatusController
);

/**
 * GET /status/:requestId/history
 * Get the status history and audit trail of a service request
 * Protected: authenticateUser
 */
router.get(
    "/:requestId/history",
    authenticateUser,
    StatusController.getServiceStatusHistoryController
);

module.exports = router;
