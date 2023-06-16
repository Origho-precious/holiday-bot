import moment from "moment";
import Holiday from "../models/holiday.model";
import { SLACK_BOT_COMMANDS } from "../constants";
import { IHoliday } from "../interfaces/IEvent.interface";

const getMonthName = (month: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[month - 1];
};

const getEnvFile = (environment: string | undefined) => {
  switch (environment) {
    case "production":
      return "prod.env";
    default:
      return ".env";
  }
};

const formatHoliday = (holiday: IHoliday) => {
  return `${holiday.title} - ${moment(holiday.startDate).format(
    "MMMM Do YYYY"
  )} (${
    holiday.past
      ? "past"
      : holiday.status === "cancelled"
      ? "cancelled"
      : "upcoming"
  })\n`;
};

const handleSlackCommand = async (
  command: string,
  event_type: "app_mention" | "message" = "message",
  user?: string
) => {
  if (event_type === "app_mention") {
    return `Hi <@${user}>! At the moment, I can't respond to channel mentions I only send notices here, but I can help with a few commands in my DM.
    Send "help" in my DM to see a list of commands I can help you with.`;
  }

  if (command.toLowerCase() === SLACK_BOT_COMMANDS.help) {
    return (
      "I can help you with the following commands:\n\n" +
      "1. list - list all the holidays for the current month\n" +
      "2. list <month> - list all the holidays for the specified month\n" +
      "3. list year - list all the holidays this year\n" +
      "4. help - list all the commands I can help you with\n" +
      `*Explanation:*\n` +
      "To list holidays for the current month, type: `list`\n" +
      "To list holidays for any other month, type: `list <month>`\n" +
      "For example, to list holidays for January, type: `list january`\n" +
      "To list holidays for the current year, type: `list year`\n" +
      "Note: You can only list holidays for the current year"
    );
  } else if (command.split(" ")[0].toLowerCase() === SLACK_BOT_COMMANDS.list) {
    const month = command.split(" ")[1];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // if month is a number
    if (parseInt(month)) {
      return "Please enter a valid month name. Type `help` to see a list of commands I can help you with.";
    }

    // Handling `list year` command
    if (month === "year") {
      const holidays = await Holiday.find({
        startDate: {
          $gte: new Date(`${currentYear}-01-01`).toISOString(),
          $lte: new Date(`${currentYear}-12-31`).toISOString(),
        },
      });

      if (holidays.length === 0) {
        return `There are no holidays for ${currentYear}`;
      }

      const holidaysList = holidays
        .map((holiday) => formatHoliday(holiday))
        .join("\n");

      return `*Here are the holidays for ${currentYear}:*\n\n${holidaysList}`;
    }

    // Handling `list` command
    if (!month) {
      const holidays = await Holiday.find({
        startDate: {
          $gte: new Date(`${currentYear}-${currentMonth}-01`).toISOString(),
          $lte: new Date(`${currentYear}-${currentMonth}-31`).toISOString(),
        },
      });

      if (holidays.length === 0) {
        return `There are no holidays for ${getMonthName(currentMonth)}`;
      }

      const holidaysList = holidays
        .map((holiday) => formatHoliday(holiday))
        .join("\n");

      return `*Here are the holidays for ${getMonthName(
        currentMonth
      )}:*\n\n${holidaysList}`;
    }

    // HANDLING `list <month>` command

    //Validate month name
    if (
      [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ].indexOf(month.toLowerCase()) === -1
    ) {
      return "Please enter a valid month name. Type `help` to see a list of commands I can help you with.";
    }

    const monthNumber = moment().month(month).format("M");
    console.log(month, monthNumber);

    const holidays = await Holiday.find({
      startDate: {
        $gte: new Date(`${currentYear}-${monthNumber}-01`).toISOString(),
        $lte: new Date(`${currentYear}-${monthNumber}-31`).toISOString(),
      },
    });

    if (holidays.length === 0) {
      return `There are no holidays for ${month}`;
    }

    const holidaysList = holidays
      .map((holiday) => formatHoliday(holiday))
      .join("\n");

    return `*Here are the holidays for ${month}:*\n\n${holidaysList}`;
  } else {
    return "I don't understand that command. Type `help` to see a list of commands I can help you with.";
  }
};

export { getEnvFile, getMonthName, handleSlackCommand, formatHoliday };
