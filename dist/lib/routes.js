"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const redis_1 = __importDefault(require("./redis"));
// import uuid from 'uuid/v4';
const logger_1 = __importDefault(require("./utils/logger"));
// import https from 'http';
// import asyncRoute from './async-route';
const router = express_1.Router();
const { redisClient } = redis_1.default.getInstances();
// const asyncScan = util.promisify(redisClient.scan);
// import redis, {ClientOpts} from 'redis';
// const options: ClientOpts = {
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT === undefined ? 6379 : process.env.REDIS_PORT as unknown as number,
//   retry_strategy: () => 1000,
// };
const id = 'foo:1000'; // uuid();
let scanCursor = '0';
let scanMatches = [];
function getAllHashTables(response, matches) {
    const results = [];
    matches.forEach((key, i) => {
        redisClient.hgetall(key, (err, object) => {
            if (err) {
                throw err;
            }
            results.push({ key, data: object });
            if (i === matches.length - 1) {
                response.json(results);
            }
        });
    });
}
function hscan(request, response) {
    logger_1.default('start scanning');
    redisClient.scan(scanCursor, 'MATCH', request.body.scan.pattern, 'COUNT', request.body.scan.count, (err, reply) => {
        if (err) {
            throw err;
        }
        logger_1.default('scanning');
        scanCursor = reply[0];
        if (scanCursor === '0') {
            logger_1.default('scan complete');
            logger_1.default(reply);
            scanMatches = [...scanMatches, ...reply[1]];
            getAllHashTables(response, scanMatches);
            // response.json(scanMatches);
        }
        else {
            logger_1.default(`still scanning from next cursor ${scanCursor}`);
            scanMatches = [...scanMatches, ...reply[1]];
            // matches.push(reply[1]);
            hscan(request, response);
        }
    });
}
// const redisClient = redis.createClient(options);
// const sub = redisClient.duplicate();
// redisClient.on('connect', () => {
//   logger(`connected to redis`);
// });
// redisClient.on('error', (err) => {
//   logger(`Error: ${err}`);
// });
// sub.on('message', (channel, message) => {
//   logger(`Redis Channel ${channel} => ${message}\n`);
//   // process.stdout.write(`Redis Channel ${channel} => ${message}\n`);
// });
// const someRequest = async () => {
//   const url = 'https://reqres.in/api/users?delay=3';
//   // setTimeout(() => {
//   //   process.stdout.write('delay');
//   // }, 10000);
//   let val = 0;
//   for (let i = 0; i < 100000000; i++) {
//     val += i;
//   }
//   return JSON.stringify({url, val});
// };
// tslint:disable-next-line:variable-name
// const route = async (_request: Request, response: Response) => {
//   // const req = request;
//   // process.stdout.write(JSON.stringify(req));
//   const res = await someRequest();
//   response.json(res);
// };
// const asRoute = asyncRoute(route);
// https.get('https://reqres.in/api/users?delay=3', (res) => {
//   res.setEncoding('utf8');
//   let body = '';
//   res.on('data', (data) => {
//     body += data;
//   });
//   res.on('end', () => {
//     body = JSON.parse(body);
//     return body;
//   });
// });
// router.get('/read/:id', asRoute);
router.get('/read/:id', async (request, response) => {
    // specific element
    // const result = await asyncRoute(request.body);
    // process.stdout.write(JSON.stringify(result));
    response.json(request.body);
    // response.send(request.url);
});
router.post('/write', (request, response) => {
    // new elememt
    redisClient.hset(id, 'body', request.body);
    response.send(request.url);
});
router.post('/patch/:id', (request, response) => {
    // update specific element
    response.send(request.url);
});
router.post('/remove/:id', (request, response) => {
    // remove specifc element
    response.send(request.url);
});
router.post('/find', (request, response) => {
    // get all elements
    // logger(`requeest body :\n ${JSON.stringify(request.body)}`);
    // logger('before scan');
    scanMatches = [];
    hscan(request, response);
});
// subClient.subscribe('read');
// subClient.subscribe('write');
exports.default = router;
