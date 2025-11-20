import type {
	Request,
	Response,
	ErrorRequestHandler,
	NextFunction,
} from "express";
import APIError from "../utils/APIError.js";
import { ERRORS } from "../constants/index.js";
import { logger } from "../logger/index.js";

const globalErrorHandler: ErrorRequestHandler = (
	err: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	const error = err instanceof APIError ? err : ERRORS.INTERNAL_SERVER_ERROR;

	// inject error so that pino-http can recognise it
	res.err = error;

	// optional logging for safety but redundancy
	// req.log.error(error, `Error : ${error.name} - ${error.message}`);

	res.status(error.statusCode).json(error.toJSON());
};

const connectionErrorHandler = (
	err: AggregateError | Error,
	context: string,
): void => {
	if (err instanceof AggregateError) {
		for (const subErr of err.errors) {
			logger.error(`AggregateError in ${context} \n${subErr.stack}`);
		}
	} else {
		logger.error(`Error in ${context} \n${err.stack}`);
	}
};

export { globalErrorHandler, connectionErrorHandler };
