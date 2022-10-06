import { Request, Response } from "express";
import CError from "../error/CError";
import userModel from "../models/userModel";
import companyModel from "../models/companyModel";
import { isCompanyNameTaken, isEmailTaken, isNameTaken } from "../functions/query";
import {
  validateEmail,
  validateName,
  validateId,
  validateHobbies,
  validateYear,
  validateCompanyName,
  validatePassword,
} from "../functions/validate";
import { isValidNumber, isValidString } from "../functions/confirm";
import { stringToBigNumber } from "../functions/format";

/**Changing the user's name*/
export const changeName = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { name } = req.body;
  validateId(userId);
  validateName(name);
  if (await isNameTaken(name)) throw new CError("Name already taken", 409);
  await userModel.findByIdAndUpdate(userId, { name: name });
  res.status(200).json({ message: "Name changed successfully", name: name });
};

/**Changing the user's email*/
export const changeEmail = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { email } = req.body;
  validateId(userId);
  validateEmail(email);
  const isTaken = await isEmailTaken(email.toLowerCase());
  if (isTaken) throw new CError("Email already taken", 409);
  await userModel.findByIdAndUpdate(userId, { email: email });
  res.status(200).json({ message: "Email changed successfully", email: email });
};

/**Changing the user's password*/
export const changePassword = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { last, password } = req.body;
  validateId(userId);
  validatePassword(last);
  validatePassword(password);
  const user = await userModel.findById(userId);
  if (!user) throw new CError("User not found", 404);
  const comparedPasswords = user.comparePassword(last);
  if (!comparedPasswords) throw new CError("Wrong Password", 401);
  await userModel.findByIdAndUpdate(userId, { password: password });
  res.status(200).json({ message: "Password changed successfully" });
};

/**Changing the user's networth*/
export const changeNetworth = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { networth } = req.body;
  validateId(userId);
  isValidString(networth);
  const networthNum = stringToBigNumber(networth);
  isValidNumber(networthNum);
  await userModel.findByIdAndUpdate(userId, { networth: networthNum });
  res.status(200).json({ message: "Networth changed successfully", networth: networthNum });
};

/**Changing the user's hobbies*/
export const changeHobbies = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { hobbies } = req.body;
  validateId(userId);
  validateHobbies(hobbies);
  await userModel.findByIdAndUpdate(userId, { hobbies: hobbies });
  res.status(200).json({ message: "Hobbies changed successfully", hobbies: hobbies });
};

/**Creating a new company*/
export const createCompany = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { name } = req.body;
  validateId(userId);
  validateCompanyName(name);
  if (await isCompanyNameTaken(name)) throw new CError("Company name already taken", 409);
  await companyModel.create({ name: name, founders: [userId] });
  res.status(201).json({ message: "Company created successfully", name: name });
};

/**Changing the company's name*/
export const changeCompanyName = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { last, name } = req.body;
  validateId(userId);
  validateCompanyName(last);
  validateCompanyName(name);
  if (await isCompanyNameTaken(name)) throw new CError("Company name already taken", 409);
  const company = await companyModel.findOne({ name: last.toLowerCase(), founders: { $in: [userId] } });
  if (!company) throw new CError("Company not found", 404);
  await companyModel.findByIdAndUpdate(company._id, { name: name });
  res.status(200).json({ message: "Company name changed successfully", name: name });
};

/**Changing the company's year*/
export const changeCompanyYear = async (req: Request, res: Response) => {
  const { userId } = res.locals;
  const { name, year } = req.body;
  validateId(userId);
  validateYear(year);
  validateCompanyName(name);
  const company = await companyModel.findOne({ name: name, founders: { $in: [userId] } });
  if (!company) throw new CError("Company not found", 404);
  await companyModel.findByIdAndUpdate(company._id, { year: year });
  res.status(200).json({ message: "Company year changed successfully", year: year });
};
