import express, { type Express } from "express";

const app: Express = express();

app.listen(6000, () => {
  console.log("App running on port ", 6000);
});
