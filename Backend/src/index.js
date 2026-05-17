import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import  AppDataSource  from "./config/data-source.js";
import { ensureDatabaseColumns } from "./config/ensureColumns.js";

// Import middlewares
import  errorMiddleware  from "./middlewares/error.middleware.js";
import  requestLogger  from "./middlewares/requestLogger.middleware.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import technicianRoutes from "./routes/technician.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import serviceRequestRoutes from "./routes/serviceRequest.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import statusRoutes from "./routes/status.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import searchRoutes from "./routes/search.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware Stack
 */
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (server-to-server, Postman, mobile apps)
        if (!origin) {
            return callback(null, true);
        }

        // Allow local development origins
        const localOrigins = [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
        ];
        if (localOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow the explicit FRONTEND_URL from env vars
        if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        // Allow any Vercel preview deployment (*.vercel.app)
        if (origin.endsWith(".vercel.app") || origin === "https://vercel.app") {
            return callback(null, true);
        }

        // Allow the Vercel-deployed backend's own domain (for health checks, etc.)
        if (process.env.VERCEL_URL && origin.endsWith(process.env.VERCEL_URL)) {
            return callback(null, true);
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

/**
 * Database Initialization
 */
AppDataSource.initialize()
    .then(async () => {
        console.log("✅ Database connected successfully");
        await ensureDatabaseColumns();
    })
    .catch((error) => {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    });

/**
 * Health Check Endpoint
 */
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

/**
 * API Routes
 * Base path: /api/v1
 */
const apiV1 = express.Router();

apiV1.use("/auth", authRoutes);
apiV1.use("/users", userRoutes);
apiV1.use("/technicians", technicianRoutes);
apiV1.use("/categories", categoryRoutes);
apiV1.use("/requests", serviceRequestRoutes);
apiV1.use("/assignments", assignmentRoutes);
apiV1.use("/status", statusRoutes);
apiV1.use("/reviews", reviewRoutes);
apiV1.use("/dashboard", dashboardRoutes);
apiV1.use("/search", searchRoutes);

app.use("/api/v1", apiV1);

/**
 * 404 - Not Found Endpoint
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path: req.path,
        method: req.method
    });
});

/**
 * Global Error Handler Middleware (must be last)
 */
app.use(errorMiddleware);

/**
 * Start Server (skip listening when running on Vercel serverless)
 */
if (process.env.VERCEL !== "1") {
    const server = app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════╗
║   Service Management Backend API        ║
║   Server running on port ${PORT}            ║
║   Environment: ${process.env.NODE_ENV || "development"}     ║
╚════════════════════════════════════════╝
        `);
    });

    /**
     * Graceful Shutdown
     */
    process.on("SIGTERM", () => {
        console.log("SIGTERM signal received: closing HTTP server");
        server.close(() => {
            console.log("HTTP server closed");
            process.exit(0);
        });
    });
}

export default app;

