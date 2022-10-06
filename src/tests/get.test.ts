import { expect, it, describe, afterAll, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../config/app";
import TEST_CONNECTION_URL from "../config/mongodb/test";
import mongoose from "mongoose";
import { defaultUsers } from "../config/setup/users";
import { defaultCompanies } from "../config/setup/companies";

describe("Testing Users", () => {
  /**Opens the server before all the tests */
  let server: any;
  beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(TEST_CONNECTION_URL);
    server = app.listen(3000);
    await request(app).post("/reset");
  });
  /**Closes the server and the mongoose connection after all the tests */
  afterAll(async () => {
    await mongoose.disconnect();
    await server.close();
  });
  /**The tests*/
  describe("GET Requests", () => {
    describe("/", () => {
      it("Should return status code of 200", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
      });
    });
    describe("/users", () => {
      it("Should get all users", async () => {
        const res = await request(app).get("/users");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(defaultUsers.length);
      });
      it("Should get users by order, limit and offset", async () => {
        const order = "desc",
          limit = 3,
          offset = 2;
        const res = await request(app).get(`/users?order=${order}&&limit=${limit}&&offset=${offset}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        const expectedResults = defaultUsers
          .sort((a, b) => a.name.localeCompare(b.name))
          .reverse()
          .slice(offset, offset + limit)
          .map((user) => user.name.toLowerCase());
        const actualResults = res.body.map((user: any) => user.name);
        expect(actualResults).toEqual(expectedResults);
      });
    });
    describe("/companies", () => {
      it("Should get all companies", async () => {
        const res = await request(app).get("/companies");
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(defaultCompanies.length);
      });
      it("Should get companies by order, limit and offset", async () => {
        const order = "desc",
          limit = 4,
          offset = 2;
        const res = await request(app).get(`/companies?order=${order}&&limit=${limit}&&offset=${offset}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        const expectedResults = defaultCompanies
          .sort((a, b) => a.name.localeCompare(b.name))
          .reverse()
          .slice(offset, offset + limit)
          .map((company) => company.name.toLowerCase());
        const actualResults = res.body.map((company: any) => company.name);
        expect(actualResults).toEqual(expectedResults);
      });
    });
  });
});
