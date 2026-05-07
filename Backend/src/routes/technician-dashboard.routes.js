import express from "express";
import DashboardController from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * Technician Dashboard Routes
 * All routes protected: User must be authenticated and have 'technician' role
 */

// GET /dashboards/technician
// Returns technician dashboard with assignments summary
router.get(
    "/technician",
    authenticateUser,
    authorizeRoles("technician"),
    DashboardController.getTechnicianDashboard
);

// GET /dashboards/technician/assignments
// Returns all assignments for the technician
router.get(
    "/technician/assignments",
    authenticateUser,
    authorizeRoles("technician"),
    DashboardController.getTechnicianAssignments
);

// GET /dashboards/technician/reviews
// Returns reviews received by the technician
router.get(
    "/technician/reviews",
    authenticateUser,
    authorizeRoles("technician"),
    DashboardController.getTechnicianReviews
);

// GET /dashboards/technician/profile
// Returns technician profile information
router.get(
    "/technician/profile",
    authenticateUser,
    authorizeRoles("technician"),
    DashboardController.getTechnicianProfile
);

export default router;
