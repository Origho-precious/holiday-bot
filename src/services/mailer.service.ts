import path from "path";
import dotenv from "dotenv";
import { MailtrapClient } from "mailtrap";
import { EMAIL_TEMPLATE_UUIDS } from "../constants";
import { getEnvFile } from "../utils/helperFunctions";

dotenv.config({
  path: path.resolve(__dirname, "..", "..", getEnvFile(process.env.NODE_ENV)),
});

const TOKEN = process.env.MAILTRAP_TOKEN as string;
const ENDPOINT = process.env.MAILTRAP_API_ENDPOINT as string;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: process.env.MAILTRAP_SENDER_EMAIL as string,
  name: "Holiday Notice",
};

const sendEmailWithTemplate = async (
  email: string,
  template_uuid: string,
  template_variables: Record<string, string | number | boolean> | undefined
) => {
  const recipients = [{ email }];

  const result = await client.send({
    from: sender,
    to: recipients,
    template_uuid,
    template_variables,
  });

  if (!result?.success) {
    console.log("Email not sent");
  }

  return result;
};

const sendHolidayNotice = async (
  email: string,
  receiverName: string,
  upcomingHolidays: string[]
) => {
  try {
    await sendEmailWithTemplate(email, EMAIL_TEMPLATE_UUIDS.holidayNotice, {
      user_name: receiverName,
      upcoming_holidays: upcomingHolidays as unknown as string,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  sendHolidayNotice,
};
