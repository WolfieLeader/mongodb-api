import mongoose from "mongoose";

export interface IUser {
  readonly id: number;
  name: string;
  networth: number;
  hobbies: string[] | null;
  email: string;
  password: string;
  createdAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {
  id: number;
  comparePassword: (password: string) => boolean;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByQueries: (order: string, limit: number, offset: number) => Promise<IUserDocument[]>;
}
