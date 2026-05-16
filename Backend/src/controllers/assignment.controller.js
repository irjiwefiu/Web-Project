import AssignmentService from "../services/assignment.service.js";

/**
 * AssignmentController
 * Handles the dispatching of technicians to service requests.
 */
const AssignmentController = {

    /**
     * applyForRequestController
     * POST /assignments/apply
     * Technicians apply for available service requests
     */
    async applyForRequestController(req, res, next) {
        try {
            const { request_id } = req.body;
            const application = await AssignmentService.applyForRequest(request_id, req.user.id);

            return res.status(201).json({
                success: true,
                message: "Application submitted successfully.",
                data: application
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getRequestApplicationsController
     * GET /assignments/request/:requestId/applications
     * Get pending applications for a request (customer view)
     */
    async getRequestApplicationsController(req, res, next) {
        try {
            const { requestId } = req.params;
            const applications = await AssignmentService.getRequestApplications(requestId);

            return res.status(200).json({
                success: true,
                count: applications.length,
                data: applications
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * acceptApplicationController
     * PATCH /assignments/:id/accept
     * Customer accepts a technician's application
     */
    async acceptApplicationController(req, res, next) {
        try {
            const { id } = req.params;
            const result = await AssignmentService.acceptApplication(id, req.user.id);

            return res.status(200).json({
                success: true,
                message: "Application accepted successfully.",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * rejectApplicationController
     * DELETE /assignments/:id/reject
     * Customer rejects an application
     */
    async rejectApplicationController(req, res, next) {
        try {
            const { id } = req.params;
            await AssignmentService.rejectApplication(id, req.user.id);

            return res.status(200).json({
                success: true,
                message: "Application rejected."
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * adminAssignTechnicianController
     * POST /assignments/admin/assign
     * Admin directly assigns a technician (bypass applications)
     */
    async adminAssignTechnicianController(req, res, next) {
        try {
            const { request_id, technician_id } = req.body;
            const assignment = await AssignmentService.adminAssignTechnician(
                request_id,
                technician_id,
                req.user.id
            );

            return res.status(201).json({
                success: true,
                message: "Technician assigned successfully by admin.",
                data: assignment
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * assignTechnicianController (LEGACY)
     * POST /assignments
     * Admin directly assigns a technician
     */
    async assignTechnicianController(req, res, next) {
        try {
            const { request_id, technician_id } = req.body;
            // req.user.id is the Admin/Dispatcher performing the action
            const assignment = await AssignmentService.adminAssignTechnician(
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
    },

    /**
     * getMyAssignmentsController
     * GET /assignments/my-assignments
     * Returns assignments for the logged-in technician
     */
    async getMyAssignmentsController(req, res, next) {
        try {
            const assignments = await AssignmentService.getTechnicianAssignments(req.user.id);

            return res.status(200).json({
                success: true,
                count: assignments.length,
                data: assignments
            });
        } catch (error) {
            next(error);
        }
    }
};

export default AssignmentController;