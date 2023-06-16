import path from "path";
import dotenv from "dotenv";
import Recipient from "../models/recipient.model";
import connectMongoDB from "../configs/mongodb.config";
import IRecipient from "../interfaces/IRecipient.interface";
import { getEnvFile } from "../utils/helperFunctions";

dotenv.config({
  path: path.resolve(__dirname, "..", "..", getEnvFile(process.env.NODE_ENV)),
});

connectMongoDB();

const seedRecipients = async (recipients: IRecipient[]) => {
  if (!recipients.length) {
    console.log("[SCRIPT] No recipients to seed!");
    return;
  }

  try {
    console.log("[SCRIPT] Seeding recipients...");

    await Recipient.bulkWrite(
      recipients.map((recipient) => ({
        updateOne: {
          filter: { email: recipient.email },
          update: recipient,
          upsert: true,
        },
      }))
    );

    console.log("[SCRIPT] Recipients seeded successfully!");
  } catch (error: any) {
    console.log(error.message);
  }
};

seedRecipients([]).then(() => process.exit(0));
