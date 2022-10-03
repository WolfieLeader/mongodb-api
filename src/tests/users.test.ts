import { expect, it, describe, afterAll, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../config/app";
import { defaultUsers } from "../config/setup/users";
import { bigNumberToString } from "../functions/format";
import mongoose from "mongoose";
import TEST_CONNECTION_URL from "../config/mongodb/test";

describe("Testing Users", () => {
  /**Opens the server before all the tests */
  let server: any;
  beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(TEST_CONNECTION_URL);
    server = app.listen(3000);
  });
  /**Closes the server and the mongoose connection after all the tests */
  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });
  /**The tests*/
  describe("GET /users", () => {
    it("Should reset the database", async () => {
      const res = await request(app).post("/reset");
      expect(res.status).toBe(200);
    });
    it("Should get all users", async () => {
      const res = await request(app).get("/users");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(defaultUsers.length);
    });
    it("Should get a user by id", async () => {
      const res = await request(app).get("/users/1,3,5");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body[0].id).toBe(1);
      expect(res.body[1].id).toBe(3);
      expect(res.body[2].id).toBe(5);
    });
    it("Should get users by order, limit and offset", async () => {
      const res = await request(app).get("/users?order=desc&&limit=3&&offset=1");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(3);
    });
  });
  describe("Authentication", () => {
    it("Should register a new user", async () => {
      const res1 = await request(app).post("/auth/signup").send({
        name: "Test",
        email: "test@testnet.com",
        password: "SecurePassword123",
      });
      expect(res1.statusCode).toBe(201);
      const res2 = await request(app).get("/users?order=desc&&limit=1");
      expect(res2.statusCode).toBe(200);
      expect(res2.body).toBeInstanceOf(Array);
      expect(res2.body.length).toBe(1);
      expect(res2.body[0].name).toBe("test");
    });
    it("Should login a user", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "test@testnet.com",
        password: "SecurePassword123",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.token).not.toBe("");
    });
  });
  describe("User Actions", () => {
    it("Should change the user's name", async () => {
      const res1 = await request(app).post("/auth/login").send({
        email: "test@testnet.com",
        password: "SecurePassword123",
      });
      const res2 = await request(app).put("/actions/name").set("Authorization", `Bearer ${res1.body.token}`).send({
        name: "Test2",
      });
      expect(res2.statusCode).toBe(200);
      expect(res2.body.message).toBe("Name changed successfully");
      expect(res2.body.name).toBe("Test2");
    });
    it("Should change the user's email", async () => {
      const res1 = await request(app).post("/auth/login").send({
        email: "test@testnet.com",
        password: "SecurePassword123",
      });
      const res2 = await request(app).put("/actions/email").set("Authorization", `Bearer ${res1.body.token}`).send({
        email: "test2@testnet.com",
      });
      expect(res2.statusCode).toBe(200);
      expect(res2.body.message).toBe("Email changed successfully");
      expect(res2.body.email).toBe("test2@testnet.com");
    });
    it("Should change the user's networth", async () => {
      const res1 = await request(app).post("/auth/login").send({
        email: "test2@testnet.com",
        password: "SecurePassword123",
      });
      const res2 = await request(app).put("/actions/networth").set("Authorization", `Bearer ${res1.body.token}`).send({
        networth: "5B",
      });
      expect(res2.statusCode).toBe(200);
      expect(res2.body.message).toBe("Networth changed successfully");
      expect(bigNumberToString(res2.body.networth)).toBe("5B");
    });
    it("Should change the user's hobbies", async () => {
      const res1 = await request(app).post("/auth/login").send({
        email: "test2@testnet.com",
        password: "SecurePassword123",
      });
      const res2 = await request(app)
        .put("/actions/hobbies")
        .set("Authorization", `Bearer ${res1.body.token}`)
        .send({
          hobbies: ["Hobby1", "Hobby2"],
        });
      expect(res2.statusCode).toBe(200);
      expect(res2.body.message).toBe("Hobbies changed successfully");
      expect(res2.body.hobbies).toBeInstanceOf(Array);
      expect(res2.body.hobbies.length).toBe(2);
      expect(res2.body.hobbies).toEqual(["Hobby1", "Hobby2"]);
    });
    it("Should create a new company", async () => {
      const res1 = await request(app).post("/auth/login").send({
        email: "test2@testnet.com",
        password: "SecurePassword123",
      });
      const res2 = await request(app).post("/actions/company").set("Authorization", `Bearer ${res1.body.token}`).send({
        name: "Test Company",
        year: 2000,
      });

      expect(res2.statusCode).toBe(201);
      expect(res2.body.message).toBe("Company created successfully");
    });
    it("Should change the company's name", async () => {
      const res1 = await request(app).post("/auth/login").send({
        email: "test2@testnet.com",
        password: "SecurePassword123",
      });
      const res2 = await request(app)
        .put("/actions/company-name")
        .set("Authorization", `Bearer ${res1.body.token}`)
        .send({
          last: "Test Company",
          name: "Awesome Company",
        });
      expect(res2.statusCode).toBe(200);
      expect(res2.body.message).toBe("Company name changed successfully");
    });
    it("Should change the company's year", async () => {
      const res1 = await request(app).post("/auth/login").send({
        email: "test2@testnet.com",
        password: "SecurePassword123",
      });
      const res2 = await request(app)
        .put("/actions/company-year")
        .set("Authorization", `Bearer ${res1.body.token}`)
        .send({
          name: "Awesome Company",
          year: 2003,
        });
      expect(res2.statusCode).toBe(200);
      expect(res2.body.message).toBe("Company year changed successfully");
    });
  });
});
