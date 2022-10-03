import { expect, it, describe, afterAll, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../config/app";
import TEST_CONNECTION_URL from "../config/mongodb/test";
import mongoose from "mongoose";

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
  describe("GET /companies", () => {
    it("Should reset the database", async () => {
      const res = await request(app).post("/reset");
      expect(res.status).toBe(200);
    });
    it("Should get all companies", async () => {
      const res = await request(app).get("/companies");
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBe(7);
    });
  });
});
