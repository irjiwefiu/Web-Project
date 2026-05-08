import AppDataSource from "../config/data-source.js";
import StatusHistory from "../entities/StatusHistory.js";

const StatusHistoryRepository = AppDataSource.getRepository(StatusHistory).extend({

    // 1. createStatusHistory — MUST use relation name "service_request" (matches entity)
    async createStatusHistory(requestId, userId, newStatus) {
        const history = this.create({
            service_request: { id: requestId },  // entity relation is "service_request"
            updated_by: { id: userId },
            status: newStatus
        });
        return await this.save(history);
    },

    // 2. getStatusHistoryByRequest - Returns the full timeline of a request
    async getStatusHistoryByRequest(requestId) {
        return await this.find({
            where: { service_request: { id: requestId } },  // must match entity relation name
            relations: ["updated_by"],
            order: { updated_at: "ASC" }
        });
    },

    // 3. getLatestStatusByRequest - Fetches the single most recent history entry
    async getLatestStatusByRequest(requestId) {
        return await this.findOne({
            where: { service_request: { id: requestId } },  // must match entity relation name
            relations: ["updated_by"],
            order: { updated_at: "DESC" }
        });
    }
});

export default StatusHistoryRepository;