// src/repositories/serviceRequest.repository.js
import AppDataSource from "../config/data-source.js";
import ServiceRequest from "../entities/ServiceRequest.js";
import { Between, ILike } from "typeorm";

const ServiceRequestRepository = AppDataSource.getRepository(ServiceRequest).extend({

    // 1. Create Service Request
    async createServiceRequest(requestData) {
        const request = this.create(requestData);
        return await this.save(request);
    },

    // 2. Find by ID (with full details)
    async findServiceRequestById(id) {
        return await this.findOne({
            where: { id },
            relations: ["customer", "category", "status_history"]
        });
    },

    // 3. Get All (Admin view)
    async getAllServiceRequests() {
        return await this.find({
            relations: ["customer", "category", "status_history"],
            order: { id: "DESC" }
        });
    },

    // 4. Get by Customer
    async getServiceRequestsByCustomer(customerId) {
        return await this.find({
            where: { customer: { id: customerId } },
            relations: ["category", "status_history"],
            order: { id: "DESC" }
        });
    },

    // 5. Get by Status
    async getServiceRequestsByStatus(status) {
        return await this.find({
            where: { status },
            relations: ["customer", "category"]
        });
    },

    // 6. Get by Category
    async getServiceRequestsByCategory(categoryId) {
        return await this.find({
            where: { category: { id: categoryId } },
            relations: ["customer"]
        });
    },

    // 7. Get by Date Range (e.g., for reports or scheduling)
    async getServiceRequestsByDate(startDate, endDate) {
        return await this.find({
            where: {
                preferred_time: Between(startDate, endDate)
            },
            relations: ["customer", "category"]
        });
    },

    // 8. Search (By Title or Description)
    async searchServiceRequests(searchTerm) {
        return await this.find({
            where: [
                { title: ILike(`%${searchTerm}%`) },
                { description: ILike(`%${searchTerm}%`) }
            ],
            relations: ["customer", "category", "status_history"]
        });
    },

    // 9. Update Request Details
    async updateServiceRequest(id, updateData) {
        await this.update(id, updateData);
        return await this.findServiceRequestById(id);
    },

    // 10. Specifically Update Status
    async updateServiceRequestStatus(id, status) {
        return await this.save({ id, status });
    },

    // 11. Delete Request
    async deleteServiceRequest(id) {
        const result = await this.delete(id);
        return result.affected > 0;
    }
});

export default ServiceRequestRepository;