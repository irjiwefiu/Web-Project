import UserRepository from "../repositories/user.repository.js";
import ServiceRequestRepository from "../repositories/serviceRequest.repository.js";
import AssignmentRepository from "../repositories/assignment.repository.js";
import ReviewRepository from "../repositories/review.repository.js";
import TechnicianRepository from "../repositories/technician.repository.js";
import ServiceRequestService from "../services/serviceRequest.service.js";

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
            const allRequests = await ServiceRequestService.getAllServiceRequests();
            const pendingRequests = allRequests.filter((request) => request.status === "pending");
            const inProgressRequests = allRequests.filter((request) => request.status === "in_progress");
            const completedRequests = allRequests.filter((request) => request.status === "completed");
            const totalAssignments = await AssignmentRepository.findAll();
            const averageRating = await ReviewRepository.getAverageRating();
            const recentRequests = allRequests.slice(0, 5);

            return res.status(200).json({
                success: true,
                data: {
                    statistics: {
                        totalUsers,
                        activeServiceRequests: inProgressRequests.length,
                        totalAssignments: totalAssignments.length,
                        averageRating: averageRating || 0,
                        pending: pendingRequests.length,
                        completed: completedRequests.length
                    },
                    recentRequests,
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
            const allRequests = await ServiceRequestService.getAllServiceRequests();
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
            const serviceRequests = await ServiceRequestService.getCustomerRequests(userId);
            const activeRequests = serviceRequests.filter(
                (r) => r.status === "in_progress" || r.status === "requested"
            );
            const completedRequests = serviceRequests.filter((r) => r.status === "completed");

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
            const serviceRequests = await ServiceRequestService.getCustomerRequests(userId);

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

            await Promise.all(assignments.map(async (assignment) => {
                if (assignment.request) {
                    assignment.request = await ServiceRequestService.attachRequestStatus(assignment.request);
                }
                return assignment;
            }));

            const completedAssignments = assignments.filter((a) => a.request?.status === "completed");
            const pendingAssignments = assignments.filter(
                (a) => a.request?.status === "pending" || a.request?.status === "in_progress" || a.request?.status === "requested"
            );

            return res.status(200).json({
                success: true,
                data: {
                    summary: {
                        total: assignments.length,
                        pending: pendingAssignments.length,
                        completed: completedAssignments.length,
                        rating: technicianProfile.rating || 0,
                        availabilityStatus: technicianProfile.availability_status || 'offline'
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

            await Promise.all(assignments.map(async (assignment) => {
                if (assignment.request) {
                    assignment.request = await ServiceRequestService.attachRequestStatus(assignment.request);
                }
                return assignment;
            }));

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

export default DashboardController;
