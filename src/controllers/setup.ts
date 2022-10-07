import { Request, Response } from "express";
import CONNECTION_URL from "../config/mongodb/url";
import userModel from "../models/userModel";
import companyModel from "../models/companyModel";
import { defaultUsers } from "../config/default/default";
import { defaultCompanies } from "../config/default/companies";
import { stringToBigNumber } from "../functions/format";

/**Showing the database connection settings */
export const getSettings = (req: Request, res: Response) => {
  res.status(200).json({ settings: CONNECTION_URL });
};

/**This function will reset the tables in the database */
export const resetTables = async (req: Request, res: Response) => {
  await companyModel.deleteMany({});
  await userModel.deleteMany({});

  const users = defaultUsers.map((user) => {
    return {
      name: user.name,
      email: user.email,
      password: user.password,
      networth: user.networth ? stringToBigNumber(user.networth) : 0,
      hobbies: user.hobbies ? user.hobbies : [],
    };
  });
  await userModel.insertMany(users);

  const companies = await Promise.all(
    defaultCompanies.map(async (company) => {
      const foundersIds = await userModel.find({ name: { $in: company.foundersNames } }).select("_id");
      return {
        name: company.name,
        founders: foundersIds,
        year: company.year,
      };
    })
  );

  await companyModel.insertMany(companies);

  const results = await companyModel.findNamesAndFounders();
  res.status(200).json(results);
};
