"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sos = void 0;
const mongoose_1 = require("mongoose");
const SosSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    rideId: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true, default: false },
});
exports.Sos = (0, mongoose_1.model)("Sos", SosSchema);
