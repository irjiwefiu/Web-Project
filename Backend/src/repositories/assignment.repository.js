import AppDataSource from "../config/data-source.js";
import Assignment from "../entities/Assignment.js";
import { Not, IsNull, In } from "typeorm";

const AssignmentRepository = AppDataSource.getRepository(Assignment).extend({

    // 1. Create a new assignment (application)
    async createAssignment(data) {
        const assignment = this.create({
            ...data,
            status: data.status || "applied",
        });
        return await this.save(assignment);
    },

    // 2. Find a specific assignment by ID with all relations
    async findAssignmentById(id) {
        return await this.findOne({
            where: { id },
            relations: ["request", "technician", "assigned_by"]
        });
    },

    // 3. Get all assignments for a specific service request (History)
    async getAssignmentsByRequest(requestId) {
        return await this.find({
            where: { request: { id: requestId } },
            relations: ["technician", "assigned_by"],
            order: { assigned_at: "DESC" }
        });
    },

    // 4. Get all assignments for a specific technician (all statuses)
    async getAssignmentsByTechnician(technicianId) {
        return await this.find({
            where: { technician: { id: technicianId } },
            relations: ["request", "request.category", "request.customer"],
            order: { assigned_at: "DESC" }
        });
    },

    async findByTechnicianId(technicianId) {
        return await this.getAssignmentsByTechnician(technicianId);
    },

    async findAll() {
        return await this.find({
            relations: ["request", "technician", "assigned_by"],
            order: { assigned_at: "DESC" }
        });
    },

    // 5. Get the active (accepted) assignment for a request
    async getActiveAssignmentByRequest(requestId) {
        return await this.findOne({
            where: {
                request: { id: requestId },
                status: "accepted",
            },
            relations: ["technician"],
            order: { assigned_at: "DESC" }
        });
    },

    // 6. Get all pending applications for a request (status = 'applied')
    async getRequestApplications(requestId) {
        return await this.find({
            where: {
                request: { id: requestId },
                status: "applied",
            },
            relations: ["technician", "technician.technician_profile"],
            order: { assigned_at: "DESC" }
        });
    },

    // 7. Get technician schedule for a specific date
    async getTechnicianAssignmentsByDate(technicianId, dateString) {
        return await this.createQueryBuilder("assignment")
            .leftJoinAndSelect("assignment.request", "request")
            .where("assignment.technician_id = :technicianId", { technicianId })
            .andWhere("DATE(request.preferred_time) = :date", { date: dateString })
            .getMany();
    },

    // 8. Delete an assignment
    async deleteAssignment(id) {
        return await this.delete(id);
    },

    // 9. Check for technician conflicts
    async isTechnicianBusy(technicianId, preferredTime) {
        const conflict = await this.createQueryBuilder("assignment")
            .leftJoin("assignment.request", "request")
            .where("assignment.technician_id = :technicianId", { technicianId })
            .andWhere("request.preferred_time = :preferredTime", { preferredTime })
            .andWhere("assignment.status IN (:...statuses)", { statuses: ["accepted", "applied"] })
            .getOne();

        return !!conflict;
    },

    // 10. Check if technician already applied to a request (any status)
    async findExistingApplication(requestId, technicianId) {
        return await this.findOne({
            where: {
                request: { id: requestId },
                technician: { id: technicianId },
            },
        });
    },

    // 11. Get assignments by technician filtered by statuses
    async getTechnicianAssignmentsByStatus(technicianId, statuses) {
        return await this.find({
            where: {
                technician: { id: technicianId },
                status: In(statuses),
            },
            relations: ["request", "request.category", "request.customer"],
            order: { assigned_at: "DESC" }
        });
    },

    // 12. Bulk update assignment statuses for a request
    async bulkUpdateStatusByRequest(requestId, fromStatus, toStatus) {
        return await this.update(
            { request: { id: requestId }, status: fromStatus },
            { status: toStatus }
        );
    },
});

export default AssignmentRepository;