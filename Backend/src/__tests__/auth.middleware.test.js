import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";

const mockUserRepository = {
  findUserById: jest.fn(),
};

jest.unstable_mockModule(
  "../repositories/user.repository.js",
  () => ({ default: mockUserRepository })
);

const { authenticateUser } = await import("../middlewares/auth.middleware.js");

describe("Auth Middleware - authenticateUser", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret_key";
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it("should return 401 if no Authorization header", async () => {
    await authenticateUser(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if Authorization is not Bearer", async () => {
    mockReq.headers.authorization = "Basic someToken";
    await authenticateUser(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it("should return 401 if token is invalid", async () => {
    mockReq.headers.authorization = "Bearer invalid_token_here";
    await authenticateUser(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired token.",
    });
  });

  it("should return 401 if token is expired", async () => {
    const expiredToken = jwt.sign(
      { id: 1, email: "a@b.com", role: "customer" },
      "test_secret_key",
      { expiresIn: "0s" }
    );
    await new Promise((r) => setTimeout(r, 100));
    mockReq.headers.authorization = `Bearer ${expiredToken}`;
    await authenticateUser(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired token.",
    });
  });

  it("should return 401 if user no longer exists in DB", async () => {
    const token = jwt.sign(
      { id: 99, email: "deleted@x.com", role: "customer" },
      "test_secret_key",
      { expiresIn: "1d" }
    );
    mockReq.headers.authorization = `Bearer ${token}`;
    mockUserRepository.findUserById.mockResolvedValue(null);
    await authenticateUser(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: "The user belonging to this token no longer exists.",
    });
  });

  it("should attach user to req and call next for valid token", async () => {
    const user = {
      id: 1,
      name: "Test",
      email: "test@x.com",
      role: { name: "customer" },
    };
    const token = jwt.sign(
      { id: 1, email: "test@x.com", role: "customer" },
      "test_secret_key",
      { expiresIn: "1d" }
    );
    mockReq.headers.authorization = `Bearer ${token}`;
    mockUserRepository.findUserById.mockResolvedValue(user);
    await authenticateUser(mockReq, mockRes, mockNext);
    expect(mockReq.user).toEqual(user);
    expect(mockNext).toHaveBeenCalled();
  });
});
