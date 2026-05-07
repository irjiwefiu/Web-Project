const express = require("express");
const AssignmentController = require("../controllers/assignment.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validateRequestBody } = require("../middlewares/validation.middleware");
const { de } = require("date-fns/locale");

const router = express.Router();

/**
 * Technician Assignment Routes (Dispatch System)
 */

/**
 * POST /assignments
 * Assign a technician to a service request
 * Protected: Admin only
 * Body: { request_id, technician_id }
 */
router.post(
    "/",
    authenticateUser,
    authorizeRoles("admin"),
    validateRequestBody,
    AssignmentController.assignTechnicianController
);

/**
 * PATCH /assignments/:id/reassign
 * Reassign a technician to a different service request
 * Protected: Admin only
 * Body: { new_technician_id }
 */
router.patch(
    "/:id/reassign",
    authenticateUser,
    authorizeRoles("admin"),
    validateRequestBody,
    AssignmentController.reassignTechnicianController
);

/**
 * GET /assignments/request/:requestId
 * Get all assignments for a specific service request
 * Protected: authenticateUser
 */
router.get(
    "/request/:requestId",
    authenticateUser,
    AssignmentController.getAssignmentsByRequestController
);

/**
 * GET /assignments/technician/:technicianId
 * Get all assignments for a specific technician
 * Protected: authenticateUser
 */
router.get(
    "/technician/:technicianId",
    authenticateUser,
    AssignmentController.getTechnicianAssignmentsController
);

export default router;
