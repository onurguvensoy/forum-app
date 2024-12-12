const { Login, Signup, Entry, getAllEntries} = require("../Controllers/AuthController");
const User = require("../Models/UserModel");
const EntrySchema = require("../Models/EntrySchema");
const bcrypt = require("bcryptjs");

jest.mock("../Models/UserModel");
jest.mock("../Models/EntrySchema");
jest.mock("../Models/MessageModel");
jest.mock("bcryptjs");

describe("Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Login", () => {
    it("should return an error if email or password is missing", async () => {
      const req = { body: { email: "",username:"", password: "" } };
      const res = {
        json: jest.fn(),
      };
      await Login(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "All fields are required" });
    });

    it("should return an error for incorrect email or password", async () => {
      const req = { body: { email: "test@example.com", password: "password123" } };
      const res = {
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null); 
      await Login(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "Incorrect password or email" });
    });

    it("should return a success message if login is successful", async () => {
      const req = { body: { email: "test@example.com", username:"testuser", password: "password123" } };
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };


      User.findOne.mockResolvedValue({ _id: "123", password: "hashedpassword" });
      bcrypt.compare.mockResolvedValue(true); 
      await Login(req, res);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User logged in successfully",
        success: true,
      });
    });
  });

  describe("Signup", () => {
    it("should return an error if user already exists", async () => {
      const req = { body: { email: "test@example.com" } };
      const res = {
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue({ email: "test@example.com" }); 
      await Signup(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });

    it("should return a success message if signup is successful", async () => {
      const req = { body: { email: "test@example.com", password: "password123", username: "testuser", createdAt: new Date() } };
      const res = {
        cookie: jest.fn(),
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      User.findOne.mockResolvedValue(null); 
      User.create.mockResolvedValue({ _id: "123", email: "test@example.com", username: "testuser" });
      await Signup(req, res);
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User signed in successfully",
        success: true,
        user: { _id: "123", email: "test@example.com", username: "testuser" },
      });
    });
  });

  describe("Entry", () => {
    it("should return a success message if entry is created", async () => {
      const req = { body: { title: "Test Entry", content: "Test Content", username: "testuser", createdAt: new Date() } };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      EntrySchema.create.mockResolvedValue({ _id: "123", title: "Test Entry" });
      await Entry(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Entry created successfully",
        success: true,
        entry: { _id: "123", title: "Test Entry" },
      });
    });
  });

  describe("getAllEntries", () => {
    it("should fetch all entries successfully", async () => {
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      EntrySchema.find.mockResolvedValue([{ title: "Test Entry" }]);
      await getAllEntries(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ title: "Test Entry" }]);
    });
  });
});
