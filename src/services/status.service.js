const StatusHistoryRepository = require("../repositories/statusHistory.repository");
const ServiceRequestRepository = require("../repositories/serviceRequest.repository");
const TechnicianRepository = require("../repositories/technician.repository");
const { AppDataSource } = require("../config/data-source");

const StatusService = {

    /**
     * validateStatusTransition: Enforces logical flow of the service lifecycle.
     */
    validateStatusTransition(currentStatus, nextStatus) {
        const flow = {
            "requested": ["assigned", "cancelled"],
            "assigned": ["on_the_way", "cancelled"],
            "on_the_way": ["in_progress", "cancelled"],
            "in_progress": ["completed", "cancelled"],
            "completed": [], // Terminal state
            "cancelled": []  // Terminal state
        };

        if (!flow[currentStatus] || !flow[currentStatus].includes(nextStatus)) {
            throw new Error(`Invalid transition: Cannot move from '${currentStatus}' to '${nextStatus}'`);
        }
    },

    /**
     * logStatusChange: Internal helper to record the audit trail.
     */
    async logStatusChange(manager, requestId, userId, status, notes) {
        const historyRepo = manager.withRepository(StatusHistoryRepository);
        return await historyRepo.createStatusHistory(requestId, userId, status, notes);
    },

    /**
     * updateServiceStatus: The primary method for technicians/admins to progress a job.
     */
    async updateServiceStatus(requestId, userId, nextStatus, notes = "") {
        const request = await ServiceRequestRepository.findServiceRequestById(requestId);
        if (!request) throw new Error("Service request not found.");

        // 1. Validate the flow
        this.validateStatusTransition(request.status, nextStatus);

        return await AppDataSource.transaction(async (manager) => {
            const requestRepo = manager.withRepository(ServiceRequestRepository);
            const techRepo = manager.withRepository(TechnicianRepository);

            // 2. Update the main request status
            await requestRepo.update(requestId, { status: nextStatus });

            // 3. Log to history
            await this.logStatusChange(manager, requestId, userId, nextStatus, notes);

            // 4. Handle Technician Availability side-effects
            // If completed or cancelled, free up the technician
            if (nextStatus === "completed" || nextStatus === "cancelled") {
                const assignment = await manager.query(
                    `SELECT technician_id FROM assignments WHERE request_id = $1 ORDER BY assigned_at DESC LIMIT 1`,
                    [requestId]
                );
                
                if (assignment.length > 0) {
                    await techRepo.update(
                        { user: { id: assignment[0].technician_id } }, 
                        { availability_status: "available" }
                    );
                }
            }

            return { success: true, newStatus: nextStatus };
        });
    },

    /**
     * getServiceStatusHistory: Returns the full timeline of a request.
     */
    async getServiceStatusHistory(requestId) {
        return await StatusHistoryRepository.getStatusHistoryByRequest(requestId);
    },

    /**
     * getCurrentServiceStatus: Gets the most recent status entry.
     */
    async getCurrentServiceStatus(requestId) {
        return await StatusHistoryRepository.getLatestStatusByRequest(requestId);
    }
};

module.exports = UserService;