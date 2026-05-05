const CategoryRepository = require("../repositories/category.repository");

/**
 * Service to manage Service Categories.
 * These categories link Technicians to the types of Service Requests they can handle.
 */
const CategoryService = {

    /**
     * createCategory: Adds a new service type to the platform.
     */
    async createCategory(categoryData) {
        const { name } = categoryData;

        // Check for duplicates
        const existing = await CategoryRepository.findOne({ where: { name } });
        if (existing) {
            throw new Error(`Category with name '${name}' already exists.`);
        }

        return await CategoryRepository.createCategory(categoryData);
    },

    /**
     * getAllCategories: Returns a list of all available service types.
     */
    async getAllCategories() {
        return await CategoryRepository.getAllCategories();
    },

    /**
     * updateCategory: Modifies category name or description.
     */
    async updateCategory(categoryId, updateData) {
        const category = await CategoryRepository.findCategoryById(categoryId);
        if (!category) {
            throw new Error("Category not found.");
        }

        return await CategoryRepository.updateCategory(categoryId, updateData);
    },

    /**
     * deleteCategory: Removes a category.
     * Note: Per your ServiceRequest schema, requests linked to this 
     * will have their category_id set to NULL (onDelete: "SET NULL").
     */
    async deleteCategory(categoryId) {
        const category = await CategoryRepository.findCategoryById(categoryId);
        if (!category) {
            throw new Error("Category not found.");
        }

        return await CategoryRepository.deleteCategory(categoryId);
    }
};

module.exports = CategoryService;