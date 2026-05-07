import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();


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

export default router;
