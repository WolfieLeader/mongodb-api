import app from "./config/app";
import CONNECTION_URL from "./config/mongodb/url";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`⚡Server is running on http://localhost:${PORT}/`)))
  .catch((error) => console.log(error.message));
