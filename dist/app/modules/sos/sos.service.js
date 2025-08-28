"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SosService = void 0;
const sos_schema_1 = require("./sos.schema");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const requestSos = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = payload;
    const isAlreadyRequested = yield sos_schema_1.Sos.findOne({ rideId, status: false });
    if (isAlreadyRequested) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "SOS Already Requested");
    }
    const sos = yield sos_schema_1.Sos.create(payload);
    return sos;
});
const getSosByRideId = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield sos_schema_1.Sos.findOne({ rideId });
});
const updateSosStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isSosExists = yield sos_schema_1.Sos.findOne({ _id: id });
    if (!isSosExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "SOS Not Found");
    }
    return yield sos_schema_1.Sos.findOneAndUpdate({ _id: id }, { status: true });
});
exports.SosService = {
    requestSos,
    getSosByRideId,
    updateSosStatus,
};
