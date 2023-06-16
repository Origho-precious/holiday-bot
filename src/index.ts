import path from "path";
import http from "http";
import dotenv from "dotenv";
import app from "./app";
import CronService from "./services/cron.service";
import { getEnvFile } from "./utils/helperFunctions";
import connectMongoDB from "./configs/mongodb.config";

dotenv.config({
  path: path.resolve(__dirname, "..", "..", getEnvFile(process.env.NODE_ENV)),
});

connectMongoDB().then(() => {
  // RUN CRONS
  console.log("Running crons...");
  const cronService = new CronService();

  cronService.handleHolidaysDueInAWeek();
  cronService.refreshHolidays();
});

const server = http.createServer(app);

const port = (process.env.PORT as unknown as number) || 8080;

server.listen(port, () => {
  console.log(`⚡️[SERVER]: Server is running at http://localhost:${port} 💨`);
});
