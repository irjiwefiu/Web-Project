import express from "express";
import ServiceRequestController from "../controllers/serviceRequest.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * Service Request Search & Discovery Routes (Technician-focused)
 */

/**
 * GET /search/requests/available
 * Get all available service requests (status: requested)
 * Protected: Technician only
 * Query params: category_id, area, sort_by
 */
router.get(
    "/requests/available",
    authenticateUser,
    authorizeRoles("technician"),
    ServiceRequestController.getAvailableServiceRequestsController
);

/**
 * GET /search/requests/keyword
 * Search available requests by keywords in title/description
 * Protected: Technician only
 * Query params: q (search query), category_id
 */
router.get(
    "/requests/keyword",
    authenticateUser,
    authorizeRoles("technician"),
    ServiceRequestController.searchAvailableRequestsController
);

/**
 * GET /search/requests/category/:categoryId
 * Get available requests by category
 * Protected: Technician only
 */
router.get(
    "/requests/category/:categoryId",
    authenticateUser,
    authorizeRoles("technician"),
    ServiceRequestController.getAvailableRequestsByCategoryController
);

export default router;
