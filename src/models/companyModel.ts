import { ICompany } from "../interfaces";
import mongoose from "mongoose";
import { validateCompanyName, validateId, validateYear } from "../functions/validate";

const companySchema = new mongoose.Schema<ICompany>({
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
  const model = mongoose.model("Company", companySchema);
  const newId = (await model.countDocuments()) + 1;
  validateId(newId);
  validateCompanyName(this.name);
  if (this.year) validateYear(this.year);

  this.id = newId;
  this.name = this.name;
  this.founders = this.founders;
  this.year = this.year ? this.year : null;
  next();
});

const companyModel = mongoose.model("Company", companySchema);

export default companyModel;
