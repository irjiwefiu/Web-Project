import express from "express";
import StatusController from "../controllers/status.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateRequestBody } from "../middlewares/validation.middleware.js";

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

export default router;
