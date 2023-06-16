import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { getEnvFile, getMonthName } from "../utils/helperFunctions";
import GoogleCalendarEvent, { IHoliday } from "../interfaces/IEvent.interface";
import { CALENDAR_ID, CALENDAR_URL, CALENDAR_REGION } from "../constants";

dotenv.config({
  path: path.resolve(__dirname, "..", "..", getEnvFile(process.env.NODE_ENV)),
});

class Calendar {
  private apiKey: string;
  private readonly calendarUrl: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_CALENDAR_API_KEY as string;
    this.calendarUrl = `${CALENDAR_URL}/${CALENDAR_REGION}%23${CALENDAR_ID}/events?key=${this.apiKey}`;
  }

  private fetchHolidays = async (timeMin: string, timeMax: string) => {
    try {
      const url = `${this.calendarUrl}&timeMin=${timeMin}&timeMax=${timeMax}`;
      const response = await axios.get(url);
      const events: GoogleCalendarEvent[] = response.data.items || [];

      return events
        .map((event) => {
          return {
            status: event.status,
            title: event.summary,
            description: event.description,
            startDate: new Date(event.start.date).toISOString(),
            past: new Date(event.start.date).getTime() < Date.now(),
            month: getMonthName(new Date(event.start.date).getMonth() + 1),
          };
        })
        .sort((a, b) => {
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

  public getHolidaysForAYear = async (year = 2023) => {
    try {
      const timeMin = new Date(`${year}-01-01`).toISOString();
      const timeMax = new Date(`${year}-12-31`).toISOString();

      const events: IHoliday[] = await this.fetchHolidays(timeMin, timeMax);
      return events;
    } catch (error: any) {
      console.error(`Error fetching holidays for ${year}:`, error?.message);
      throw new Error(error?.message);
    }
  };

  public getHolidaysForAMonth = async (month: number) => {
    const year = new Date().getFullYear();

    try {
      const timeMin = new Date(`${year}-${month}-01`).toISOString();
      const timeMax = new Date(`${year}-${month}-31`).toISOString();

      const events: IHoliday[] = await this.fetchHolidays(timeMin, timeMax);
      return events;
    } catch (error: any) {
      console.error(
        `Error fetching holidays for ${getMonthName(month)} ${year}:`,
        error?.message
      );
      throw new Error(error?.message);
    }
  };
}

export default Calendar;
