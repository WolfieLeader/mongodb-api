import express, { Application, Response, Request } from "express";
// import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

export default function createApp() {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  //   app.use(cors())
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      limit: 100,
      message: "Too Many requests, chill down and try again later :)",
      handler: (req, res, next, options) => {
        res.status(options.statusCode).json({ error: { message: options.message } });
      },
    })
  );
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>Hello World!</h1>");
  });

  return app;
}
