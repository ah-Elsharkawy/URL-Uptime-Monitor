const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");
const mongoose = require("mongoose");

afterAll(async () => {
	// Close the MongoDB connection
	await User.findOneAndDelete({ email: "ali@gmail.com" });
	await mongoose.connection.close();
});

describe("Add new user", () => {
	test("should return 403 as user name is less than 3 characters", async () => {
		const res = await request(app).post("/user/signup").send({
			name: "al",
			email: "ali@gmail.com",
			password: "123456",
		});
		expect(res.statusCode).toEqual(403);
		expect(res.body.message).toEqual("Invalid signup format");
	});

	test("should return 403 as user mail is not valid", async () => {
		const res = await request(app).post("/user/signup").send({
			name: "ali",
			email: "aligmail.com",
			password: "123456",
		});
		expect(res.statusCode).toEqual(403);
		expect(res.body.message).toEqual("Invalid signup format");
	});

	test("should return 403 as user password is less than 5 characters", async () => {
		const res = await request(app).post("/user/signup").send({
			name: "ali",
			email: "ali@gmail.com",
			password: "1234",
		});
		expect(res.statusCode).toEqual(403);
		expect(res.body.message).toEqual("Invalid signup format");
	});

	test("should return 200 as user added successfully", async () => {
		const res = await request(app).post("/user/signup").send({
			name: "ali",
			email: "ali@gmail.com",
			password: "123456",
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("User added successfully");
	});

	test("should return 400 as user already exists", async () => {
		const res = await request(app).post("/user/signup").send({
			name: "ali",
			email: "ali@gmail.com",
			password: "123456",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toEqual("User already exists");
	});
});

describe("Login user", () => {
	test("should return 403 as user mail format is not valid", async () => {
		const res = await request(app).post("/user/login").send({
			email: "aligmail.com",
			password: "12345",
		});
		expect(res.statusCode).toEqual(403);
		expect(res.body.message).toEqual("Invalid login format");
	});

	test("should return 403 as user password format is not valid", async () => {
		const res = await request(app).post("/user/login").send({
			email: "ali@gmail.com",
			password: "1234",
		});
		expect(res.statusCode).toEqual(403);
		expect(res.body.message).toEqual("Invalid login format");
	});

	test("should return 400 as user doesn't exist", async () => {
		const res = await request(app).post("/user/login").send({
			email: "omar@gmail.com",
			password: "123456",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toEqual("User doesn't exist");
	});

	test("should return 400 as user password isn't correct", async () => {
		const res = await request(app).post("/user/login").send({
			email: "ali@gmail.com",
			password: "12345",
		});
		expect(res.statusCode).toEqual(400);
		expect(res.body.message).toEqual("Incorrect Password");
	});

	test("should return 200 as user logged in successfully", async () => {
		const res = await request(app).post("/user/login").send({
			email: "ali@gmail.com",
			password: "123456",
		});
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Logged in Successfully");
		expect(res.headers["x-auth-token"]).toBeDefined();
	});
});
