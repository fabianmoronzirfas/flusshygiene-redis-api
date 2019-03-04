"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flusshygiene_utils_1 = __importDefault(require("@tsb/flusshygiene-utils"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
// import RDS from './redis';
// import logger from './utils/logger';
const PORT = process.env.REDIS_EXPRESS_PORT || 6004;
const log = flusshygiene_utils_1.default(PORT);
const server = http_1.default.createServer(app_1.default);
// const {redisClient, subClient} = RDS.getInstances();
server.listen(PORT, log);
// logger(process.env.REDIS_HOST);
// logger(redisClient.server_info);
// logger(subClient.server_info);
