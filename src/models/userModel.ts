import mongoose from "mongoose";
import { compareSalt } from "../functions/encrypt";
import { IUser, IUserDocument, IUserModel } from "./user";
import { preUserSave } from "./preSaves";

const userSchema = new mongoose.Schema<IUserDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  networth: {
    type: Number,
  },
  hobbies: { type: [String] },
  createdAt: { type: Date, immutable: true },
});

userSchema.pre("save", function (next) {
  //Possible since there aren't any pointers in javascript
  const user = this;
  preUserSave(user);
  next();
});

userSchema.pre("insertMany", function (next, docs) {
  const users = docs as IUser[];
  if (!Array.isArray(users)) throw new Error("insertMany must be an array");
  if (users.length < 1) throw new Error("insertMany must have at least one user");
  users.forEach((user) => preUserSave(user));
  next();
});

userSchema.methods.comparePassword = function (password: string): boolean {
  const user = this;
  return compareSalt(user.password, password);
};

userSchema.statics.findByQueries = function (order: string, limit: number, offset: number): Promise<IUserDocument[]> {
  const users = this;
  return users.find().sort({ name: order }).limit(limit).skip(offset);
};

const userModel = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default userModel;
