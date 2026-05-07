const UserService = require("../services/user.service");

/**
 * UserController
 * Interface for profile management and administrative user operations.
 */
const UserController = {

    /**
     * getUserProfileController
     * GET /users/profile
     * Protected: Any logged-in user
     */
    async getUserProfileController(req, res, next) {
        try {
            // req.user is populated by authenticateUser middleware
            const profile = await UserService.getUserProfile(req.user.id);
            
            return res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getAllUsersController
     * GET /users
     * Protected: Admin only
     */
    async getAllUsersController(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            
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
     * getUsersByRoleController
     * GET /users/role/:role
     * Protected: Admin only
     */
    async getUsersByRoleController(req, res, next) {
        try {
            const { role } = req.params;
            const users = await UserService.getUsersByRole(role);
            
            return res.status(200).json({
                success: true,
                role: role,
                data: users
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * updateUserProfileController
     * PATCH /users/profile
     * Protected: Any logged-in user (updates own profile)
     */
    async updateUserProfileController(req, res, next) {
        try {
            const updatedUser = await UserService.updateUserProfile(req.user.id, req.body);
            
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully.",
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * deleteUserController
     * DELETE /users/:id
     * Protected: Admin only
     */
    async deleteUserController(req, res, next) {
        try {
            const { id } = req.params;
            await UserService.deleteUser(id);
            
            return res.status(200).json({
                success: true,
                message: `User with ID ${id} has been deleted.`
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = UserController;