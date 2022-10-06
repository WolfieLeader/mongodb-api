import { expect, it, describe } from "@jest/globals";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateId,
  validateHobbies,
  validateCompanyName,
} from "../validate";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;
const newObjectId = new ObjectId();
const empty = undefined;
const aNumber = 123;
const aString = "Test";
const strLength = (n: number) => "a".repeat(n);

const testEmail = () => {
  it("Should return true if the email is valid", () => {
    expect(validateEmail("test@gmail.com")).toBe(true);
  });
  it("Should throw errors if the email is invalid", () => {
    expect(() => validateEmail(empty)).toThrow("Missing Email");
    expect(() => validateEmail(aNumber)).toThrow("Invalid Email Type");
    expect(() => validateEmail(strLength(256))).toThrow("Email Too Long");
    expect(() => validateEmail("test@gmail..com")).toThrow("Invalid Email");
  });
};

const testName = () => {
  it("Should return true if the name is valid", () => {
    expect(validateName("Wolfie")).toBe(true);
  });
  it("Should throw errors if the name is invalid", () => {
    expect(() => validateName(empty)).toThrow("Missing Name");
    expect(() => validateName(aNumber)).toThrow("Invalid Name Type");
    expect(() => validateName(strLength(3))).toThrow("Name must be between 4 and 24 characters");
    expect(() => validateName(strLength(25))).toThrow("Name must be between 4 and 24 characters");
    expect(() => validateName("Test@")).toThrow("Invalid Name");
  });
};

const testPassword = () => {
  it("Should return true if the password is valid", () => {
    expect(validatePassword("SecurePassword123")).toBe(true);
  });
  it("Should throw errors if password is invalid", () => {
    expect(() => validatePassword(empty)).toThrow("Missing Password");
    expect(() => validatePassword(aNumber)).toThrow("Invalid Password Type");
    expect(() => validatePassword(strLength(7))).toThrow("Password must be between 8 and 24 characters");
    expect(() => validatePassword(strLength(25))).toThrow("Password must be between 8 and 24 characters");
    expect(() => validatePassword("שלוםShalom")).toThrow("Invalid Password");
  });
};

const testId = () => {
  it("Should return true if id is valid", () => {
    expect(validateId(newObjectId)).toBe(true);
  });
  it("Should throw errors if id is invalid", () => {
    expect(() => validateId(empty)).toThrow("Missing Id");
    expect(() => validateId(3232134432)).toThrow("Invalid Id Type");
  });
};

const testHobbies = () => {
  it("Should return true if hobbies is valid", () => {
    expect(validateHobbies(["Hob1", "Hob2", "Hob3"])).toBe(true);
  });
  it("Should throw errors if hobbies is invalid", () => {
    expect(() => validateHobbies(empty)).toThrow("Missing Hobbies");
    expect(() => validateHobbies(aString)).toThrow("Invalid Hobbies Type");
    expect(() => validateHobbies([])).toThrow("Missing Hobbies");
    expect(() => validateHobbies(["Hob1", "Hob2", "Hob3", "Hob4", "Hob5", "Hob6"])).toThrow("Too Many Hobbies");
    expect(() => validateHobbies([""])).toThrow("Missing Hobby");
    expect(() => validateHobbies(["Hob1", aNumber, "Hob3"])).toThrow("Invalid Hobby Type");
    expect(() => validateHobbies(["Hobby1", strLength(1), "Hobby2"])).toThrow(
      "Hobby must be between 2 and 50 characters"
    );
    expect(() => validateHobbies(["Hobby1", strLength(51), "Hobby2"])).toThrow(
      "Hobby must be between 2 and 50 characters"
    );
    expect(() => validateHobbies(["Hobby1", "@#Test!$", "Hobby2"])).toThrow("Invalid Hobby");
  });
};

const testCompanyName = () => {
  it("Should return true if the company is valid", () => {
    expect(validateName("Wolfie Company")).toBe(true);
  });
  it("Should throw errors if the company is invalid", () => {
    expect(() => validateCompanyName(empty)).toThrow("Missing Company Name");
    expect(() => validateCompanyName(aNumber)).toThrow("Invalid Company Name Type");
    expect(() => validateCompanyName(strLength(1))).toThrow("Company Name must be between 2 and 35 characters");
    expect(() => validateCompanyName(strLength(36))).toThrow("Company Name must be between 2 and 35 characters");
    expect(() => validateCompanyName("Wolfie's Company")).toThrow("Invalid Company Name");
  });
};

describe("Testing validate.ts Folder", () => {
  describe("Testing validateEmail Function", testEmail);
  describe("Testing validateName Function", testName);
  describe("Testing validatePassword Function", testPassword);
  describe("Testing validateId Function", testId);
  describe("Testing validateHobbies Function", testHobbies);
  describe("Testing validateCompanyName Function", testCompanyName);
});
