import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { ApiRouter } from "./routes/root";
import { Env } from "./utils/env";

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

app.listen(Env.PORT, () => {
  console.info(`Server running on port ${Env.PORT}`);
});
