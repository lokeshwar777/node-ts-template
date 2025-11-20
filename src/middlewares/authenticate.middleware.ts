import type { Request, Response, NextFunction } from "express";
import { ERRORS } from "../constants/index.js";

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// inject user data into req.user after verification
	if (req.session.user) {
		req.user = req.session.user;
		next();
		return;
	}
	const error = ERRORS.UNAUTHORIZED;
	res.status(error.statusCode).json(error.toJSON());
};
