import AppDataSource from "../config/data-source.js";
import bcrypt from "bcrypt";
import Role from "../entities/Role.js";
import User from "../entities/User.js";
import TechnicianProfile from "../entities/TechnicianProfile.js";
import ServiceCategory from "../entities/ServiceCategory.js";
import ServiceRequest from "../entities/ServiceRequest.js";
import Assignment from "../entities/Assignment.js";
import StatusHistory from "../entities/StatusHistory.js";
import Review from "../entities/Review.js";
import {
  roles,
  categories,
  users,
  technicianProfiles,
  serviceRequests,
  assignments,
  statusHistory,
  reviews,
} from "./seedData.js";

async function seed() {
  const dataSource = await AppDataSource.initialize();
  const manager = dataSource.manager;

  console.log("Clearing existing seed data...");
  await manager.query(
    `TRUNCATE reviews, assignments, status_history, service_requests, technician_profiles, users, service_categories, roles RESTART IDENTITY CASCADE;`
  );

  console.log("Seeding roles...");
  const createdRoles = await manager.save(Role, roles);

  const roleMap = new Map(createdRoles.map((role) => [role.name, role]));

  console.log("Seeding users...");
  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await manager.save(User, {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: roleMap.get(userData.roleName),
    });
    createdUsers.push(user);
  }

  const userMap = new Map(createdUsers.map((user) => [user.email, user]));

  console.log("Seeding technician profiles...");
  for (const profileData of technicianProfiles) {
    await manager.save(TechnicianProfile, {
      bio: profileData.bio,
      skills: profileData.skills,
      user: userMap.get(profileData.userEmail),
    });
  }

  console.log("Seeding categories...");
  const createdCategories = await manager.save(ServiceCategory, categories);
  const categoryMap = new Map(createdCategories.map((category) => [category.name, category]));

  console.log("Seeding service requests...");
  const createdRequests = [];
  for (const requestData of serviceRequests) {
    const request = await manager.save(ServiceRequest, {
      title: requestData.title,
      description: requestData.description,
      category: categoryMap.get(requestData.categoryName),
      customer: userMap.get(requestData.customerEmail),
    });
    createdRequests.push(request);
  }

  const requestMap = new Map(createdRequests.map((request) => [request.title, request]));

  console.log("Seeding assignments...");
  for (const assignmentData of assignments) {
    await manager.save(Assignment, {
      request: requestMap.get(assignmentData.requestTitle),
      technician: userMap.get(assignmentData.technicianEmail),
      assigned_by: userMap.get(assignmentData.assignedByEmail),
    });
  }

  console.log("Seeding status history...");
  for (const statusData of statusHistory) {
    await manager.save(StatusHistory, {
      status: statusData.status,
      service_request: requestMap.get(statusData.requestTitle),
      updated_by: userMap.get(statusData.updatedByEmail),
    });
  }

  console.log("Seeding reviews...");
  for (const reviewData of reviews) {
    await manager.save(Review, {
      rating: reviewData.rating,
      comment: reviewData.comment,
      request: requestMap.get(reviewData.requestTitle),
      reviewer: userMap.get(reviewData.reviewerEmail),
      technician: userMap.get(reviewData.technicianEmail),
    });
  }

  console.log("Seed data successfully inserted.");
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error("Seed execution failed:", error);
  process.exit(1);
});
