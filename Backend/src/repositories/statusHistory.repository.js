import AppDataSource from "../config/data-source.js";
import StatusHistory from "../entities/StatusHistory.js";

const StatusHistoryRepository = AppDataSource.getRepository(StatusHistory).extend({
    
    // 1. createStatusHistory (Aliased as logStatusChange for clarity)
    async createStatusHistory(requestId, userId, newStatus) {
        const history = this.create({
            request: { id: requestId },
            updated_by: { id: userId },
            status: newStatus
        });
        return await this.save(history);
    },

    // 2. getStatusHistoryByRequest - Returns the full timeline of a request
    async getStatusHistoryByRequest(requestId) {
        return await this.find({
            where: { request: { id: requestId } },
            relations: ["updated_by"], // See who made the change (Admin, Technician, or Customer)
            order: { updated_at: "ASC" } // ASC shows the journey from start to finish
        });
    },

    // 3. getLatestStatusByRequest - Fetches the single most recent history entry
    async getLatestStatusByRequest(requestId) {
        return await this.findOne({
            where: { request: { id: requestId } },
            relations: ["updated_by"],
            order: { updated_at: "DESC" }
        });
    }
});

export default StatusHistoryRepository;