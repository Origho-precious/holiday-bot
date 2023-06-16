import mongoose from "mongoose";
import { IHoliday } from "../interfaces/IEvent.interface";

const { Schema } = mongoose;

const holidaySchema = new Schema<IHoliday>(
  {
    month: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    past: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Holiday = mongoose.model<IHoliday>("Holiday", holidaySchema);

export default Holiday;
