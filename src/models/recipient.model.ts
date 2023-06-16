import mongoose from "mongoose";
import IRecipient from "../interfaces/IRecipient.interface";

const { Schema } = mongoose;

const recipientSchema = new Schema<IRecipient>(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Recipient = mongoose.model("Recipient", recipientSchema);

export default Recipient;
