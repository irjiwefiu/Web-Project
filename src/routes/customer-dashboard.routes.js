const express = require("express");
const DashboardController = require("../controllers/dashboard.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

const router = express.Router();

/**
 * Customer Dashboard Routes
 * All routes protected: User must be authenticated and have 'customer' role
 */

// GET /dashboards/customer
// Returns customer dashboard with service request summary
router.get(
    "/customer",
    authenticateUser,
    authorizeRoles("customer"),
    DashboardController.getCustomerDashboard
);

// GET /dashboards/customer/service-requests
// Returns all service requests for the logged-in customer
router.get(
    "/customer/service-requests",
    authenticateUser,
    authorizeRoles("customer"),
    DashboardController.getCustomerServiceRequests
);

// GET /dashboards/customer/reviews
// Returns reviews written by the customer
router.get(
    "/customer/reviews",
    authenticateUser,
    authorizeRoles("customer"),
    DashboardController.getCustomerReviews
);

module.exports = router;
