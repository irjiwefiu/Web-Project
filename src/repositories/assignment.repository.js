// src/repositories/assignment.repository.js
const { AppDataSource } = require("../config/data-source");
const Assignment = require("../entities/Assignment");
const { Between } = require("typeorm");

const AssignmentRepository = AppDataSource.getRepository(Assignment).extend({

    // 1. Create Assignment
    async createAssignment(assignmentData) {
        const assignment = this.create(assignmentData);
        return await this.save(assignment);
    },

    // 2. Find Assignment By ID
    async findAssignmentById(id) {
        return await this.findOne({
            where: { id },
            relations: ["request", "technician", "assigned_by"]
        });
    },

    // 3. Get all assignments for a specific Request (History of assignments)
    async getAssignmentsByRequest(requestId) {
        return await this.find({
            where: { request: { id: requestId } },
            relations: ["technician", "assigned_by"],
            order: { assigned_at: "DESC" }
        });
    },

    // 4. Get all assignments for a specific Technician
    async getAssignmentsByTechnician(technicianId) {
        return await this.find({
            where: { technician: { id: technicianId } },
            relations: ["request", "request.category"],
            order: { assigned_at: "DESC" }
        });
    },

    // 5. Get the most recent/active Assignment for a Request
    async getActiveAssignmentByRequest(requestId) {
        return await this.findOne({
            where: { request: { id: requestId } },
            relations: ["technician"],
            order: { assigned_at: "DESC" }
        });
    },

    // 6. Get Technician Assignments by Date Range (For reporting/payroll)
    async getTechnicianAssignmentsByDate(technicianId, startDate, endDate) {
        return await this.find({
            where: {
                technician: { id: technicianId },
                assigned_at: Between(startDate, endDate)
            },
            relations: ["request"]
        });
    },

    // 7. Delete Assignment (Unassign)
    async deleteAssignment(id) {
        const result = await this.delete(id);
        return result.affected > 0;
    }
});

module.exports = AssignmentRepository;