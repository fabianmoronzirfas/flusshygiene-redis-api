"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
// import redisCommands from 'redis-commands';
// import util from 'util';
const logger_1 = __importDefault(require("./utils/logger"));
let nodeDevInDocker = false;
if (process.env.NODE_DOCKER_ENV === '1') {
    nodeDevInDocker = true;
    logger_1.default('we are running in a container');
}
else if (process.env.NODE_DOCKER_ENV === '0') {
    logger_1.default('we are running on your machine');
    nodeDevInDocker = false;
}
else {
    logger_1.default('"process.env.NODE_DOCKER_ENV" is not defined What is your env?');
}
const options = {
    host: nodeDevInDocker === true ? process.env.REDIS_HOST : '127.0.0.1',
    port: process.env.REDIS_PORT === undefined ? 6379 : process.env.REDIS_PORT,
    retry_strategy: () => 1000,
};
class RDS {
    static getInstances() {
        if (!this.redisClient) {
            // this.promisify(redis.RedisClient.prototype, redisCommands.list);
            // this.promisify(redis.Multi.prototype, ['exec', 'execAtomic']);
            this.redisClient = redis_1.default.createClient(options);
            if (!this.redisSubscribeClient) {
                this.redisSubscribeClient = this.redisClient.duplicate();
            }
        }
        this.redisClient.on('connect', () => {
            logger_1.default(`redisClient connected to redis`);
        });
        this.redisClient.on('error', (err) => {
            logger_1.default(`redisClient Error: ${err}`);
        });
        this.redisSubscribeClient.on('connect', () => {
            logger_1.default(`redisSubscribeClient connected to redis`);
        });
        this.redisSubscribeClient.on('error', (err) => {
            logger_1.default(`redisSubscribeClient Error: ${err}`);
        });
        this.redisSubscribeClient.on('message', (channel, message) => {
            logger_1.default(`Redis Channel ${channel} => ${message}\n`);
        });
        this.redisSubscribeClient.subscribe('read');
        this.redisSubscribeClient.subscribe('write');
        return {
            redisClient: this.redisClient,
            subClient: this.redisSubscribeClient,
        };
    }
    // private static promisify(obj: any, methods: string[]) {
    //   methods.forEach((method: string) => {
    //     if (obj[method]) {
    //       obj[method + 'Async'] = util.promisify(obj[method]);
    //     }
    //   });
    // }
    constructor() { }
}
exports.default = RDS;
