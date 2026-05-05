// src/repositories/review.repository.js
const { AppDataSource } = require("../config/data-source");
const Review = require("../entities/Review");

const ReviewRepository = AppDataSource.getRepository(Review).extend({
    
    // 1. Create a Review
    async createReview(reviewData) {
        const review = this.create(reviewData);
        return await this.save(review);
    },

    // 2. Get Reviews for a specific Technician
    async getReviewsByTechnician(technicianId) {
        return await this.find({
            where: { technician: { id: technicianId } },
            relations: ["reviewer", "request"],
            order: { created_at: "DESC" }
        });
    },

    // 3. Find Review by Service Request ID
    async findByRequestId(requestId) {
        return await this.findOne({
            where: { request: { id: requestId } },
            relations: ["reviewer", "technician"]
        });
    },

    // 4. Calculate Average Rating (Utility for updating TechnicianProfile)
    async getAverageRating(technicianId) {
        const result = await this.createQueryBuilder("review")
            .select("AVG(review.rating)", "avg")
            .where("review.technician_id = :id", { id: technicianId })
            .getRawOne();
        return parseFloat(result.avg) || 0;
    }
});

module.exports = ReviewRepository;