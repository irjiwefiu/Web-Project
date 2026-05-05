const ServiceRequestRepository = require("../repositories/serviceRequest.repository");
const StatusHistoryRepository = require("../repositories/statusHistory.repository");
const { AppDataSource } = require("../config/data-source");

const ServiceRequestService = {

    /**
     * validateServiceRequestCreation: Business logic checks before saving.
     */
    validateServiceRequestCreation(data) {
        if (!data.title || data.title.length < 5) {
            throw new Error("Title is too short.");
        }
        const preferredTime = new Date(data.preferred_time);
        if (preferredTime < new Date()) {
            throw new Error("Preferred time cannot be in the past.");
        }
    },

    /**
     * createServiceRequest: Initializes a job and logs the first status.
     */
    async createServiceRequest(customerId, requestData) {
        this.validateServiceRequestCreation(requestData);

        return await AppDataSource.transaction(async (manager) => {
            const requestRepo = manager.withRepository(ServiceRequestRepository);
            const historyRepo = manager.withRepository(StatusHistoryRepository);

            // 1. Create the request
            const newRequest = await requestRepo.createServiceRequest({
                ...requestData,
                customer: { id: customerId },
                status: "requested"
            });

            // 2. Log initial status history
            await historyRepo.createStatusHistory(
                newRequest.id, 
                customerId, 
                "requested", 
                "Request created by customer"
            );

            return newRequest;
        });
    },

    /**
     * getServiceRequestById: Fetches full details including customer and category.
     */
    async getServiceRequestById(requestId) {
        const request = await ServiceRequestRepository.findServiceRequestById(requestId);
        if (!request) throw new Error("Service request not found.");
        return request;
    },

    /**
     * getCustomerRequests: History of jobs for a specific user.
     */
    async getCustomerRequests(customerId) {
        return await ServiceRequestRepository.getServiceRequestsByCustomer(customerId);
    },

    /**
     * updateServiceRequest: Modify details (only if still in 'requested' state).
     */
    async updateServiceRequest(requestId, userId, updateData) {
        const request = await this.getServiceRequestById(requestId);
        
        if (request.status !== "requested") {
            throw new Error("Cannot modify a request that is already in progress.");
        }

        return await ServiceRequestRepository.updateServiceRequest(requestId, updateData);
    },

    /**
     * cancelServiceRequest: Specific logic for termination.
     */
    async cancelServiceRequest(requestId, userId, reason = "") {
        return await AppDataSource.transaction(async (manager) => {
            const requestRepo = manager.withRepository(ServiceRequestRepository);
            const historyRepo = manager.withRepository(StatusHistoryRepository);

            await requestRepo.update(requestId, { status: "cancelled" });
            await historyRepo.createStatusHistory(requestId, userId, "cancelled", reason);

            return { message: "Request cancelled successfully" };
        });
    },

    /**
     * filterServiceRequests: Advanced filtering by status, category, etc.
     */
    async filterServiceRequests(filters) {
        // logic for repository to handle status/category arrays
        return await ServiceRequestRepository.find({
            where: filters,
            relations: ["category", "customer"]
        });
    },

    /**
     * searchServiceRequests: Text search on title/description.
     */
    async searchServiceRequests(query) {
        return await ServiceRequestRepository.searchServiceRequests(query);
    }
};

module.exports = ServiceRequestService;