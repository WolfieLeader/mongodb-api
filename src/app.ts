import express, { Application, Response, Request } from "express";
// import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";

export default function createApp() {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  //   app.use(cors())
  app.use(helmet());
  app.use(morgan("dev"));

  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>Hello World!</h1>");
  });

  return app;
}
