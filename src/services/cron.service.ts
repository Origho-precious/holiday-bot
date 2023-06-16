import moment from "moment";
import Cron from "../crons";
import Calendar from "./calendar.service";
import SlackService from "./slack.service";
import Holiday from "../models/holiday.model";
import { SLACK_CHANNELS } from "../constants";
import mailer from "../services/mailer.service";
import Recipient from "../models/recipient.model";

class CronService {
  private cron = new Cron();
  private calendar = new Calendar();
  private slack = new SlackService();
  private readonly slackChannels = Object.keys(
    SLACK_CHANNELS
  ) as (keyof typeof SLACK_CHANNELS)[];

  public handleHolidaysDueInAWeek = async () => {
    await this.cron.runJobEveryFriday(async () => {
      try {
        // Find holidays due in a week
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        let holidays = await Holiday.find({
          startDate: {
            $gte: today.toISOString(),
            $lte: nextWeek.toISOString(),
          },
        });

        // Remove holidays that fall on sat/sun
        holidays = holidays.filter((holiday) => {
          const day = moment(holiday.startDate).day();
          return day !== 0 && day !== 6;
        });

        if (holidays.length === 0) {
          console.log("[CRON] No holidays due in a week!");
          return;
        }

        console.log("[CRON] Found Holidays due in a week:");

        const formattedHolidays = holidays.map(
          (holiday) =>
            `${holiday.title} - ${moment(holiday.startDate).format(
              "MMMM Do YYYY"
            )} (${holiday.status})`
        );

        const recipients = await Recipient.find();

        // Send notices via email
        if (recipients.length) {
          try {
            await Promise.all(
              recipients.map(async (person) => {
                await mailer.sendHolidayNotice(
                  person.email,
                  person.name,
                  formattedHolidays
                );
              })
            );

            console.log("[CRON] Emails notices sent successfully!");
          } catch (error: any) {
            console.log(error?.message);
            console.log(
              `[CRON] Error occurred while sending email notices: ${error?.message}`
            );
          }
        }

        // Send notice via slack
        if (this.slackChannels.length) {
          try {
            const notice = `*Holidays due in a week:*\n${formattedHolidays
              .map((holiday) => `• ${holiday}`)
              .join("\n")}
            `;

            await Promise.all(
              this.slackChannels.map(async (channel) => {
                await this.slack.sendHolidayNotice({
                  channel,
                  notice,
                });
              })
            );

            console.log("[CRON] Slack notices sent successfully!");
          } catch (error: any) {
            console.log(error?.message);
            console.log(
              `[CRON] Error occurred while sending slack notices: ${error?.message}`
            );
          }
        }
      } catch (error: any) {
        console.log(error?.message);
        console.log(
          `[CRON] Error occurred while sending holiday notices: ${error?.message}`
        );
      }
    });
  };

  public refreshHolidays = async () => {
    await this.cron.runJobEveryDay(async () => {
      const year = new Date().getFullYear();

      try {
        await Holiday.deleteMany({});

        let holidays = await this.calendar.getHolidaysForAYear(year);

        holidays = holidays.map((holiday) => ({
          ...holiday,
          past: new Date(holiday.startDate).getTime() < Date.now(),
        }));

        console.log(
          `[CRON] Successfully fetched holidays for the year ${year}!`
        );

        await Holiday.insertMany(holidays);

        console.log("[CRON] Holidays saved to DB successfully!");
      } catch (error: any) {
        console.log(
          `[CRON] Error occurred while fetching holidays for the year ${year}: ${error.message}`
        );
      }
    });
  };
}

export default CronService;
