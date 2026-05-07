const TechnicianService = require("../services/technician.service");

/**
 * TechnicianController
 * Manages specialized profiles, availability, and discovery for service providers.
 */
const TechnicianController = {

    /**
     * createTechnicianProfileController
     * POST /technicians/profile
     */
    async createTechnicianProfileController(req, res, next) {
        try {
            // req.user.id is used to link the profile to the authenticated user
            const profile = await TechnicianService.createTechnicianProfile(req.user.id, req.body);
            
            return res.status(201).json({
                success: true,
                message: "Technician profile created successfully.",
                data: profile
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * updateTechnicianProfileController
     * PATCH /technicians/profile
     */
    async updateTechnicianProfileController(req, res, next) {
        try {
            const updatedProfile = await TechnicianService.updateTechnicianProfile(req.user.id, req.body);
            
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully.",
                data: updatedProfile
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * updateAvailabilityStatusController
     * PATCH /technicians/availability
     */
    async updateAvailabilityStatusController(req, res, next) {
        try {
            const { status } = req.body; // status: 'available', 'busy', 'offline'
            const result = await TechnicianService.updateAvailabilityStatus(req.user.id, status);
            
            return res.status(200).json({
                success: true,
                message: `Availability status updated to ${status}.`,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getAvailableTechniciansController
     * GET /technicians/available
     */
    async getAvailableTechniciansController(req, res, next) {
        try {
            const technicians = await TechnicianService.getAvailableTechnicians();
            
            return res.status(200).json({
                success: true,
                count: technicians.length,
                data: technicians
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechniciansByCategoryController
     * GET /technicians/category/:categoryName
     */
    async getTechniciansByCategoryController(req, res, next) {
        try {
            const { categoryName } = req.params;
            const technicians = await TechnicianService.getTechniciansByCategory(categoryName);
            
            return res.status(200).json({
                success: true,
                category: categoryName,
                data: technicians
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechniciansByServiceAreaController
     * GET /technicians/area/:area
     */
    async getTechniciansByServiceAreaController(req, res, next) {
        try {
            const { area } = req.params;
            const technicians = await TechnicianService.getTechniciansByServiceArea(area);
            
            return res.status(200).json({
                success: true,
                area: area,
                data: technicians
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getTechnicianRatingController
     * GET /technicians/:id/rating
     */
    async getTechnicianRatingController(req, res, next) {
        try {
            const { id } = req.params;
            const rating = await TechnicianService.calculateTechnicianRating(id);
            
            return res.status(200).json({
                success: true,
                technician_id: id,
                average_rating: rating
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = TechnicianController;