import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { ApiRouter } from "./routes/root";
import { Env } from "./utils/env";
import errorHandler from "./middlewares/handlers/error-handler";

const app = express();

app.use(
  cors({
    origin: Env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", ApiRouter);
app.use(errorHandler);

const server = app.listen(Env.PORT, () => {
  console.info(`Server running on port ${Env.PORT}`);
});

const shutdown = async (signal: string) => {
  console.info(`\nReceived ${signal}, shutting down gracefully...`);

  try {
    server.close(() => {
      console.info("HTTP server closed.");
    });

    setTimeout(() => {
      console.warn("Force exiting process.");
      process.exit(1);
    }, 10000).unref();
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
