const CategoryService = require("../services/category.service");

/**
 * CategoryController
 * Handles the administrative management of service types (e.g., Plumbing, Electrical).
 */
const CategoryController = {

    /**
     * createCategoryController
     * POST /categories
     * Access: Admin Only
     */
    async createCategoryController(req, res, next) {
        try {
            const category = await CategoryService.createCategory(req.body);
            
            return res.status(201).json({
                success: true,
                message: "Service category created successfully.",
                data: category
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * getAllCategoriesController
     * GET /categories
     * Access: Public / Authenticated Users
     */
    async getAllCategoriesController(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            
            return res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * updateCategoryController
     * PATCH /categories/:id
     * Access: Admin Only
     */
    async updateCategoryController(req, res, next) {
        try {
            const { id } = req.params;
            const updatedCategory = await CategoryService.updateCategory(id, req.body);
            
            return res.status(200).json({
                success: true,
                message: "Category updated successfully.",
                data: updatedCategory
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * deleteCategoryController
     * DELETE /categories/:id
     * Access: Admin Only
     */
    async deleteCategoryController(req, res, next) {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(id);
            
            return res.status(200).json({
                success: true,
                message: `Category with ID ${id} has been removed.`
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CategoryController;