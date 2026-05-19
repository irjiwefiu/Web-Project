import { jest } from "@jest/globals";

const mockUserRepo = {
  count: jest.fn(),
  findAll: jest.fn(),
};
const mockRequestRepo = {
  getAllServiceRequests: jest.fn(),
  getServiceRequestsByCustomer: jest.fn(),
  findServiceRequestById: jest.fn(),
  createServiceRequest: jest.fn(),
  updateServiceRequest: jest.fn(),
  searchServiceRequests: jest.fn(),
  find: jest.fn(),
};
const mockAssignmentRepo = {
  findAll: jest.fn(),
  findByTechnicianId: jest.fn(),
  getRequestApplications: jest.fn(),
  getActiveAssignmentByRequest: jest.fn(),
};
const mockReviewRepo = {
  getAverageRating: jest.fn(),
  findByCustomerId: jest.fn(),
  findByTechnicianId: jest.fn(),
};
const mockTechRepo = {
  findByUserId: jest.fn(),
  createTechnicianProfile: jest.fn(),
};
const mockServiceRequestService = {
  getAllServiceRequests: jest.fn(),
  getCustomerRequests: jest.fn(),
  attachRequestStatus: jest.fn(),
  getServiceRequestById: jest.fn(),
};

jest.unstable_mockModule(
  "../repositories/user.repository.js",
  () => ({ default: mockUserRepo })
);
jest.unstable_mockModule(
  "../repositories/serviceRequest.repository.js",
  () => ({ default: mockRequestRepo })
);
jest.unstable_mockModule(
  "../repositories/assignment.repository.js",
  () => ({ default: mockAssignmentRepo })
);
jest.unstable_mockModule(
  "../repositories/review.repository.js",
  () => ({ default: mockReviewRepo })
);
jest.unstable_mockModule(
  "../repositories/technician.repository.js",
  () => ({ default: mockTechRepo })
);
jest.unstable_mockModule(
  "../services/serviceRequest.service.js",
  () => ({ default: mockServiceRequestService })
);

const DashboardController = (await import("../controllers/dashboard.controller.js")).default;

describe("DashboardController", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  // ── Admin Dashboard ───────────────────────────────────────────────────
  describe("getAdminDashboard", () => {
    it("should return all admin statistics", async () => {
      mockReq = {};
      mockUserRepo.count.mockResolvedValue(10);
      mockServiceRequestService.getAllServiceRequests.mockResolvedValue([
        { id: 1, status: "requested", price: "100" },
        { id: 2, status: "in_progress", price: "200" },
        { id: 3, status: "completed", price: "300" },
        { id: 4, status: "completed", price: "150.50" },
      ]);
      mockAssignmentRepo.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      mockReviewRepo.getAverageRating.mockResolvedValue(4.5);

      await DashboardController.getAdminDashboard(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          statistics: {
            totalUsers: 10,
            activeServiceRequests: 1,
            totalAssignments: 2,
            averageRating: 4.5,
            pending: 1,
            completed: 2,
            totalRevenue: 450.50,
          },
          recentRequests: expect.any(Array),
          timestamp: expect.any(String),
        },
      });
    });

    it("should return 0 for averageRating if none", async () => {
      mockReq = {};
      mockUserRepo.count.mockResolvedValue(0);
      mockServiceRequestService.getAllServiceRequests.mockResolvedValue([]);
      mockAssignmentRepo.findAll.mockResolvedValue([]);
      mockReviewRepo.getAverageRating.mockResolvedValue(null);

      await DashboardController.getAdminDashboard(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            statistics: expect.objectContaining({ averageRating: 0 }),
          }),
        })
      );
    });

    it("should handle errors via next()", async () => {
      mockReq = {};
      mockUserRepo.count.mockRejectedValue(new Error("DB error"));
      await DashboardController.getAdminDashboard(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  // ── Customer Dashboard ────────────────────────────────────────────────
  describe("getCustomerDashboard", () => {
    it("should return customer-specific stats", async () => {
      mockReq = { user: { id: 5 } };
      mockServiceRequestService.getCustomerRequests.mockResolvedValue([
        { id: 1, status: "requested", price: "100" },
        { id: 2, status: "completed", price: "250" },
        { id: 3, status: "completed", price: "75.50" },
        { id: 4, status: "in_progress", price: "300" },
      ]);
      mockAssignmentRepo.getRequestApplications.mockResolvedValue([]);
      mockAssignmentRepo.getActiveAssignmentByRequest.mockResolvedValue(null);

      await DashboardController.getCustomerDashboard(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          summary: {
            total: 4,
            active: 2,
            completed: 2,
            totalSpent: 325.50,
          },
          recentRequests: expect.any(Array),
        },
      });
    });

    it("should return 0 totalSpent when no completed requests", async () => {
      mockReq = { user: { id: 5 } };
      mockServiceRequestService.getCustomerRequests.mockResolvedValue([
        { id: 1, status: "requested", price: "100" },
      ]);
      mockAssignmentRepo.getRequestApplications.mockResolvedValue([]);
      mockAssignmentRepo.getActiveAssignmentByRequest.mockResolvedValue(null);

      await DashboardController.getCustomerDashboard(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            summary: expect.objectContaining({ totalSpent: 0 }),
          }),
        })
      );
    });
  });

  // ── Technician Dashboard ──────────────────────────────────────────────
  describe("getTechnicianDashboard", () => {
    it("should return technician performance data", async () => {
      mockReq = { user: { id: 10 } };
      mockTechRepo.findByUserId.mockResolvedValue({
        availability_status: "available",
        rating: 4.2,
      });
      mockAssignmentRepo.findByTechnicianId.mockResolvedValue([
        { id: 1, status: "applied", request: { id: 101, status: "requested" } },
        { id: 2, status: "accepted", request: { id: 102, status: "in_progress" } },
        { id: 3, status: "accepted", request: { id: 103, status: "completed", price: "500", is_paid: true } },
        { id: 4, status: "rejected", request: { id: 104, status: "requested" } },
      ]);
      mockServiceRequestService.attachRequestStatus.mockImplementation(
        (req) => Promise.resolve(req)
      );

      await DashboardController.getTechnicianDashboard(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          isAvailable: true,
          summary: {
            total: 4,
            availableJobs: 0,
            appliedJobs: 1,
            activeJobs: 1,
            pending: 1,
            completedJobs: 1,
            cancelled: 0,
            rejected: 1,
            rating: 4.2,
            availabilityStatus: "available",
            totalEarnings: 500.00,
          },
          activeAssignments: expect.any(Array),
          appliedAssignments: expect.any(Array),
          rejectedAssignments: expect.any(Array),
          completedAssignments: expect.any(Array),
        },
      });
    });

    it("should handle technician not found", async () => {
      mockReq = { user: { id: 99 } };
      mockTechRepo.findByUserId.mockResolvedValue(null);
      await DashboardController.getTechnicianDashboard(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
