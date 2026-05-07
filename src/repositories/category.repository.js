// src/repositories/category.repository.js
import AppDataSource from "../config/data-source.js";
import ServiceCategory from "../entities/ServiceCategory";

const CategoryRepository = AppDataSource.getRepository(ServiceCategory).extend({
    
    // 1. Create a new category
    async createCategory(categoryData) {
        const category = this.create(categoryData);
        return await this.save(category);
    },

    // 2. Get all categories
    async getAllCategories() {
        return await this.find({
            order: { name: "ASC" } // Keeps the list alphabetical for the UI
        });
    },

    // 3. Find category by ID
    async findCategoryById(id) {
        return await this.findOne({ 
            where: { id } 
        });
    },

    // 4. Update Category name or description
    async updateCategory(id, updateData) {
        await this.update(id, updateData);
        return await this.findCategoryById(id);
    },

    // 5. Delete Category
    async deleteCategory(id) {
        const result = await this.delete(id);
        return result.affected > 0;
    }
});

export default CategoryRepository;