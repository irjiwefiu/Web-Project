const express = require("express");
const DashboardController = require("../controllers/dashboard.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const router = express.Router();

/**
 * Dashboard Routes
 * Role-based dashboard endpoints
 * Base path: /dashboard
 */

/**
 * GET /dashboard/admin
 * Admin dashboard with system overview
 * Protected: Admin only
 * Returns:
 *   - All requests
 *   - Assignment statistics
 *   - Technician workload
 *   - Completed/cancelled jobs
 *   - System overview
 */
router.get(
    "/admin",
    authenticateUser,
    authorizeRoles("admin"),
    DashboardController.getAdminDashboard
);

/**
 * GET /dashboard/customer
 * Customer dashboard with personal service requests
 * Protected: Customer only
 * Returns:
 *   - Upcoming requests
 *   - Previous requests
 *   - Current request statuses
 *   - Review history
 */
router.get(
    "/customer",
    authenticateUser,
    authorizeRoles("customer"),
    DashboardController.getCustomerDashboard
);

/**
 * GET /dashboard/technician
 * Technician dashboard with assigned work
 * Protected: Technician only
 * Returns:
 *   - Assigned jobs
 *   - Active jobs
 *   - Completed jobs
 *   - Availability status
 *   - Ratings/reviews
 */
router.get(
    "/technician",
    authenticateUser,
    authorizeRoles("technician"),
    DashboardController.getTechnicianDashboard
);

module.exports = router;
