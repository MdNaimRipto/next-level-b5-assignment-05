import { Schema, model } from "mongoose";
import { ISos } from "./sos.interface";

const SosSchema = new Schema<ISos>({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  rideId: { type: String, required: true, unique: true },
  status: { type: Boolean, required: true, default: false },
});

export const Sos = model<ISos>("Sos", SosSchema);
