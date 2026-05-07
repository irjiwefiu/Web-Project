// src/repositories/user.repository.js
import AppDataSource from "../config/data-source.js";
import User from "../entities/User.js";

const UserRepository = AppDataSource.getRepository(User).extend({
    
    // 1. Create User
    async createUser(userData) {
        const user = this.create(userData);
        return await this.save(user);
    },

    // 2. Find User By Email (with profile and role)
    async findUserByEmail(email) {
        return await this.findOne({ 
            where: { email },
            relations: ["role", "technician_profile"] 
        });
    },

    // 3. Find User By ID
    async findUserById(id) {
        return await this.findOne({ 
            where: { id },
            relations: ["role", "technician_profile"] 
        });
    },

    // 4. Find Users By Role
    async findUsersByRole(roleName) {
        return await this.find({
            where: { 
                role: { name: roleName } 
            },
            relations: ["technician_profile"]
        });
    },

    // 5. Update User
    async updateUser(id, updateData) {
        await this.update(id, updateData);
        return this.findUserById(id); // Return the updated user object
    },

    // 6. Delete User
    async deleteUser(id) {
        const result = await this.delete(id);
        return result.affected > 0; // Returns true if a record was deleted
    }
});

export default UserRepository;