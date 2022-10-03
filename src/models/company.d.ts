import mongoose from "mongoose";

export interface ICompany {
  readonly id: number;
  name: string;
  founders: mongoose.Types.ObjectId[];
  year: number | null;
}

export interface ICompanyDocument extends ICompany, mongoose.Document {
  id: number;
}

export interface FilteredCompany {
  Company: string;
  Founders: string[];
}

export interface PopulatedCompany {
  name: string;
  founders: {
    _id: mongoose.Types.ObjectId;
    name: string;
  }[];
}

interface ICompanyModel extends mongoose.Model<ICompanyDocument> {
  findByQueries: (order: string, limit: number, offset: number) => Promise<ICompanyDocument[]>;
  findNamesAndFounders: () => Promise<FilteredCompany[]>;
}
