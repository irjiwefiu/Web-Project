// src/repositories/statusHistory.repository.js
const { AppDataSource } = require("../config/data-source");
const StatusHistory = require("../entities/StatusHistory");

const StatusHistoryRepository = AppDataSource.getRepository(StatusHistory).extend({
    
    // 1. Create a history log entry
    async createLog(logData) {
        const log = this.create(logData);
        return await this.save(log);
    },

    // 2. Get the full timeline for a specific Request
    async getHistoryByRequest(requestId) {
        return await this.find({
            where: { request: { id: requestId } },
            relations: ["updated_by"],
            order: { created_at: "ASC" } // ASC shows the story from start to finish
        });
    }
});

module.exports = StatusHistoryRepository;