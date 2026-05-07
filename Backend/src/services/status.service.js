import StatusHistoryRepository from "../repositories/statusHistory.repository.js";
import ServiceRequestRepository from "../repositories/serviceRequest.repository.js";
import TechnicianRepository from "../repositories/technician.repository.js";
import AppDataSource from "../config/data-source.js";

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
    async logStatusChange(manager, requestId, userId, status) {
        const historyRepo = manager.withRepository(StatusHistoryRepository);
        return await historyRepo.createStatusHistory(requestId, userId, status);
    },

    /**
     * updateServiceStatus: The primary method for technicians/admins to progress a job.
     */
    async updateServiceStatus(requestId, userId, nextStatus) {
        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(requestId);
        if (!latestStatus) throw new Error("Service request not found.");

        // 1. Validate the flow
        this.validateStatusTransition(latestStatus.status, nextStatus);

        return await AppDataSource.transaction(async (manager) => {
            const techRepo = manager.withRepository(TechnicianRepository);

            // 2. Log to history
            await this.logStatusChange(manager, requestId, userId, nextStatus);

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

export default StatusService;