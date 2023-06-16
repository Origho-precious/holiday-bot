import path from "path";
import dotenv from "dotenv";
import { WebClient } from "@slack/web-api";
import { SLACK_CHANNELS } from "../constants";
import { getEnvFile } from "../utils/helperFunctions";

dotenv.config({
  path: path.resolve(__dirname, "..", "..", getEnvFile(process.env.NODE_ENV)),
});

const slackClient = new WebClient(process.env.SLACK_TOKEN);

class SlackService {
  private client: WebClient;

  constructor() {
    this.client = slackClient;
  }

  public sendMessage = async (data: { message: string; channel: string }) => {
    try {
      const { message, channel } = data;

      await this.client.chat.postMessage({
        channel,
        text: message,
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

  public sendHolidayNotice = async (data: {
    notice: string;
    channel: keyof typeof SLACK_CHANNELS;
  }) => {
    try {
      const { notice: message, channel } = data;

      await this.sendMessage({
        channel: SLACK_CHANNELS[channel],
        message,
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };
}

export default SlackService;
