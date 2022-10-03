import dotenv from "dotenv";
dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const CLUSTER = process.env.DB_CLUSTER;
const DATABASE = "entrepreneurs";
const CONNECTION_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}.chuvgb2.mongodb.net/${DATABASE}?retryWrites=true&w=majority`;

export default CONNECTION_URL;
