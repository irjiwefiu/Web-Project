import AssignmentRepository from "../repositories/assignment.repository.js";
import ServiceRequestRepository from "../repositories/serviceRequest.repository.js";
import StatusHistoryRepository from "../repositories/statusHistory.repository.js";
import TechnicianRepository from "../repositories/technician.repository.js";
import AppDataSource from "../config/data-source.js";

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

        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(requestId);
        if (!latestStatus || latestStatus.status !== "requested") {
            throw new Error("Request is already assigned or closed.");
        }

        await this.checkTechnicianAvailability(technicianId);
        return request;
    },

    /**
     * applyForRequest: Allow technicians to apply for available service requests
     * Status: "applied" - pending customer review
     */
    async applyForRequest(requestId, technicianId) {
        const request = await ServiceRequestRepository.findServiceRequestById(requestId);
        if (!request) throw new Error("Request not found.");

        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(requestId);
        if (!latestStatus || latestStatus.status !== "requested") {
            throw new Error("This request is not open for applications.");
        }

        await this.checkTechnicianAvailability(technicianId);

        // Check if technician already applied (any status: applied, accepted, rejected)
        const existing = await AssignmentRepository.findExistingApplication(requestId, technicianId);
        if (existing) {
            if (existing.status === "applied") {
                throw new Error("You have already applied for this request.");
            }
            if (existing.status === "accepted") {
                throw new Error("You have already been accepted for this request.");
            }
            if (existing.status === "rejected") {
                throw new Error("Your application for this request was rejected.");
            }
            throw new Error("You cannot apply for this request again.");
        }

        // Create application with status "applied"
        return await AssignmentRepository.createAssignment({
            request: { id: requestId },
            technician: { id: technicianId },
            assigned_by: null,
            status: "applied",
        });
    },

    /**
     * getRequestApplications: View pending applications for a request (for customers)
     * Only returns applications with status "applied"
     */
    async getRequestApplications(requestId) {
        return await AssignmentRepository.getRequestApplications(requestId);
    },

    /**
     * acceptApplication: Customer accepts one of the pending applications
     * - Sets accepted application status to "accepted"
     * - Sets all other applications for this request to "rejected"
     * - Updates request status to "assigned"
     * - Marks technician as busy
     */
    async acceptApplication(applicationId, customerId) {
        const application = await AssignmentRepository.findOne({
            where: { id: applicationId },
            relations: ["technician", "request", "request.customer"]
        });

        if (!application) throw new Error("Application not found.");
        if (application.status === "accepted") throw new Error("This application was already accepted.");
        if (application.status === "rejected") throw new Error("This application was already rejected.");
        if (!application.request || !application.request.customer || application.request.customer.id !== customerId) {
            throw new Error("Unauthorized.");
        }

        return await AppDataSource.transaction(async (manager) => {
            const assignmentRepo = manager.withRepository(AssignmentRepository);
            const historyRepo = manager.withRepository(StatusHistoryRepository);
            const techRepo = manager.withRepository(TechnicianRepository);

            // 1. Accept the selected application
            await assignmentRepo.update(applicationId, {
                status: "accepted",
                assigned_by: { id: customerId },
            });

            // 2. Reject all other APPLIED applications for this request
            //    (The selected app is already "accepted" so it won't be affected)
            await assignmentRepo.update(
                {
                    request: { id: application.request.id },
                    status: "applied",
                },
                { status: "rejected" }
            );

            // 3. Update request status to "assigned"
            await historyRepo.createStatusHistory(application.request.id, customerId, "assigned");

            // 4. Mark technician as busy
            await techRepo.update(
                { user: { id: application.technician.id } },
                { availability_status: "busy" }
            );

            return { success: true, acceptedTechnicianId: application.technician.id };
        });
    },

    /**
     * rejectApplication: Customer rejects an application
     * - Sets application status to "rejected" instead of deleting
     */
    async rejectApplication(applicationId, customerId) {
        const application = await AssignmentRepository.findOne({
            where: { id: applicationId },
            relations: ["request", "request.customer"]
        });

        if (!application) throw new Error("Application not found.");
        if (application.status !== "applied") {
            throw new Error("This application cannot be rejected (already " + application.status + ").");
        }
        if (!application.request || !application.request.customer || application.request.customer.id !== customerId) {
            throw new Error("Unauthorized.");
        }

        // Mark as rejected instead of deleting
        await AssignmentRepository.update(applicationId, { status: "rejected" });
        return { success: true };
    },

    /**
     * adminAssignTechnician: Admin can directly assign (bypass application process)
     */
    async adminAssignTechnician(requestId, technicianId, adminId) {
        const request = await this.validateAssignment(requestId, technicianId);

        return await AppDataSource.transaction(async (manager) => {
            const assignmentRepo = manager.withRepository(AssignmentRepository);
            const historyRepo = manager.withRepository(StatusHistoryRepository);
            const techRepo = manager.withRepository(TechnicianRepository);

            // 1. Create direct assignment with adminId, status "accepted"
            const assignment = await assignmentRepo.save({
                request: { id: requestId },
                technician: { id: technicianId },
                assigned_by: { id: adminId },
                status: "accepted",
            });

            // 2. Reject any pending applications for this request
            await assignmentRepo.update(
                { request: { id: requestId }, status: "applied" },
                { status: "rejected" }
            );

            // 3. Log Status History
            await historyRepo.createStatusHistory(requestId, adminId, "assigned");

            // 4. Mark Technician as busy
            await techRepo.update(
                { user: { id: technicianId } },
                { availability_status: "busy" }
            );

            return assignment;
        });
    },

    /**
     * reassignTechnician: Moves job from one tech to another
     */
    async reassignTechnician(requestId, newTechnicianId, adminId) {
        return await AppDataSource.transaction(async (manager) => {
            const techRepo = manager.withRepository(TechnicianRepository);
            const assignmentRepo = manager.withRepository(AssignmentRepository);

            // Find current active assignment
            const currentAssignment = await AssignmentRepository.getActiveAssignmentByRequest(requestId);

            // Mark old technician as available again
            if (currentAssignment) {
                await techRepo.update(
                    { user: { id: currentAssignment.technician.id } },
                    { availability_status: "available" }
                );
                // Mark old assignment as rejected
                await assignmentRepo.update(currentAssignment.id, { status: "rejected" });
            }

            // Perform new assignment
            return await this.adminAssignTechnician(requestId, newTechnicianId, adminId);
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
    },

    /**
     * getTechnicianAppliedAssignments: Only "applied" status assignments
     */
    async getTechnicianAppliedAssignments(technicianId) {
        return await AssignmentRepository.getTechnicianAssignmentsByStatus(technicianId, ["applied"]);
    },

    /**
     * getTechnicianActiveAssignments: Only "accepted" status assignments
     */
    async getTechnicianActiveAssignments(technicianId) {
        return await AssignmentRepository.getTechnicianAssignmentsByStatus(technicianId, ["accepted"]);
    },
};

export default AssignmentService;