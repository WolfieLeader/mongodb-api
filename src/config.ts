import dotenv from "dotenv";
dotenv.config();

export const PORT_HTTP = process.env.PORT_HTTP || 3000;
export const PORT_HTTPS = process.env.PORT_HTTPS || 3443;
