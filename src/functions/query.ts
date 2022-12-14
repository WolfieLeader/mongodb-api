import companyModel from "../models/companyModel";
import userModel from "../models/userModel";

/**Checking whether the name is taken or not */
export const isEmailTaken = async (email: string): Promise<boolean> => {
  const user = await userModel.findOne({ email: email });
  if (user) return true;
  return false;
};

/**Checking whether the name is taken or not */
export const isNameTaken = async (name: string): Promise<boolean> => {
  const user = await userModel.findOne({ name: name.toLowerCase() });
  if (user) return true;
  return false;
};

/**Checking whether the company name is taken or not */
export const isCompanyNameTaken = async (name: string): Promise<boolean> => {
  const [takenCompanyName] = await companyModel.find({ name: name });
  if (Array.isArray(takenCompanyName) && takenCompanyName.length > 0) return true;
  return false;
};
