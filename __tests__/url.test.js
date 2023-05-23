const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const URL = require("../models/urlModel");
const User = require("../models/userModel");

let token;
let unauthorizedToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDY3Y2EyNzQzYmRkZTliZjlmNDViOTciLCJpYXQiOjE2ODQ2ODY0MTN9.9762lxn7Ofdk9-KkrW_DrxGq9ma-K439ZZOLbCSNxyM";
let existingLink = "https://fakestoreapi.com/products/2";
let urlUpdate;

beforeAll(async () => {
	await request(app).post("/user/signup").send({
		name: "ali",
		email: "ali@gmail.com",
		password: "123456",
	});

	const res = await request(app).post("/user/login").send({
		email: "ali@gmail.com",
		password: "123456",
	});

	token = res.headers["x-auth-token"];
});

describe("Add URL", () => {
	test("should return 401 if token is not provided", async () => {
		const res = await request(app).post("/url/").send({
			link: "https://www.google.com",
		});

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Access denied, please login");
	});

	test("should return 400 if token is invalid", async () => {
		const res = await request(app)
			.post("/url/")
			.send({
				link: "https://www.google.com",
			})
			.set("x-auth-token", "malformed token");

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Invalid token");
	});

	test("should return 400 as link is Invalid", async () => {
		const res = await request(app)
			.post("/url/")
			.send({
				link: "",
			})
			.set("x-auth-token", token);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Link is required or Invalid");
	});

	test("should return 400 if link is not provided", async () => {
		const res = await request(app)
			.post("/url/")
			.send({
				tag: "test",
			})
			.set("x-auth-token", token);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Link is required or Invalid");
	});

	test("should return 200 as the link is provided and correct", async () => {
		const res = await request(app)
			.post("/url/")
			.send({
				link: "https://www.google.com",
				tag: "test",
			})
			.set("x-auth-token", token);

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe(
			"URL added successfully and monitoring started"
		);
	});
});

describe("Get URL report by link", () => {
	test("should return 401 if token is not provided", async () => {
		const res = await request(app).get(
			"/url/report/?link='https%3A%2F%2Fwww.google.com"
		);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Access denied, please login");
	});

	test("should return 400 if token is invalid", async () => {
		const res = await request(app)
			.get("/url/report/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", "malformed token");
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Invalid token");
	});

	test("should return 404 if link is not found", async () => {
		const res = await request(app)
			.get("/url/report/?link='https%3A%2F%2Fwww.youtube.com%2F'")
			.set("x-auth-token", token);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("URL not found");
	});

	test("should return 401 if the user is Unauthorized", async () => {
		const res = await request(app)
			.get("/url/report/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", unauthorizedToken);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Unauthorized");
	});

	test("should return 200 and the url report as the user is authorized", async () => {
		const res = await request(app)
			.get("/url/report/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", token);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe("URL report");
		expect(res.body.report).toBeDefined();
		
	});
});

describe("Get all URLs created by the user", () => {
	test("should return 401 if token is not provided", async () => {
		const res = await request(app).get("/url/all");

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Access denied, please login");
	});

	test("should return 400 if token is invalid", async () => {
		const res = await request(app)
			.get("/url/all")
			.set("x-auth-token", "malformed token");

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Invalid token");
	});

	test("should return 200 as the user is authorized", async () => {
		const res = await request(app).get("/url/all").set("x-auth-token", token);

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe("Your URLs");
		expect(res.body.urls).toBeDefined();
	});
});

describe("Get user URLs by tag", () => {
	test("should return 401 if token is not provided", async () => {
		const res = await request(app).get("/url/tag/test");

		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Access denied, please login");
	});

	test("should return 400 if token is invalid", async () => {
		const res = await request(app)
			.get("/url/tag/test")
			.set("x-auth-token", "malformed token");

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Invalid token");
	});

	test("should return 200 as the user is authorized", async () => {
		const res = await request(app)
			.get("/url/tag/test")
			.set("x-auth-token", token);

		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe("Your URLs");
		expect(res.body.urls).toBeDefined();
	});
});

