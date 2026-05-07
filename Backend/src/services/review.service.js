import ReviewRepository from "../repositories/review.repository.js";
import StatusHistoryRepository from "../repositories/statusHistory.repository.js";
import TechnicianService from "./technician.service.js";
import AppDataSource from "../config/data-source.js";

const ReviewService = {

    /**
     * validateReviewCreation: Ensures the job is finished (completed or cancelled) before review.
     */
    async validateReviewCreation(requestId, rating) {
        // 1. Check rating scale
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5.");
        }

        // 2. Check if request exists and is completed or cancelled
        const latestStatus = await StatusHistoryRepository.getLatestStatusByRequest(requestId);
        if (!latestStatus) throw new Error("Service request not found.");
        
        if (latestStatus.status !== "completed" && latestStatus.status !== "cancelled") {
            throw new Error("You can only review a completed or cancelled service.");
        }

        // 3. Check for existing review (One-to-One enforcement)
        const existingReview = await ReviewRepository.findReviewByRequest(requestId);
        if (existingReview) {
            throw new Error("A review for this service already exists.");
        }

        return latestStatus;
    },

    /**
     * createReview: Saves the review and triggers a technician rating recalculation.
     */
    async createReview(customerId, reviewData) {
        const { request_id, rating, comment, technician_id } = reviewData;

        await this.validateReviewCreation(request_id, rating);

        return await AppDataSource.transaction(async (manager) => {
            const reviewRepo = manager.withRepository(ReviewRepository);

            // 1. Create the review
            const review = await reviewRepo.save({
                rating,
                comment,
                request: { id: request_id },
                reviewer: { id: customerId },
                technician: { id: technician_id }
            });

            // 2. Update the Technician's cached average rating
            // We use the technician service to handle the denormalization logic
            await TechnicianService.calculateTechnicianRating(technician_id);

            return review;
        });
    },

    /**
     * getReviewByRequest: Fetch feedback for a specific job.
     */
    async getReviewByRequest(requestId) {
        return await ReviewRepository.findReviewByRequest(requestId);
    },

    /**
     * getTechnicianReviews: List of all feedback for a technician's profile.
     */
    async getTechnicianReviews(technicianId) {
        return await ReviewRepository.getReviewsByTechnician(technicianId);
    },

    /**
     * getCustomerReviews: List of all reviews written by a specific customer.
     */
    async getCustomerReviews(customerId) {
        return await ReviewRepository.getReviewsByCustomer(customerId);
    },

    /**
     * updateReview: Allows a customer to edit their feedback.
     */
    async updateReview(reviewId, customerId, updateData) {
        const review = await ReviewRepository.findOne({ 
            where: { id: reviewId, reviewer: { id: customerId } } 
        });

        if (!review) throw new Error("Review not found or unauthorized.");

        await ReviewRepository.updateReview(reviewId, updateData);

        // Recalculate rating in case the numerical score changed
        await TechnicianService.calculateTechnicianRating(review.technician.id);

        return { success: true };
    },

    /**
     * deleteReview: Removes a review and updates the technician's average.
     */
    async deleteReview(reviewId, customerId) {
        const review = await ReviewRepository.findOne({ 
            where: { id: reviewId, reviewer: { id: customerId } },
            relations: ["technician"]
        });

        if (!review) throw new Error("Review not found or unauthorized.");

        const technicianId = review.technician.id;
        await ReviewRepository.deleteReview(reviewId);

        // Sync the rating after deletion
        await TechnicianService.calculateTechnicianRating(technicianId);

        return { success: true };
    }
};

export default ReviewService;