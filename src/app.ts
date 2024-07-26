import express, { Application, Response, Request } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

export default function createApp() {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: ["http://localhost:3000", "https://localhost:3443"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      referrerPolicy: { policy: "no-referrer" },
      xssFilter: true,
      hsts: {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
    })
  );

  app.use(morgan("combined"));

  app.use(
    rateLimit({
      windowMs: 1000 * 10 * 60, // 10 minutes
      max: 3,
      message: "Too many requests from this IP, please try again after a break",
      handler: (req, res, next, options) => {
        console.error(`Rate limit exceeded: ${req.ip} attempted to access ${req.originalUrl}`);
        res.status(options.statusCode).json({ error: { message: options.message } });
      },
    })
  );

  // Sample route
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>Hello World!</h1>");
  });

  return app;
}
