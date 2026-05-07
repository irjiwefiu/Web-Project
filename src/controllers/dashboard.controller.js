const UserRepository = require("../repositories/user.repository");
const ServiceRequestRepository = require("../repositories/serviceRequest.repository");
const AssignmentRepository = require("../repositories/assignment.repository");
const ReviewRepository = require("../repositories/review.repository");
const TechnicianRepository = require("../repositories/technician.repository");

/**
 * DashboardController
 * Handles dashboard data retrieval for different user roles
 */
const DashboardController = {

    /**
     * getAdminDashboard
     * GET /dashboards/admin
     * Protected: Admin only
     * Returns system-wide statistics and management data
     */
    async getAdminDashboard(req, res, next) {
        try {
            const totalUsers = await UserRepository.count();
            const activeServiceRequests = await ServiceRequestRepository.findByStatus("active");
            const totalAssignments = await AssignmentRepository.findAll();
            const averageRating = await ReviewRepository.getAverageRating();

            return res.status(200).json({
                success: true,
                data: {
                    statistics: {
                        totalUsers,
                        activeServiceRequests: activeServiceRequests.length,
                        totalAssignments: totalAssignments.length,
                        averageRating: averageRating || 0
                    },
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getAdminUserManagement
     * GET /dashboards/admin/users
     * Protected: Admin only
     * Returns all users with detailed information
     */
    async getAdminUserManagement(req, res, next) {
        try {
            const users = await UserRepository.findAll();

            return res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getAdminServiceRequests
     * GET /dashboards/admin/service-requests
     * Protected: Admin only
     * Returns all service requests with status breakdown
     */
    async getAdminServiceRequests(req, res, next) {
        try {
            const allRequests = await ServiceRequestRepository.findAll();
            const pendingRequests = allRequests.filter(r => r.status === "pending");
            const completedRequests = allRequests.filter(r => r.status === "completed");
            const inProgressRequests = allRequests.filter(r => r.status === "in_progress");

            return res.status(200).json({
                success: true,
                data: {
                    summary: {
                        total: allRequests.length,
                        pending: pendingRequests.length,
                        inProgress: inProgressRequests.length,
                        completed: completedRequests.length
                    },
                    requests: allRequests
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getCustomerDashboard
     * GET /dashboards/customer
     * Protected: Customer only
     * Returns customer-specific service request data
     */
    async getCustomerDashboard(req, res, next) {
        try {
            const userId = req.user.id;
            const serviceRequests = await ServiceRequestRepository.findByCustomerId(userId);
            const activeRequests = serviceRequests.filter(r => r.status === "in_progress");
            const completedRequests = serviceRequests.filter(r => r.status === "completed");

            return res.status(200).json({
                success: true,
                data: {
                    summary: {
                        total: serviceRequests.length,
                        active: activeRequests.length,
                        completed: completedRequests.length
                    },
                    recentRequests: serviceRequests.slice(0, 5)
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getCustomerServiceRequests
     * GET /dashboards/customer/service-requests
     * Protected: Customer only
     * Returns all service requests for the logged-in customer
     */
    async getCustomerServiceRequests(req, res, next) {
        try {
            const userId = req.user.id;
            const serviceRequests = await ServiceRequestRepository.findByCustomerId(userId);

            return res.status(200).json({
                success: true,
                count: serviceRequests.length,
                data: serviceRequests
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getCustomerReviews
     * GET /dashboards/customer/reviews
     * Protected: Customer only
     * Returns reviews written by the customer
     */
    async getCustomerReviews(req, res, next) {
        try {
            const userId = req.user.id;
            const reviews = await ReviewRepository.findByCustomerId(userId);

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
     * getTechnicianDashboard
     * GET /dashboards/technician
     * Protected: Technician only
     * Returns technician-specific work data
     */
    async getTechnicianDashboard(req, res, next) {
        try {
            const userId = req.user.id;
            const technicianProfile = await TechnicianRepository.findByUserId(userId);
            const assignments = await AssignmentRepository.findByTechnicianId(technicianProfile.id);
            const completedAssignments = assignments.filter(a => a.status === "completed");
            const pendingAssignments = assignments.filter(a => a.status === "pending");

            return res.status(200).json({
                success: true,
                data: {
                    summary: {
                        total: assignments.length,
                        pending: pendingAssignments.length,
                        completed: completedAssignments.length,
                        rating: technicianProfile.rating || 0
                    },
                    upcomingAssignments: pendingAssignments.slice(0, 5)
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechnicianAssignments
     * GET /dashboards/technician/assignments
     * Protected: Technician only
     * Returns all assignments for the technician
     */
    async getTechnicianAssignments(req, res, next) {
        try {
            const userId = req.user.id;
            const technicianProfile = await TechnicianRepository.findByUserId(userId);
            const assignments = await AssignmentRepository.findByTechnicianId(technicianProfile.id);

            return res.status(200).json({
                success: true,
                count: assignments.length,
                data: assignments
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechnicianReviews
     * GET /dashboards/technician/reviews
     * Protected: Technician only
     * Returns reviews received by the technician
     */
    async getTechnicianReviews(req, res, next) {
        try {
            const userId = req.user.id;
            const technicianProfile = await TechnicianRepository.findByUserId(userId);
            const reviews = await ReviewRepository.findByTechnicianId(technicianProfile.id);

            return res.status(200).json({
                success: true,
                count: reviews.length,
                averageRating: technicianProfile.rating || 0,
                data: reviews
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechnicianProfile
     * GET /dashboards/technician/profile
     * Protected: Technician only
     * Returns technician profile information
     */
    async getTechnicianProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const technicianProfile = await TechnicianRepository.findByUserId(userId);

            return res.status(200).json({
                success: true,
                data: technicianProfile
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = DashboardController;
