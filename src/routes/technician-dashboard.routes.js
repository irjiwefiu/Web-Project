const express = require("express");
const DashboardController = require("../controllers/dashboard.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

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

module.exports = router;
