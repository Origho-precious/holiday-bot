import path from "path";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { getEnvFile } from "./utils/helperFunctions";
import { slackEventHandler } from "./controllers/event.controller";

dotenv.config({
  path: path.resolve(__dirname, "..", "..", getEnvFile(process.env.NODE_ENV)),
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("🌚 Holiday notice API here, howdy?");
});

app.post("/slack/events", slackEventHandler);

app.use((req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: `Not Found - ${req.method} ${req.originalUrl}`,
    },
  });
});

export default app;
