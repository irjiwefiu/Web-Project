import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import all entities
import Role from "../entities/Role.js";
import User from "../entities/User.js";
import TechnicianProfile from "../entities/TechnicianProfile.js";
import ServiceCategory from "../entities/ServiceCategory.js";
import ServiceRequest from "../entities/ServiceRequest.js";
import Assignment from "../entities/Assignment.js";
import StatusHistory from "../entities/StatusHistory.js";
import Review from "../entities/Review.js";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: String(process.env.DB_PASSWORD || ""), 
  database: process.env.DB_NAME,

  synchronize: false, // use migrations instead
  logging: true,

  entities: [
    Role,
    User,
    TechnicianProfile,
    ServiceCategory,
    ServiceRequest,
    Assignment,
    StatusHistory,
    Review
  ],

  migrations: [path.join(__dirname, "../migrations/*.js")],
  migrationsTableName: "migrations_history",
});

export default AppDataSource;