describe("Get URL metrics by link", () => {
	test("should return 401 if token is not provided", async () => {
		const res = await request(app).get(
			"/url/metrics/?link='https%3A%2F%2Fwww.google.com"
		);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Access denied, please login");
	});

	test("should return 400 if token is invalid", async () => {
		const res = await request(app)
			.get("/url/metrics/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", "malformed token");
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Invalid token");
	});

	test("should return 404 if link is not found", async () => {
		const res = await request(app)
			.get("/url/metrics/?link='https%3A%2F%2Fwww.youtube.com%2F'")
			.set("x-auth-token", token);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("URL not found");
	});

	test("should return 401 if the user is Unauthorized", async () => {
		const res = await request(app)
			.get("/url/metrics/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", unauthorizedToken);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Unauthorized");
	});

	test("should return 200 and the url metrics as the user is authorized", async () => {
		const res = await request(app)
			.get("/url/metrics/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", token);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe("URL found");
		expect(res.body.url).toBeDefined();
		urlUpdate = res.body.url;
		console.log(urlUpdate);
	});
});

describe("Update URL", () => {
	test("should return 401 if token is not provided", async () => {
		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.google.com")
			.send(urlUpdate);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Access denied, please login");
	});

	test("should return 400 if token is invalid", async () => {
		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", "malformed token")
			.send(urlUpdate);
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Invalid token");
	});

	test("should return 400 if link is not provided", async () => {
		let urlUpdateWithoutLink = { ...urlUpdate };
		delete urlUpdateWithoutLink.link;

		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", token)
			.send(urlUpdateWithoutLink);
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Link is required or Invalid");
	});

	test("should return 400 if link is not valid", async () => {
		urlUpdate.link = "invalid link";
		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", token)
			.send(urlUpdate);
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Link is required or Invalid");
	});

	test("should return 400 as the Updated Link already exists in another Document", async () => {
		urlUpdate.link = existingLink;
		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", token)
			.send(urlUpdate);
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Can't update, Link already exists");
	});

	test("should return 404 if link is not found", async () => {
		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.youtube.com%2F'")
			.set("x-auth-token", token)
			.send(urlUpdate);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("URL not found");
	});

	test("should return 401 if the user is Unauthorized", async () => {
		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", unauthorizedToken)
			.send(urlUpdate);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Unauthorized");
	});

	 test("should return 200 as the link is found and updated", async () => {
        urlUpdate.link = "https://www.google.com";
        urlUpdate.tag = "test1";
        
		const res = await request(app)
			.put("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", token)
			.send(urlUpdate);
        //expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe("URL updated successfully");
        expect(res.body.url).toBeDefined();
        console.log(res.body.url);
    }); 
});

describe("Delete URL", () => {
	test("should return 401 if token is not provided", async () => {
		const res = await request(app).delete(
			"/url/?link='https%3A%2F%2Fwww.google.com"
		);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Access denied, please login");
	});

	test("should return 400 if token is invalid", async () => {
		const res = await request(app)
			.delete("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", "malformed token");
		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe("Invalid token");
	});

	test("should return 404 if link is not found", async () => {
		const res = await request(app)
			.delete("/url/?link='https%3A%2F%2Fwww.youtube.com%2F'")
			.set("x-auth-token", token);
		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe("URL not found");
	});

	test("should return 401 if the user is Unauthorized", async () => {
		const res = await request(app)
			.delete("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", unauthorizedToken);
		expect(res.statusCode).toBe(401);
		expect(res.body.message).toBe("Unauthorized");
	});

	test("should return 200 as the link is found and deleted", async () => {
		const res = await request(app)
			.delete("/url/?link='https%3A%2F%2Fwww.google.com'")
			.set("x-auth-token", token);
		expect(res.statusCode).toBe(200);
		expect(res.body.message).toBe("URL deleted successfully");
	});
});

afterAll(async () => {
	// Remove the user from the database
	await User.findOneAndDelete({ email: "ali@gmail.com" });
	await URL.findOneAndDelete({ link: "https://www.google.com" });
	// Close the MongoDB connection
	await mongoose.connection.close();
});
