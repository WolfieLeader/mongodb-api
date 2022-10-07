import { Request, Response } from "express";
import userModel from "../models/userModel";
import CError from "../error/CError";
import companyModel from "../models/companyModel";
import { addQueries } from "../config/mongodb/availableQueries";

/**Getting all the companies and the users who own them */
export const getAll = async (req: Request, res: Response) => {
  const companies = await companyModel.findNamesAndFounders();
  res.status(200).json(companies);
};

/**Getting all the users */
export const getUsers = async (req: Request, res: Response) => {
  const { order, limit, offset } = addQueries(req);
  const users = await userModel.findByQueries(order, limit, offset);
  if (!users || users.length < 1) throw new CError("No users found", 404);
  res.status(200).json(users);
};

/**Getting all the companies */
export const getCompanies = async (req: Request, res: Response) => {
  const { order, limit, offset } = addQueries(req);
  const companies = await companyModel.findByQueries(order, limit, offset);
  if (!companies || companies.length < 1) throw new CError("No companies found", 404);
  res.status(200).json(companies);
};
