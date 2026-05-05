// src/repositories/role.repository.js
const { AppDataSource } = require("../config/data-source");
const Role = require("../entities/Role");

const RoleRepository = AppDataSource.getRepository(Role).extend({
    
    // 1. Create a new Role (e.g., 'Admin', 'Technician', 'Customer')
    async createRole(roleData) {
        const role = this.create(roleData);
        return await this.save(role);
    },

    // 2. Get all available roles
    async getAllRoles() {
        return await this.find();
    },

    // 3. Find a specific role by its primary ID
    async findRoleById(id) {
        return await this.findOne({ 
            where: { id } 
        });
    },

    // 4. Find a role by its name (Case-sensitive)
    async findRoleByName(name) {
        return await this.findOne({ 
            where: { name } 
        });
    }
});

module.exports = RoleRepository;