import ServiceRequestService from "../services/serviceRequest.service.js";

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
     */
    async searchServiceRequestsController(req, res, next) {
        try {
            const { q } = req.query;
            const requests = await ServiceRequestService.searchServiceRequests(q);
            return res.status(200).json({ success: true, data: requests });
        } catch (error) {
            next(error);
        }
    },

    async getAvailableRequestsController(req, res, next) {
        try {
            // Get all requests with 'requested' status (meaning unassigned)
            const requests = await ServiceRequestService.filterServiceRequests({ status: 'requested' });
            return res.status(200).json({ success: true, count: requests.length, data: requests });
        } catch (error) {
            next(error);
        }
    },

    async searchAvailableRequestsController(req, res, next) {
        try {
            const { q, category_id } = req.query;
            if (!q) return res.status(400).json({ success: false, message: "Search query required" });
            let requests = await ServiceRequestService.searchServiceRequests(q);
            if (category_id) requests = requests.filter(r => r.category?.id == category_id);
            return res.status(200).json({ success: true, count: requests.length, data: requests });
        } catch (error) {
            next(error);
        }
    },

    async getAvailableRequestsByCategoryController(req, res, next) {
        try {
            const { categoryId } = req.params;
            const requests = await ServiceRequestService.filterServiceRequests({ category_id: categoryId });
            return res.status(200).json({ success: true, count: requests.length, data: requests });
        } catch (error) {
            next(error);
        }
    }
};

export default ServiceRequestController;