import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const mockUserRepository = {
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  findAll: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findUsersByRole: jest.fn(),
};

const mockRoleRepository = {
  findRoleByName: jest.fn(),
  createRole: jest.fn(),
  getAllRoles: jest.fn(),
  findRoleById: jest.fn(),
};

const mockTechnicianRepository = {
  createTechnicianProfile: jest.fn(),
  findByUserId: jest.fn(),
  updateTechnicianProfile: jest.fn(),
  updateTechnicianAvailability: jest.fn(),
  getAvailableTechnicians: jest.fn(),
  getTechniciansByServiceArea: jest.fn(),
};

jest.unstable_mockModule(
  "../repositories/user.repository.js",
  () => ({ default: mockUserRepository })
);
jest.unstable_mockModule(
  "../repositories/role.repository.js",
  () => ({ default: mockRoleRepository })
);
jest.unstable_mockModule(
  "../repositories/technician.repository.js",
  () => ({ default: mockTechnicianRepository })
);

const AuthService = (await import("../services/auth.service.js")).default;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret_key";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  // ── generateToken ───────────────────────────────────────────────────────
  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      const user = {
        id: 1,
        email: "test@example.com",
        role: { name: "customer" },
      };
      const token = AuthService.generateToken(user);
      expect(typeof token).toBe("string");

      const decoded = jwt.verify(token, "test_secret_key");
      expect(decoded.id).toBe(1);
      expect(decoded.email).toBe("test@example.com");
      expect(decoded.role).toBe("customer");
    });

    it("should include correct expiry (1 day)", () => {
      const user = {
        id: 1,
        email: "a@b.com",
        role: { name: "admin" },
      };
      const token = AuthService.generateToken(user);
      const decoded = jwt.verify(token, "test_secret_key");
      const now = Math.floor(Date.now() / 1000);
      expect(decoded.exp - decoded.iat).toBe(86400);
    });
  });

  // ── verifyUserCredentials ──────────────────────────────────────────────
  describe("verifyUserCredentials", () => {
    it("should return null if user not found", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      const result = await AuthService.verifyUserCredentials("none@x.com", "pwd");
      expect(result).toBeNull();
    });

    it("should return null if password does not match", async () => {
      const hashed = await bcrypt.hash("correct_pw", 10);
      mockUserRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        email: "test@x.com",
        password: hashed,
        role: { name: "customer" },
      });
      const result = await AuthService.verifyUserCredentials("test@x.com", "wrong_pw");
      expect(result).toBeNull();
    });

    it("should return user object (without password) for valid credentials", async () => {
      const hashed = await bcrypt.hash("correct_pw", 10);
      const dbUser = {
        id: 1,
        name: "Test",
        username: "testuser",
        email: "test@x.com",
        password: hashed,
        role: { name: "customer" },
      };
      mockUserRepository.findUserByEmail.mockResolvedValue(dbUser);
      const result = await AuthService.verifyUserCredentials("test@x.com", "correct_pw");
      expect(result).not.toBeNull();
      expect(result.password).toBeUndefined();
      expect(result.email).toBe("test@x.com");
    });
  });

  // ── loginUser ──────────────────────────────────────────────────────────
  describe("loginUser", () => {
    it("should throw error for invalid email", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      await expect(AuthService.loginUser("bad@x.com", "pwd")).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should throw error for invalid password", async () => {
      const hashed = await bcrypt.hash("real_pw", 10);
      mockUserRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        email: "u@x.com",
        password: hashed,
        role: { name: "customer" },
      });
      await expect(AuthService.loginUser("u@x.com", "wrong")).rejects.toThrow(
        "Invalid email or password"
      );
    });

    it("should return user and token for valid credentials", async () => {
      const hashed = await bcrypt.hash("valid_pw", 10);
      const dbUser = {
        id: 2,
        name: "John",
        username: "john",
        email: "john@x.com",
        password: hashed,
        role: { name: "technician" },
      };
      mockUserRepository.findUserByEmail.mockResolvedValue(dbUser);
      const result = await AuthService.loginUser("john@x.com", "valid_pw");
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe("john@x.com");
      const decoded = jwt.verify(result.token, "test_secret_key");
      expect(decoded.id).toBe(2);
    });
  });

  // ── registerUser ──────────────────────────────────────────────────────
  describe("registerUser", () => {
    it("should throw error if email already exists", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue({ id: 1 });
      await expect(
        AuthService.registerUser({
          name: "A",
          username: "a",
          email: "dup@x.com",
          password: "pwd123",
          roleName: "customer",
        })
      ).rejects.toThrow("User with this email already exists");
    });

    it("should throw error for invalid role", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      await expect(
        AuthService.registerUser({
          name: "A",
          username: "a",
          email: "a@x.com",
          password: "pwd123",
          roleName: "admin",
        })
      ).rejects.toThrow("Only customer and technician roles can be self-registered");
    });

    it("should throw error if role is not configured", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockRoleRepository.findRoleByName.mockResolvedValue(null);
      await expect(
        AuthService.registerUser({
          name: "A",
          username: "a",
          email: "a@x.com",
          password: "pwd123",
          roleName: "customer",
        })
      ).rejects.toThrow('Role "customer" is not configured');
    });

    it("should register a customer successfully", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockRoleRepository.findRoleByName.mockResolvedValue({ id: 2, name: "customer" });
      mockUserRepository.createUser.mockResolvedValue({
        id: 10,
        name: "Alice",
        username: "alice",
        email: "alice@x.com",
        role: { name: "customer" },
      });
      const result = await AuthService.registerUser({
        name: "Alice",
        username: "alice",
        email: "alice@x.com",
        password: "secure123",
        roleName: "customer",
      });
      expect(result.id).toBe(10);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
      expect(mockTechnicianRepository.createTechnicianProfile).not.toHaveBeenCalled();
    });

    it("should register a technician and create profile", async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockRoleRepository.findRoleByName.mockResolvedValue({ id: 3, name: "technician" });
      mockUserRepository.createUser.mockResolvedValue({
        id: 20,
        name: "Bob",
        username: "bob",
        email: "bob@x.com",
        role: { name: "technician" },
      });
      mockTechnicianRepository.createTechnicianProfile.mockResolvedValue({ id: 99 });
      const result = await AuthService.registerUser({
        name: "Bob",
        username: "bob",
        email: "bob@x.com",
        password: "secure456",
        roleName: "technician",
        bio: "Expert electrician",
        skills: ["electrical", "wiring"],
        service_area: "Lahore",
      });
      expect(result.id).toBe(20);
      expect(mockTechnicianRepository.createTechnicianProfile).toHaveBeenCalledWith({
        user: { id: 20 },
        bio: "Expert electrician",
        skills: ["electrical", "wiring"],
        service_area: "Lahore",
        availability_status: "offline",
        rating: 0,
        total_jobs: 0,
      });
    });
  });
});
