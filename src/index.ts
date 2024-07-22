import https from "https";
import http from "http";
import path from "path";
import fs from "fs";
import createApp from "./app";
import { PORT_HTTP, PORT_HTTPS } from "./config";

const app = createApp();

const keyPath = path.resolve(__dirname, "../cert/key.pem") || "";
const certPath = path.resolve(__dirname, "../cert/cert.pem") || "";

const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    key: fs.readFileSync(keyPath, "utf8"),
    cert: fs.readFileSync(certPath, "utf8"),
  },
  app
);

function main() {
  httpServer.listen(PORT_HTTP, () => console.log(`Server is running on http://localhost:${PORT_HTTP}`));
  httpsServer.listen(PORT_HTTPS, () => console.log(`Secure server is running on https://localhost:${PORT_HTTPS}`));
}

main();
