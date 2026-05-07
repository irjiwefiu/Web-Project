import AppDataSource from "../config/data-source.js";
import Assignment from "../entities/Assignment";

const AssignmentRepository = AppDataSource.getRepository(Assignment).extend({
    
    // 1. Create a new assignment
    async createAssignment(data) {
        const assignment = this.create(data);
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

    // 4. Get all assignments for a specific technician
    async getAssignmentsByTechnician(technicianId) {
        return await this.find({
            where: { technician: { id: technicianId } },
            relations: ["request", "request.category"],
            order: { assigned_at: "DESC" }
        });
    },

    // 5. Get the most recent/active assignment for a request
    async getActiveAssignmentByRequest(requestId) {
        return await this.findOne({
            where: { request: { id: requestId } },
            relations: ["technician"],
            order: { assigned_at: "DESC" }
        });
    },

    // 6. Get technician schedule for a specific date
    async getTechnicianAssignmentsByDate(technicianId, dateString) {
        // dateString format: 'YYYY-MM-DD'
        return await this.createQueryBuilder("assignment")
            .leftJoinAndSelect("assignment.request", "request")
            .where("assignment.technician_id = :technicianId", { technicianId })
            .andWhere("DATE(request.preferred_time) = :date", { date: dateString })
            .getMany();
    },

    // 7. Delete an assignment (Re-assignment or Cancellation logic)
    async deleteAssignment(id) {
        return await this.delete(id);
    },

    // Existing check for technician conflicts
    async isTechnicianBusy(technicianId, preferredTime) {
        const conflict = await this.createQueryBuilder("assignment")
            .leftJoin("assignment.request", "request")
            .where("assignment.technician_id = :technicianId", { technicianId })
            .andWhere("request.preferred_time = :preferredTime", { preferredTime })
            .getOne();

        return !!conflict;
    }
});

export default AssignmentRepository;