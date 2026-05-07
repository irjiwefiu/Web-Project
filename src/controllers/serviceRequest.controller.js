const ServiceRequestService = require("../services/serviceRequest.service");

/**
 * ServiceRequestController
 * Handles the creation, management, and searchability of job bookings.
 */
const ServiceRequestController = {

    /**
     * createServiceRequestController
     * POST /requests
     */
    async createServiceRequestController(req, res, next) {
        try {
            // Use req.user.id from auth middleware to set the customer
            const request = await ServiceRequestService.createServiceRequest(req.user.id, req.body);
            
            return res.status(201).json({
                success: true,
                message: "Service request created and is now pending assignment.",
                data: request
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getServiceRequestByIdController
     * GET /requests/:id
     */
    async getServiceRequestByIdController(req, res, next) {
        try {
            const { id } = req.params;
            const request = await ServiceRequestService.getServiceRequestById(id);
            
            return res.status(200).json({
                success: true,
                data: request
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getAllServiceRequestsController
     * GET /requests
     * Access: Admin only (typically)
     */
    async getAllServiceRequestsController(req, res, next) {
        try {
            const requests = await ServiceRequestService.getAllServiceRequests();
            return res.status(200).json({
                success: true,
                count: requests.length,
                data: requests
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getCustomerRequestsController
     * GET /requests/customer/me
     */
    async getCustomerRequestsController(req, res, next) {
        try {
            const requests = await ServiceRequestService.getCustomerRequests(req.user.id);
            return res.status(200).json({
                success: true,
                data: requests
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * updateServiceRequestController
     * PATCH /requests/:id
     */
    async updateServiceRequestController(req, res, next) {
        try {
            const { id } = req.params;
            const updated = await ServiceRequestService.updateServiceRequest(id, req.user.id, req.body);
            return res.status(200).json({
                success: true,
                message: "Request updated successfully.",
                data: updated
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * cancelServiceRequestController
     * PATCH /requests/:id/cancel
     */
    async cancelServiceRequestController(req, res, next) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const result = await ServiceRequestService.cancelServiceRequest(id, req.user.id, reason);
            return res.status(200).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * filterServiceRequestsController
     * GET /requests/filter
     */
    async filterServiceRequestsController(req, res, next) {
        try {
            // Filters passed as query params (e.g., ?status=requested&category=1)
            const requests = await ServiceRequestService.filterServiceRequests(req.query);
            return res.status(200).json({
                success: true,
                data: requests
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * searchServiceRequestsController
     * GET /requests/search
     */
    async searchServiceRequestsController(req, res, next) {
        try {
            const { q } = req.query; // ?q=leaking pipe
            const requests = await ServiceRequestService.searchServiceRequests(q);
            return res.status(200).json({
                success: true,
                data: requests
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ServiceRequestController;