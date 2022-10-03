import mongoose from "mongoose";
import { validateCompanyName, validateId, validateYear } from "../functions/validate";
import { ICompanyDocument, FilteredCompany, PopulatedCompany, ICompanyModel } from "./company";

const companySchema = new mongoose.Schema<ICompanyDocument>({
  id: {
    type: Number,
    unique: true,
    immutable: true,
  },
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

companySchema.pre("save", async function (next) {
  const company = this;

  const model = mongoose.model("Company", companySchema);
  const newId = (await model.countDocuments()) + 1;
  validateId(newId);
  validateCompanyName(company.name);
  if (company.year) validateYear(company.year);

  company.id = newId;
  company.name = company.name;
  company.founders = company.founders;
  company.year = company.year ? company.year : null;
  next();
});

companySchema.statics.findByQueries = function (
  order: string,
  limit: number,
  offset: number
): Promise<ICompanyDocument[]> {
  const companies = this;
  return companies.find().sort(order).limit(limit).skip(offset).exec();
};

companySchema.statics.findNamesAndFounders = async function (): Promise<FilteredCompany[]> {
  const companies = this;

  const populatedCompanies: PopulatedCompany[] = await companies.find().populate("founders", "name");

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
