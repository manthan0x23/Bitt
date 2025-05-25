import express from "express";
import { CLIENT_URL, PORT } from "./utils/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiRouter } from "./routes/root.js";

const app = express();
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", ApiRouter);

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
