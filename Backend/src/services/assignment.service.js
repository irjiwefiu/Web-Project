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
     */
    async applyForRequest(requestId, technicianId) {
        const request = await ServiceRequestRepository.findServiceRequestById(requestId);
        if (!request) throw new Error("Request not found.");

        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(requestId);
        if (!latestStatus || latestStatus.status !== "requested") {
            throw new Error("This request is not open for applications.");
        }

        await this.checkTechnicianAvailability(technicianId);

        // Check if technician already applied
        const existing = await AssignmentRepository.findOne({
            where: { 
                request: { id: requestId },
                technician: { id: technicianId },
                assigned_by: null
            }
        });

        if (existing) {
            throw new Error("You have already applied for this request.");
        }

        // Create application (assigned_by is NULL to indicate pending application)
        return await AssignmentRepository.createAssignment({
            request: { id: requestId },
            technician: { id: technicianId },
            assigned_by: null
        });
    },

    /**
     * getRequestApplications: View pending applications for a request (for customers)
     */
    async getRequestApplications(requestId) {
        return await AssignmentRepository.getRequestApplications(requestId);
    },

    /**
     * acceptApplication: Customer accepts one of the pending applications
     */
    async acceptApplication(applicationId, customerId) {
        const application = await AssignmentRepository.findOne({
            where: { id: applicationId },
            relations: ["technician", "request"]
        });

        if (!application) throw new Error("Application not found.");
        if (application.assigned_by !== null) throw new Error("This application was already accepted.");
        if (application.request.customer.id !== customerId) throw new Error("Unauthorized.");

        return await AppDataSource.transaction(async (manager) => {
            const assignmentRepo = manager.withRepository(AssignmentRepository);
            const historyRepo = manager.withRepository(StatusHistoryRepository);
            const techRepo = manager.withRepository(TechnicianRepository);

            // 1. Accept the application
            await assignmentRepo.update(applicationId, { assigned_by: { id: customerId } });

            // 2. Reject all other applications for this request
            const otherApps = await AssignmentRepository.find({
                where: { 
                    request: { id: application.request.id },
                    assigned_by: null
                }
            });

            for (const app of otherApps) {
                if (app.id !== applicationId) {
                    await assignmentRepo.delete(app.id);
                }
            }

            // 3. Update request status
            await historyRepo.createStatusHistory(application.request.id, customerId, "assigned");

            // 4. Mark technician as busy
            await techRepo.update({ user: { id: application.technician.id } }, { availability_status: "busy" });

            return { success: true };
        });
    },

    /**
     * rejectApplication: Customer rejects an application
     */
    async rejectApplication(applicationId, customerId) {
        const application = await AssignmentRepository.findOne({
            where: { id: applicationId },
            relations: ["request"]
        });

        if (!application) throw new Error("Application not found.");
        if (application.request.customer.id !== customerId) throw new Error("Unauthorized.");

        return await AssignmentRepository.delete(applicationId);
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

            // 1. Create direct assignment with adminId
            const assignment = await assignmentRepo.save({
                request: { id: requestId },
                technician: { id: technicianId },
                assigned_by: { id: adminId }
            });

            // 2. Delete any pending applications
            const pendingApps = await AssignmentRepository.find({
                where: { request: { id: requestId }, assigned_by: null }
            });

            for (const app of pendingApps) {
                await assignmentRepo.delete(app.id);
            }

            // 3. Log Status History
            await historyRepo.createStatusHistory(requestId, adminId, "assigned");

            // 4. Mark Technician as busy
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
            const assignmentRepo = manager.withRepository(AssignmentRepository);
            const currentAssignment = await AssignmentRepository.getActiveAssignmentByRequest(requestId);

            // Mark old technician as available again
            if (currentAssignment) {
                await techRepo.update(
                    { user: { id: currentAssignment.technician.id } }, 
                    { availability_status: "available" }
                );
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
    }
};

export default AssignmentService;