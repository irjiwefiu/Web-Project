const TechnicianRepository = require("../repositories/technician.repository");
const ReviewRepository = require("../repositories/review.repository");

const TechnicianService = {

    /**
     * createTechnicianProfile: Initializes a profile for a user who registered as a technician.
     */
    async createTechnicianProfile(userId, profileData) {
        // Ensure profile doesn't already exist
        const existing = await TechnicianRepository.findTechnicianProfileByUserId(userId);
        if (existing) throw new Error("Technician profile already exists for this user.");

        return await TechnicianRepository.createTechnicianProfile({
            user: { id: userId },
            ...profileData
        });
    },

    /**
     * updateTechnicianProfile: Updates skills (jsonb), service area, or other details.
     */
    async updateTechnicianProfile(userId, updateData) {
        const profile = await TechnicianRepository.findTechnicianProfileByUserId(userId);
        if (!profile) throw new Error("Technician profile not found.");

        return await TechnicianRepository.updateTechnicianProfile(profile.id, updateData);
    },

    /**
     * updateAvailabilityStatus: Changes status between 'available', 'busy', or 'offline'.
     */
    async updateAvailabilityStatus(userId, status) {
        const allowedStatuses = ["available", "busy", "offline"];
        if (!allowedStatuses.includes(status)) {
            throw new Error("Invalid availability status.");
        }

        return await TechnicianRepository.updateTechnicianAvailability(userId, status);
    },

    /**
     * getAvailableTechnicians: Returns all technicians currently marked as 'available'.
     */
    async getAvailableTechnicians() {
        return await TechnicianRepository.getAvailableTechnicians();
    },

    /**
     * getTechniciansByCategory: Filters technicians based on the 'skills' jsonb field.
     */
    async getTechniciansByCategory(categoryName) {
        // This utilizes the repository's ability to query inside the jsonb skills array
        return await TechnicianRepository.createQueryBuilder("tech")
            .leftJoinAndSelect("tech.user", "user")
            .where("tech.skills @> :skill", { skill: JSON.stringify([categoryName]) })
            .getMany();
    },

    /**
     * getTechniciansByServiceArea: Finds technicians covering a specific city or zone.
     */
    async getTechniciansByServiceArea(area) {
        return await TechnicianRepository.getTechniciansByServiceArea(area);
    },

    /**
     * calculateTechnicianRating: Aggregates average from reviews and syncs it to the profile.
     */
    async calculateTechnicianRating(userId) {
        const profile = await TechnicianRepository.findTechnicianProfileByUserId(userId);
        if (!profile) return 0;

        // Fetch average from Review Repository
        const avgRating = await ReviewRepository.getTechnicianRating(userId);

        // Update the 'hot' rating column in the profile table for faster searching/sorting
        await TechnicianRepository.updateTechnicianProfile(profile.id, { rating: avgRating });

        return avgRating;
    }
};

module.exports = TechnicianService;