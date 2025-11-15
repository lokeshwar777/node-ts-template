import { pinoHttp } from "pino-http";
import { logger } from "../logger/index.js";
import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";

const httpLogger = pinoHttp({
	logger,

	// autoLogging: false, // disable HTTP logs

	genReqId: function (req: Request, res: Response) {
		const existingID = req.id ?? req.headers["x-request-id"];
		if (existingID) {
			return existingID;
		}
		const id = randomUUID();
		res.setHeader("X-Request-Id", id);
		return id;
	},

	// display the loggable object instead of request: {...} just after recieving request
	// customReceivedObject: (req, res, loggableObject) => ({}), // some object {...}

	// message to be displayed just after recieving request
	// customReceivedMessage: (req, res) => "someString/Message",

	// originalUrl is injected by Expresssss
	customSuccessMessage: (req: Request, res: Response, responseTime: number) =>
		`${req.method} ${req.originalUrl} - ${res.statusCode} -> ${responseTime}ms`,

	// replace loggableObject {res, responseTime} after success
	// customSuccessObject: (req, res, loggableObject) => ({}), // empty object ({})

	customErrorMessage: (req: Request, res: Response, err: Error | undefined) =>
		`${req.method} ${req.originalUrl} - ${res.statusCode} -X-> ${err?.message}`,

	// replace customErrorObject {error} after success
	// customErrorObject: (req, res, loggableObject) => ({}),

	customLogLevel: (req: Request, res: Response, err) => {
		if (res.statusCode >= 500 || err) {
			return "error";
		}
		if (res.statusCode >= 400) {
			return "warn";
		}
		return "info";
	},

	// readability++
	customAttributeKeys: {
		req: "request",
		res: "response",
		err: "error",
		responseTime: "timeTaken",
	},

	serializers: {
		// inbuilt object stucture - for debugging
		/* 
		err: pino.stdSerializers.err, // type, message, stack
		res: pino.stdSerializers.res, // statusCode
        req: pino.stdSerializers.req, // method, url headers
        */

		// clean logging
		request: () => undefined,
		response: () => undefined,
		err: (err) => {
			const base: { [key: string]: unknown } = {
				name: err.name ?? err.type,
				message: err.message,
				statusCode: err.statusCode,
				errorCode: err.errorCode,
			};
			if (err.details) {
				base["details"] = err.details;
			}
			return base;
		},
		timeTaken: () => undefined,
	},

	// when custom serializers are defined
	// wrapSerializers: true,
});
export { httpLogger };

// REF - https://github.com/pinojs/pino-http
