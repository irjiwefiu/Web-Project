import StatusService from "../services/status.service.js";

/**
 * StatusController
 * Manages the lifecycle transitions of a service request and its audit trail.
 */
const StatusController = {

    /**
     * updateServiceStatusController
     * PATCH /status/:requestId
     * Access: Technicians (for progress) or Admins (for overrides)
     */
    async updateServiceStatusController(req, res, next) {
        try {
            const { requestId } = req.params;
            const { status, notes } = req.body;
            
            // req.user.id is the person performing the update
            const result = await StatusService.updateServiceStatus(
                requestId, 
                req.user.id, 
                status, 
                notes
            );

            return res.status(200).json({
                success: true,
                message: `Status updated to '${status}' successfully.`,
                data: result
            });
        } catch (error) {
            // Catches "Invalid transition" errors from the Service layer
            next(error);
        }
    },

    /**
     * getServiceStatusHistoryController
     * GET /status/:requestId/history
     * Access: All involved parties (Admin, Customer, Assigned Technician)
     */
    async getServiceStatusHistoryController(req, res, next) {
        try {
            const { requestId } = req.params;
            const history = await StatusService.getServiceStatusHistory(requestId);

            return res.status(200).json({
                success: true,
                count: history.length,
                data: history
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getCurrentServiceStatusController
     * GET /status/:requestId/current
     */
    async getCurrentServiceStatusController(req, res, next) {
        try {
            const { requestId } = req.params;
            const currentStatus = await StatusService.getCurrentServiceStatus(requestId);

            return res.status(200).json({
                success: true,
                data: currentStatus
            });
        } catch (error) {
            next(error);
        }
    }
};

export default StatusController;