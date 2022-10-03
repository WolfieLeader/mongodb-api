import { Request, Response } from "express";
import CONNECTION_URL from "../config/mongodb/url";
import userModel from "../models/userModel";
import companyModel from "../models/companyModel";
import { defaultUsers } from "../config/setup/users";
import { defaultCompanies } from "../config/setup/companies";
import { stringToBigNumber } from "../functions/format";

/**Showing the database connection settings */
export const getSettings = (req: Request, res: Response) => {
  res.status(200).json({ settings: CONNECTION_URL });
};

/**This function will reset the tables in the database */
export const resetTables = async (req: Request, res: Response) => {
  await companyModel.deleteMany({});
  await userModel.deleteMany({});

  for (const user of defaultUsers) {
    const newUser = new userModel({
      name: user.name,
      email: user.email,
      password: user.password,
      networth: user.networth ? stringToBigNumber(user.networth) : 0,
      hobbies: user.hobbies ? user.hobbies : [],
    });
    await newUser.save();
  }

  for (const company of defaultCompanies) {
    const foundersIds = await userModel.find({ name: { $in: company.foundersNames } }).select("_id");
    const newCompany = new companyModel({
      name: company.name,
      founders: foundersIds,
      year: company.year,
    });
    await newCompany.save();
  }

  const companies = await companyModel.findNamesAndFounders();
  res.status(200).json(companies);
};
