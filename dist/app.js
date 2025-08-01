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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const pathNotFoundErrorHandler_1 = __importDefault(require("./errors/pathNotFoundErrorHandler"));
const router_1 = require("./app/routes/router");
const app = (0, express_1.default)();
// ? Middlewares:
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// * Basic Page
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(http_status_1.default.OK).send({
        message: "Assignment 05 Server Running Successfully",
        statusCode: http_status_1.default.OK,
    });
}));
//* Main endpoint
app.use("/v1.0.0/apis", router_1.Routers);
//* Global error Handler
app.use(globalErrorHandler_1.default);
//* Path Not Found Error Handler
app.use(pathNotFoundErrorHandler_1.default);
exports.default = app;
