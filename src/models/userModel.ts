import { IUser } from "../interfaces";
import mongoose from "mongoose";
import { validateEmail, validateHobbies, validateId, validateName, validatePassword } from "../functions/validate";
import { isValidNumber } from "../functions/confirm";
import { saltIt } from "../functions/encrypt";

const userSchema = new mongoose.Schema<IUser>({
  id: {
    type: Number,
    immutable: true,
    unique: true,
  },
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

userSchema.pre("save", async function (next) {
  const model = mongoose.model("User", userSchema);
  const newId = (await model.countDocuments()) + 1;

  validateId(newId);
  validateName(this.name);
  validateEmail(this.email);
  validatePassword(this.password);
  if (this.networth) isValidNumber(this.networth, "Networth", true);
  if (Array.isArray(this.hobbies) && this.hobbies.length > 0) validateHobbies(this.hobbies);

  this.id = newId;
  this.name = this.name;
  this.email = this.email;
  this.password = saltIt(this.password);
  this.networth = this.networth ? this.networth : 0;
  this.hobbies = Array.isArray(this.hobbies) && this.hobbies.length > 0 ? this.hobbies : [];
  this.createdAt = new Date();

  next();
});

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;