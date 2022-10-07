import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  networth: number;
  hobbies: string[] | null;
}

export interface IUserDocument extends IUser, mongoose.Document {
  readonly createdAt: Date;
  comparePassword: (password: string) => boolean;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByQueries: (order: string, limit: number, offset: number) => Promise<IUserDocument[]>;
}
