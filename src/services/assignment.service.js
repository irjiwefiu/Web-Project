const AssignmentRepository = require("../repositories/assignment.repository");
const ServiceRequestRepository = require("../repositories/serviceRequest.repository");
const StatusHistoryRepository = require("../repositories/statusHistory.repository");
const TechnicianRepository = require("../repositories/technician.repository");
const { AppDataSource } = require("../config/data-source");

const AssignmentService = {

    /**
     * checkTechnicianAvailability: Basic check of status
     */
    async checkTechnicianAvailability(technicianId) {
        const profile = await TechnicianRepository.findTechnicianProfileByUserId(technicianId);
        if (!profile || profile.availability_status !== "available") {
            throw new Error("Technician is currently unavailable or busy.");
        }
        return profile;
    },

    /**
     * preventDoubleBooking: Ensures no time conflicts
     */
    async preventDoubleBooking(technicianId, preferredTime) {
        const isBusy = await AssignmentRepository.isTechnicianBusy(technicianId, preferredTime);
        if (isBusy) {
            throw new Error("Technician already has a scheduled job at this time.");
        }
    },

    /**
     * validateAssignment: Combined logic for checking if assignment is possible
     */
    async validateAssignment(requestId, technicianId) {
        const request = await ServiceRequestRepository.findServiceRequestById(requestId);
        if (!request) throw new Error("Request not found.");
        if (request.status !== "requested") throw new Error("Request is already assigned or closed.");

        await this.checkTechnicianAvailability(technicianId);
        await this.preventDoubleBooking(technicianId, request.preferred_time);

        return request;
    },

    /**
     * assignTechnicianToRequest: The primary dispatch function
     */
    async assignTechnicianToRequest(requestId, technicianId, adminId) {
        const request = await this.validateAssignment(requestId, technicianId);

        return await AppDataSource.transaction(async (manager) => {
            const assignmentRepo = manager.withRepository(AssignmentRepository);
            const requestRepo = manager.withRepository(ServiceRequestRepository);
            const historyRepo = manager.withRepository(StatusHistoryRepository);
            const techRepo = manager.withRepository(TechnicianRepository);

            // 1. Create Assignment record
            const assignment = await assignmentRepo.save({
                request: { id: requestId },
                technician: { id: technicianId },
                assigned_by: { id: adminId }
            });

            // 2. Update Service Request status
            await requestRepo.update(requestId, { status: "assigned" });

            // 3. Log Status History
            await historyRepo.createStatusHistory(requestId, adminId, "assigned", `Technician assigned by admin ID: ${adminId}`);

            // 4. Update Technician Profile to 'busy'
            await techRepo.update({ user: { id: technicianId } }, { availability_status: "busy" });

            return assignment;
        });
    },

    /**
     * reassignTechnician: Moves job from one tech to another
     */
    async reassignTechnician(requestId, newTechnicianId, adminId) {
        return await AppDataSource.transaction(async (manager) => {
            const techRepo = manager.withRepository(TechnicianRepository);
            const currentAssignment = await AssignmentRepository.getActiveAssignmentByRequest(requestId);

            // Mark old technician as available again
            if (currentAssignment) {
                await techRepo.update(
                    { user: { id: currentAssignment.technician.id } }, 
                    { availability_status: "available" }
                );
            }

            // Perform new assignment
            return await this.assignTechnicianToRequest(requestId, newTechnicianId, adminId);
        });
    },

    /**
     * getAssignmentsByRequest: Full history of who was assigned to a job
     */
    async getAssignmentsByRequest(requestId) {
        return await AssignmentRepository.getAssignmentsByRequest(requestId);
    },

    /**
     * getTechnicianAssignments: List of jobs for a specific technician
     */
    async getTechnicianAssignments(technicianId) {
        return await AssignmentRepository.getAssignmentsByTechnician(technicianId);
    }
};

module.exports = AssignmentService;