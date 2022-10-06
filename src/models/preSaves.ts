import { isValidNumber } from "../functions/confirm";
import { saltIt } from "../functions/encrypt";
import {
  validateCompanyName,
  validateEmail,
  validateHobbies,
  validateName,
  validatePassword,
  validateYear,
} from "../functions/validate";
import { ICompany, ICompanyDocument } from "./company";
import { IUser, IUserDocument } from "./user";

export const preUserSave = (object: IUserDocument | IUser) => {
  validateName(object.name);
  validateEmail(object.email);
  validatePassword(object.password);
  if (object.networth) isValidNumber(object.networth, "Networth", true);
  if (Array.isArray(object.hobbies) && object.hobbies.length > 0) validateHobbies(object.hobbies);

  object.name = object.name;
  object.email = object.email;
  object.password = saltIt(object.password);
  object.networth = object.networth ? object.networth : 0;
  object.hobbies = Array.isArray(object.hobbies) && object.hobbies.length > 0 ? object.hobbies : [];
  object.createdAt = new Date();
};

export const preCompanySave = (object: ICompanyDocument | ICompany) => {
  validateCompanyName(object.name);
  if (object.year) validateYear(object.year);
  if (object.founders.length < 1) throw new Error("Company must have at least one founder");

  object.name = object.name;
  object.founders = object.founders;
  object.year = object.year ? object.year : null;
};
