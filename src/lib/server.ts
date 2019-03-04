import devlogGen from '@tsb/flusshygiene-utils';
import http from 'http';
import app from './app';
// import RDS from './redis';
// import logger from './utils/logger';

const PORT = process.env.REDIS_EXPRESS_PORT || 6004;
const log = devlogGen(PORT);

const server = http.createServer(app);
// const {redisClient, subClient} = RDS.getInstances();

server.listen(PORT, log);
// logger(process.env.REDIS_HOST);
// logger(redisClient.server_info);
// logger(subClient.server_info);
