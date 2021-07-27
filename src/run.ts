require("dotenv").config();

import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import markets from "./routes/markets";
import orders from "./routes/orders";
import account from "./routes/account";
import positions from "./routes/positions";

export function run() {
  const app = express();

  app.set("trust proxy", true);
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/markets", markets);
  app.use("/orders", orders);
  app.use("/account", account);
  app.use("/positions", positions);

  app.use(helmet());

  app.listen(3000);
}
