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
            const pendingRequests = allRequests.filter((request) =>
                request.status === "requested" || request.status === "assigned" || request.status === "on_the_way"
            );
            const inProgressRequests = allRequests.filter((request) => request.status === "in_progress");
            const completedRequests = allRequests.filter((request) => request.status === "completed");
            const totalAssignments = await AssignmentRepository.findAll();
            const averageRating = await ReviewRepository.getAverageRating();
            const recentRequests = allRequests.slice(0, 5);

            // Calculate total revenue from completed requests
            const totalRevenue = completedRequests.reduce((sum, req) => {
                return sum + (parseFloat(req.price) || 0);
            }, 0);

            return res.status(200).json({
                success: true,
                data: {
                    statistics: {
                        totalUsers,
                        activeServiceRequests: inProgressRequests.length,
                        totalAssignments: totalAssignments.length,
                        averageRating: averageRating || 0,
                        pending: pendingRequests.length,
                        completed: completedRequests.length,
                        totalRevenue: parseFloat(totalRevenue.toFixed(2))
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
            const pendingRequests = allRequests.filter(r =>
                r.status === "requested" || r.status === "assigned" || r.status === "on_the_way"
            );
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
                (r) => r.status === "in_progress" || r.status === "requested" || r.status === "assigned" || r.status === "on_the_way"
            );
            const completedRequests = serviceRequests.filter((r) => r.status === "completed");

            // Calculate total spent on completed requests
            const totalSpent = completedRequests.reduce((sum, req) => {
                return sum + (parseFloat(req.price) || 0);
            }, 0);

            // Enrich each request with application counts and assigned technician info
            const requestsWithApplicationCounts = await Promise.all(
                serviceRequests.map(async (req) => {
                    const enriched = { ...req, applicationCount: 0, is_paid: req.is_paid || false };

                    if (req.status === "requested") {
                        const applications = await AssignmentRepository.getRequestApplications(req.id);
                        enriched.applicationCount = applications.length;
                    }

                    // For assigned/on_the_way/in_progress/completed requests, include assigned technician
                    if (["assigned", "on_the_way", "in_progress", "completed"].includes(req.status)) {
                        const activeAssignment = await AssignmentRepository.getActiveAssignmentByRequest(req.id);
                        if (activeAssignment && activeAssignment.technician) {
                            enriched.assignedTechnician = {
                                id: activeAssignment.technician.id,
                                name: activeAssignment.technician.full_name || activeAssignment.technician.username,
                            };
                        }
                    }

                    return enriched;
                })
            );

            return res.status(200).json({
                success: true,
                data: {
                    summary: {
                        total: serviceRequests.length,
                        active: activeRequests.length,
                        completed: completedRequests.length,
                        totalSpent: parseFloat(totalSpent.toFixed(2))
                    },
                    recentRequests: requestsWithApplicationCounts.slice(0, 5)
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
            const assignments = await AssignmentRepository.findByTechnicianId(userId);

            await Promise.all(assignments.map(async (assignment) => {
                if (assignment.request) {
                    assignment.request = await ServiceRequestService.attachRequestStatus(assignment.request);
                }
                return assignment;
            }));

            // Separate assignments by assignment.status (the source of truth)
            // "applied" = pending applications (assignment.status === "applied")
            const appliedAssignments = assignments.filter(
                (a) => a.status === "applied"
            );
            // "active" = accepted jobs that are NOT yet completed/cancelled
            const activeAssignments = assignments.filter(
                (a) => a.status === "accepted" && a.request?.status !== "completed" && a.request?.status !== "cancelled"
            );
            // "rejected" = rejected applications
            const rejectedAssignments = assignments.filter(
                (a) => a.status === "rejected"
            );
            const completedAssignments = assignments.filter((a) => a.request?.status === "completed");
            const cancelledAssignments = assignments.filter((a) => a.request?.status === "cancelled");

            // Calculate total earnings from completed AND PAID assignments only
            const totalEarnings = completedAssignments.reduce((sum, a) => {
                if (a.request?.is_paid) {
                    return sum + (parseFloat(a.request?.price) || 0);
                }
                return sum;
            }, 0);

            return res.status(200).json({
                success: true,
                data: {
                    isAvailable: technicianProfile.availability_status === 'available',
                    summary: {
                        total: assignments.length,
                        availableJobs: 0, // populated separately via getAvailableRequests
                        appliedJobs: appliedAssignments.length,
                        activeJobs: activeAssignments.length,
                        pending: activeAssignments.length, // keep for backward compat
                        completedJobs: completedAssignments.length,
                        cancelled: cancelledAssignments.length,
                        rejected: rejectedAssignments.length,
                        rating: technicianProfile.rating || 0,
                        availabilityStatus: technicianProfile.availability_status || 'offline',
                        totalEarnings: parseFloat(totalEarnings.toFixed(2))
                    },
                    activeAssignments: activeAssignments.slice(0, 5),
                    appliedAssignments: appliedAssignments.slice(0, 5),
                    rejectedAssignments: rejectedAssignments.slice(0, 5),
                    completedAssignments: completedAssignments.slice(0, 10)
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
            const assignments = await AssignmentRepository.findByTechnicianId(userId);

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
            const reviews = await ReviewRepository.findByTechnicianId(userId);

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
