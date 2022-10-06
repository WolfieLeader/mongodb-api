import mongoose from "mongoose";
import { ICompanyDocument, IPopulatedCompanyDocument, FilteredCompany, ICompanyModel, ICompany } from "./company";
import { preCompanySave } from "./preSaves";

const companySchema = new mongoose.Schema<ICompanyDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  founders: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
  year: {
    type: Number,
  },
});

companySchema.pre("save", function (next) {
  //Possible since there aren't any pointers in javascript
  const company = this;
  preCompanySave(company);
  next();
});

companySchema.pre("insertMany", function (next, docs) {
  const companies = docs as ICompany[];
  if (!Array.isArray(companies)) throw new Error("insertMany must be an array");
  if (companies.length < 1) throw new Error("insertMany must have at least one company");
  companies.forEach((company) => preCompanySave(company));
  next();
});

companySchema.statics.findByQueries = function (
  order: string,
  limit: number,
  offset: number
): Promise<ICompanyDocument[]> {
  const companies = this;
  return companies.find().sort({ name: order }).limit(limit).skip(offset);
};

companySchema.statics.findNamesAndFounders = async function (): Promise<FilteredCompany[]> {
  const companies = this;

  const populatedCompanies: IPopulatedCompanyDocument[] = await companies
    .find()
    .populate("founders", "name")
    .sort({ name: "asc" });

  const filteredCompanies: FilteredCompany[] = populatedCompanies.map((company) => {
    return {
      Company: company.name,
      Founders: company.founders.map((founder) => founder.name),
    };
  });

  return filteredCompanies;
};

const companyModel = mongoose.model<ICompanyDocument, ICompanyModel>("Company", companySchema);

export default companyModel;
