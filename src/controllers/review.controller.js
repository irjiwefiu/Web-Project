const ReviewService = require("../services/review.service");

/**
 * ReviewController
 * Handles the submission and retrieval of customer feedback and technician ratings.
 */
const ReviewController = {

    /**
     * createReviewController
     * POST /reviews
     */
    async createReviewController(req, res, next) {
        try {
            // req.user.id is the customer providing the review
            const review = await ReviewService.createReview(req.user.id, req.body);
            
            return res.status(201).json({
                success: true,
                message: "Review submitted successfully. Technician rating updated.",
                data: review
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getReviewByRequestController
     * GET /reviews/request/:requestId
     */
    async getReviewByRequestController(req, res, next) {
        try {
            const { requestId } = req.params;
            const review = await ReviewService.getReviewByRequest(requestId);
            
            return res.status(200).json({
                success: true,
                data: review
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechnicianReviewsController
     * GET /reviews/technician/:technicianId
     */
    async getTechnicianReviewsController(req, res, next) {
        try {
            const { technicianId } = req.params;
            const reviews = await ReviewService.getTechnicianReviews(technicianId);
            
            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getCustomerReviewsController
     * GET /reviews/customer/me
     */
    async getCustomerReviewsController(req, res, next) {
        try {
            const reviews = await ReviewService.getCustomerReviews(req.user.id);
            
            return res.status(200).json({
                success: true,
                data: reviews
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * updateReviewController
     * PATCH /reviews/:id
     */
    async updateReviewController(req, res, next) {
        try {
            const { id } = req.params;
            const result = await ReviewService.updateReview(id, req.user.id, req.body);
            
            return res.status(200).json({
                success: true,
                message: "Review updated successfully."
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * deleteReviewController
     * DELETE /reviews/:id
     */
    async deleteReviewController(req, res, next) {
        try {
            const { id } = req.params;
            await ReviewService.deleteReview(id, req.user.id);
            
            return res.status(200).json({
                success: true,
                message: "Review deleted successfully."
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ReviewController;