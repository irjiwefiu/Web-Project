import { Router } from "express";
import AssignmentController from "../controllers/assignment.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validateRequestBody } from "../middlewares/validation.middleware.js";

const router = Router();

/**
 * POST /assignments/apply
 * Technicians apply for available service requests
 * Protected: Technician only
 * Body: { request_id }
 */
router.post(
    "/apply",
    authenticateUser,
    authorizeRoles("technician"),
    validateRequestBody,
    AssignmentController.applyForRequestController
);

/**
 * GET /assignments/request/:requestId/applications
 * Get pending applications for a request
 * Protected: authenticateUser
 */
router.get(
    "/request/:requestId/applications",
    authenticateUser,
    AssignmentController.getRequestApplicationsController
);

/**
 * PATCH /assignments/:id/accept
 * Accept a technician's application
 * Protected: Customer only
 */
router.patch(
    "/:id/accept",
    authenticateUser,
    authorizeRoles("customer"),
    AssignmentController.acceptApplicationController
);

/**
 * DELETE /assignments/:id/reject
 * Reject an application
 * Protected: Customer only
 */
router.delete(
    "/:id/reject",
    authenticateUser,
    authorizeRoles("customer"),
    AssignmentController.rejectApplicationController
);

/**
 * POST /assignments/admin/assign
 * Admin directly assigns a technician
 * Protected: Admin only
 * Body: { request_id, technician_id }
 */
router.post(
    "/admin/assign",
    authenticateUser,
    authorizeRoles("admin"),
    validateRequestBody,
    AssignmentController.adminAssignTechnicianController
);

/**
 * POST /assignments
 * Legacy assignment endpoint
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
