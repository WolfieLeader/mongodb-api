import { expect, it, describe, beforeAll, afterAll } from "@jest/globals";
import supertest from "supertest";
import app from "../config/app";
import TEST_CONNECTION_URL from "../config/mongodb/test";
import mongoose from "mongoose";

const request = supertest(app);

describe("GET /", () => {
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
  it("Should return status code of 200", async () => {
    const res = await request.get("/");
    expect(res.statusCode).toBe(200);
  });
});
