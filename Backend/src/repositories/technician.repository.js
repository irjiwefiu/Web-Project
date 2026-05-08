// src/repositories/technician.repository.js
import AppDataSource from "../config/data-source.js";
import TechnicianProfile from "../entities/TechnicianProfile.js";
import { Not, IsNull } from "typeorm";

const TechnicianRepository = AppDataSource.getRepository(TechnicianProfile).extend({
    
    // 1. Create Profile
    async createTechnicianProfile(profileData) {
        const profile = this.create(profileData);
        return await this.save(profile);
    },

    async findByUserId(userId) {
        return await this.findTechnicianProfileByUserId(userId);
    },

    // 2. Find Profile By User ID
    async findTechnicianProfileByUserId(userId) {
        return await this.findOne({
            where: { user: { id: userId } },
            relations: ["user"]
        });
    },

    // 3. Update Profile (Skills, Service Area, etc.)
    async updateTechnicianProfile(id, updateData) {
        await this.update(id, updateData);
        return await this.findOne({ where: { id } });
    },

    // 4. Update Availability Status
    // status: "available" | "busy" | "offline"
    async updateTechnicianAvailability(id, status) {
        return await this.save({
            id: id,
            availability_status: status
        });
    },

    // 5. Get Available Technicians
    async getAvailableTechnicians() {
        return await this.find({
            where: { availability_status: "available" },
            relations: ["user"]
        });
    },

    // 6. Get Technicians By Service Area
    // Uses ILIKE for case-insensitive matching (Postgres)
    async getTechniciansByServiceArea(areaName) {
        return await this.createQueryBuilder("profile")
            .leftJoinAndSelect("profile.user", "user")
            .where("profile.service_area ILIKE :area", { area: `%${areaName}%` })
            .getMany();
    }
});

export default TechnicianRepository;