const { AppDataSource } = require("../config/data-source");
const Review = require("../entities/Review");

const ReviewRepository = AppDataSource.getRepository(Review).extend({
    
    // 1. Create a new review
    async createReview(data) {
        const review = this.create(data);
        return await this.save(review);
    },

    // 2. Find a specific review by the associated Request ID
    async findReviewByRequest(requestId) {
        return await this.findOne({
            where: { request: { id: requestId } },
            relations: ["reviewer", "technician"]
        });
    },

    // 3. Get all reviews for a specific technician (to calculate reputation)
    async getReviewsByTechnician(technicianId) {
        return await this.find({
            where: { technician: { id: technicianId } },
            relations: ["reviewer", "request"],
            order: { created_at: "DESC" }
        });
    },

    // 4. Get all reviews written by a specific customer
    async getReviewsByCustomer(customerId) {
        return await this.find({
            where: { reviewer: { id: customerId } },
            relations: ["technician", "request"],
            order: { created_at: "DESC" }
        });
    },

    // 5. Update an existing review (e.g., customer changes their mind)
    async updateReview(reviewId, updateData) {
        await this.update(reviewId, updateData);
        return await this.findOneBy({ id: reviewId });
    },

    // 6. Delete a review
    async deleteReview(reviewId) {
        return await this.delete(reviewId);
    },

    // Existing: Calculate average rating
    async getTechnicianRating(technicianId) {
        const result = await this.createQueryBuilder("review")
            .select("AVG(review.rating)", "average")
            .where("review.technician_id = :technicianId", { technicianId })
            .getRawOne();
            
        return parseFloat(result.average) || 0.0;
    }
});

module.exports = ReviewRepository;