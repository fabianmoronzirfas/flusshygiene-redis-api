"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultErrorHandler = (error) => {
    process.stderr.write(`${error}`);
    throw error;
};
// type AsyncRoute = (req: Request, res: Response, next?: ErrorHandler) => any;
const asyncRoute = (route) => (req, res, next = defaultErrorHandler) => {
    Promise.resolve(route(req, res)).catch(next);
};
exports.default = asyncRoute;
