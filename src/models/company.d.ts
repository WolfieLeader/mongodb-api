import mongoose from "mongoose";
import { IUser } from "./user";

export interface ICompany {
  name: string;
  founders: ObjectId[] | IUser[];
  year: number | null;
}
export interface ICompanyDocument extends ICompany, mongoose.Document {}

interface ICompanyModel extends mongoose.Model<ICompanyDocument> {
  findByQueries: (order: string, limit: number, offset: number) => Promise<ICompanyDocument[]>;
  findNamesAndFounders: () => Promise<FilteredCompany[]>;
}

export interface IPopulatedCompanyDocument extends ICompany, mongoose.Document {
  founders: IUser[];
}

export interface FilteredCompany {
  Company: string;
  Founders: string[];
}
