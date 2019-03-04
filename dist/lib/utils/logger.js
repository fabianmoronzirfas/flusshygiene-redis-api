"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param data T a development logger  that logs to stderr and stdout
 * @param prodLog boolean Set it to true if you want to log during production
 */
function default_1(data, prodLog) {
    if (process.env.NODE_ENV === 'development' || prodLog === true) {
        if (data instanceof Error) {
            process.stderr.write(`${data.message}\n`);
        }
        else {
            process.stdout.write(`${JSON.stringify(data)}\n`);
        }
    }
}
exports.default = default_1;
