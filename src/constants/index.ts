const CALENDAR_REGION = "en.ng";
const CALENDAR_ID = "holiday@group.v.calendar.google.com";
const CALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars";

const EMAIL_TEMPLATE_UUIDS = {
  holidayNotice: "57033e7c-5882-4e54-adca-9381e793c38b",
};

const CRONDATE = {
  daily: "0 0 0 * * *",
  monthly: "0 0 0 1 * *",
  everyOneMinute: "*/1 * * * *",
  everyTwoMinutes: "*/2 * * * *",
  everyFiveMinutes: "*/5 * * * *",
  everyFriday: "0 0 0 * * 5",
};

const SLACK_CHANNELS = {
  cr3st_test: "C05CD5WC0FM",
};

const SLACK_BOT_COMMANDS = {
  help: "help",
  list: "list",
};

export {
  CRONDATE,
  CALENDAR_ID,
  CALENDAR_URL,
  SLACK_CHANNELS,
  CALENDAR_REGION,
  SLACK_BOT_COMMANDS,
  EMAIL_TEMPLATE_UUIDS,
};
