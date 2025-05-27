import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiRouter } from "./routes/root.js";
import { Env } from "./utils/env.js";

const app = express();
app.use(
  cors({
    origin: Env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", ApiRouter);

app.listen(Env.PORT, () => {
  console.info(`Server running on port ${Env.PORT}`);
});
