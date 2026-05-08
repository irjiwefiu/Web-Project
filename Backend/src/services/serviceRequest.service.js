import ServiceRequestRepository from "../repositories/serviceRequest.repository.js";
import StatusHistoryRepository from "../repositories/statusHistory.repository.js";
import AppDataSource from "../config/data-source.js";

const ServiceRequestService = {

    /**
     * validateServiceRequestCreation: Business logic checks before saving.
     */
    validateServiceRequestCreation(data) {
        if (!data.title || data.title.length < 5) {
            throw new Error("Title is too short.");
        }

        const preferredValue = data.preferred_time ?? data.preferredDate
        if (preferredValue) {
            const preferredTime = new Date(preferredValue);
            if (preferredTime.toString() === 'Invalid Date') {
                throw new Error("Preferred time is invalid.");
            }
            if (preferredTime < new Date()) {
                throw new Error("Preferred time cannot be in the past.");
            }
        }
    },

    normalizeStatus(status) {
        if (!status) return "requested";
        const value = String(status).toLowerCase();
        if (value.includes("in progress")) return "in_progress";
        if (value.includes("completed")) return "completed";
        if (value.includes("cancelled")) return "cancelled";
        if (value.includes("assigned")) return "assigned";
        if (value.includes("pending")) return "pending";
        if (value.includes("requested")) return "requested";
        return value.replace(/\s+/g, "_");
    },

    async attachRequestStatus(request) {
        if (!request) return request;
        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(request.id);
        request.status = this.normalizeStatus(latestStatus?.status || "requested");
        return request;
    },

    async attachStatusToRequests(requests) {
        return await Promise.all(requests.map((request) => this.attachRequestStatus(request)));
    },

    async getAllServiceRequests() {
        const requests = await ServiceRequestRepository.getAllServiceRequests();
        return await this.attachStatusToRequests(requests);
    },

    /**
     * createServiceRequest: Initializes a job and logs the first status.
     */
    async createServiceRequest(customerId, requestData) {
        this.validateServiceRequestCreation(requestData);

        const payload = {
            ...requestData,
            category: requestData.categoryId
                ? { id: requestData.categoryId }
                : requestData.category,
            preferred_time: requestData.preferred_time ?? requestData.preferredDate,
        };

        return await AppDataSource.transaction(async (manager) => {
            const requestRepo = manager.withRepository(ServiceRequestRepository);
            const historyRepo = manager.withRepository(StatusHistoryRepository);

            // 1. Create the request
            const newRequest = await requestRepo.createServiceRequest({
                ...payload,
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

            return await requestRepo.findServiceRequestById(newRequest.id);
        });
    },

    /**
     * getServiceRequestById: Fetches full details including customer and category.
     */
    async getServiceRequestById(requestId) {
        const request = await ServiceRequestRepository.findServiceRequestById(requestId);
        if (!request) throw new Error("Service request not found.");
        return await this.attachRequestStatus(request);
    },

    /**
     * getCustomerRequests: History of jobs for a specific user.
     */
    async getCustomerRequests(customerId) {
        const requests = await ServiceRequestRepository.getServiceRequestsByCustomer(customerId);
        return await this.attachStatusToRequests(requests);
    },

    /**
     * updateServiceRequest: Modify details (only if still in 'requested' state).
     */
    async updateServiceRequest(requestId, userId, updateData) {
        const request = await this.getServiceRequestById(requestId);
        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(requestId);

        if (!latestStatus || latestStatus.status !== "requested") {
            throw new Error("Cannot modify a request that is already in progress.");
        }

        if (request.customer.id !== userId) {
            throw new Error("Unauthorized to update this request.");
        }

        return await ServiceRequestRepository.updateServiceRequest(requestId, updateData);
    },

    /**
     * cancelServiceRequest: Specific logic for termination.
     */
    async cancelServiceRequest(requestId, userId, reason = "") {
        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(requestId);
        if (!latestStatus || latestStatus.status === "completed" || latestStatus.status === "cancelled") {
            throw new Error("Cannot cancel a request that is already completed or cancelled.");
        }

        return await AppDataSource.transaction(async (manager) => {
            const historyRepo = manager.withRepository(StatusHistoryRepository);
            await historyRepo.createStatusHistory(requestId, userId, "cancelled");

            return { message: "Request cancelled successfully" };
        });
    },

    /**
     * filterServiceRequests: Advanced filtering by status, category, etc.
     */
    async filterServiceRequests(filters) {
        const where = {}
        let statusFilter

        if (filters.category_id || filters.categoryId) {
            where.category = { id: Number(filters.category_id || filters.categoryId) }
        }

        if (filters.customer_id || filters.customerId) {
            where.customer = { id: Number(filters.customer_id || filters.customerId) }
        }

        if (filters.status) {
            statusFilter = this.normalizeStatus(filters.status)
        }

        const requests = await ServiceRequestRepository.find({
            where,
            relations: ["category", "customer", "status_history"]
        });

        let enrichedRequests = await this.attachStatusToRequests(requests)

        if (statusFilter) {
            enrichedRequests = enrichedRequests.filter((r) => r.status === statusFilter)
        }

        if (filters.urgency) {
            enrichedRequests = enrichedRequests.filter((r) => r.urgency === filters.urgency)
        }

        if (filters.location) {
            enrichedRequests = enrichedRequests.filter((r) => String(r.location).toLowerCase().includes(String(filters.location).toLowerCase()))
        }

        return enrichedRequests
    },

    /**
     * searchServiceRequests: Text search on title/description.
     */
    async searchServiceRequests(query) {
        const requests = await ServiceRequestRepository.searchServiceRequests(query);
        return await this.attachStatusToRequests(requests);
    }
};

export default ServiceRequestService;