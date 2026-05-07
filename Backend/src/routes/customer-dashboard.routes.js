import express from "express";
import DashboardController from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

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

export default router;
