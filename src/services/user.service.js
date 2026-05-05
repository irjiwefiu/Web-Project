const UserRepository = require("../repositories/user.repository");
const RoleRepository = require("../repositories/role.repository");
const bcrypt = require("bcrypt");

const UserService = {
    
    /**
     * getUserProfile: Fetches a user with their role and technician profile if applicable.
     */
    async getUserProfile(userId) {
        const user = await UserRepository.findUserById(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        // Strip password for security
        const { password, ...safeUser } = user;
        return safeUser;
    },

    /**
     * getAllUsers: Retrieves all users in the system.
     * Usually reserved for Admin dashboards.
     */
    async getAllUsers() {
        const users = await UserRepository.find(); // Assuming base TypeORM find or custom repo method
        return users.map(({ password, ...user }) => user);
    },

    /**
     * getUsersByRole: Filters users by their specific role (e.g., 'technician').
     */
    async getUsersByRole(roleName) {
        const users = await UserRepository.findUsersByRole(roleName);
        return users.map(({ password, ...user }) => user);
    },

    /**
     * updateUserProfile: Updates basic info or changes password.
     */
    async updateUserProfile(userId, updateData) {
        const user = await UserRepository.findUserById(userId);
        if (!user) throw new Error("User not found.");

        // If the user is trying to update their password, we must hash it first
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        // Prevent manual role changes through this specific method for security
        delete updateData.role; 

        return await UserRepository.updateUser(userId, updateData);
    },

    /**
     * deleteUser: Removes a user account.
     * Note: This will trigger the CASCADE or RESTRICT rules defined in your schema.
     */
    async deleteUser(userId) {
        const user = await UserRepository.findUserById(userId);
        if (!user) throw new Error("User not found.");

        return await UserRepository.deleteUser(userId);
    }
};

module.exports = UserService;