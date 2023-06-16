import path from "path";
import dotenv from "dotenv";
import Holiday from "../models/holiday.model";
import Calendar from "../services/calendar.service";
import { getEnvFile } from "../utils/helperFunctions";
import connectMongoDB from "../configs/mongodb.config";

dotenv.config({
  path: path.resolve(__dirname, "..", "..", getEnvFile(process.env.NODE_ENV)),
});

connectMongoDB();

const calendar = new Calendar();

const getHolidaysForAYear = async (year: number) => {
  try {
    console.log(`[SCRIPT] Fetching holidays for the year ${year}...`);
    const holidays = await calendar.getHolidaysForAYear(year);

    console.log(`[SCRIPT] Successfully fetched holidays for the year ${year}!`);

    // Performing bulk write operation with upsert to avoid duplicates
    await Holiday.bulkWrite(
      holidays.map((holiday) => ({
        updateOne: {
          filter: { title: holiday.title },
          update: holiday,
          upsert: true,
        },
      }))
    );

    console.log("[SCRIPT] Holidays saved to DB successfully!");
  } catch (error: any) {
    console.log(error.message);
  }
};

getHolidaysForAYear(2023).then(() => process.exit(0));
