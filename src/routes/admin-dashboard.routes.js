const express = require("express");
const DashboardController = require("../controllers/dashboard.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const router = express.Router();

/**
 * Admin Dashboard Routes
 * All routes protected: User must be authenticated and have 'admin' role
 */

// GET /dashboards/admin
// Returns system-wide statistics and overview
router.get(
    "/admin",
    authenticateUser,
    authorizeRoles("admin"),
    DashboardController.getAdminDashboard
);

// GET /dashboards/admin/users
// Returns user management data
router.get(
    "/admin/users",
    authenticateUser,
    authorizeRoles("admin"),
    DashboardController.getAdminUserManagement
);

// GET /dashboards/admin/service-requests
// Returns all service requests with status breakdown
router.get(
    "/admin/service-requests",
    authenticateUser,
    authorizeRoles("admin"),
    DashboardController.getAdminServiceRequests
);

module.exports = router;
