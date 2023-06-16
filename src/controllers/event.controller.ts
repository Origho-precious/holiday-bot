import { Request, Response } from "express";
import SlackService from "../services/slack.service";
import { handleSlackCommand } from "../utils/helperFunctions";

const slack = new SlackService();

export const slackEventHandler = async (req: Request, res: Response) => {
  try {
    const { challenge, event, token } = req.body;

    // Verify the request authenticity
    if (token !== process.env.SLACK_VERIFICATION_TOKEN) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Handle challenge request
    if (challenge) {
      return res.send(challenge);
    }

    if (event) {
      res.sendStatus(200);

      if (event.bot_id || event.bot_profile) return;

      // DMs
      if (event.type === "message") {
        console.log("[SLACK] MSG EVENT");

        let response = "";

        const { text, channel, user } = event;

        if (["hi", "hello", "hey", "howdy"].includes(text.toLowerCase())) {
          response = `Hello <@${user}>! :wave: I am the Holiday Notice Bot 🙂. I can help you with a few commands. Type "help" to see them.`;
        } else {
          response = await handleSlackCommand(text);
        }

        await slack.sendMessage({
          channel,
          message: response,
        });
      }

      // Mentions in Channels
      if (event.type === "app_mention") {
        console.log("[SLACK] APP MENTION EVENT");

        const { text, channel, user } = event;

        const response = await handleSlackCommand(text, "app_mention", user);

        await slack.sendMessage({
          channel,
          message: response,
        });
      }
    }
  } catch (error: any) {
    console.log(error?.message);
    console.log(
      `Error occurred while responding to slack event: ${error?.message}`
    );
  }
};
