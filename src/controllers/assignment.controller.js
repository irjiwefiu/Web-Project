const AssignmentService = require("../services/assignment.service");

/**
 * AssignmentController
 * Handles the dispatching of technicians to service requests.
 */
const AssignmentController = {

    /**
     * assignTechnicianController
     * POST /assignments
     * Access: Admin Only
     */
    async assignTechnicianController(req, res, next) {
        try {
            const { request_id, technician_id } = req.body;
            // req.user.id is the Admin/Dispatcher performing the action
            const assignment = await AssignmentService.assignTechnicianToRequest(
                request_id, 
                technician_id, 
                req.user.id
            );

            return res.status(201).json({
                success: true,
                message: "Technician successfully assigned to the request.",
                data: assignment
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * reassignTechnicianController
     * PATCH /assignments/:id/reassign
     * Access: Admin Only
     */
    async reassignTechnicianController(req, res, next) {
        try {
            const { id: request_id } = req.params;
            const { new_technician_id } = req.body;

            const result = await AssignmentService.reassignTechnician(
                request_id, 
                new_technician_id, 
                req.user.id
            );

            return res.status(200).json({
                success: true,
                message: "Technician reassigned successfully.",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getAssignmentsByRequestController
     * GET /assignments/request/:requestId
     */
    async getAssignmentsByRequestController(req, res, next) {
        try {
            const { requestId } = req.params;
            const assignments = await AssignmentService.getAssignmentsByRequest(requestId);

            return res.status(200).json({
                success: true,
                data: assignments
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechnicianAssignmentsController
     * GET /assignments/technician/:technicianId
     */
    async getTechnicianAssignmentsController(req, res, next) {
        try {
            const { technicianId } = req.params;
            const assignments = await AssignmentService.getTechnicianAssignments(technicianId);

            return res.status(200).json({
                success: true,
                data: assignments
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = AssignmentController;