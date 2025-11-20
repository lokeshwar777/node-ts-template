import type { Request, RequestHandler, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { authServices } from "../services/index.js";
import { RESPONSES } from "../constants/index.js";
import { logger } from "../logger/index.js";
import APIError from "../utils/APIError.js";
import { destroySession } from "../utils/auth.utils.js";

const registerHandler: RequestHandler = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const result = await authServices.registerUser(req.body);
		const response = RESPONSES.CREATED(
			"User registered successfully!",
			result,
		);
		res.status(response.statusCode).json(response.toJSON());
	},
);

const loginHandler: RequestHandler = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { user: userSession, message } = await authServices.loginUser(
			req.body,
		);
		// create a session for user and send to client
		req.session.user = userSession;
		const response = RESPONSES.OK(message);
		res.status(response.statusCode).json(response.toJSON());
	},
);

const logoutHandler: RequestHandler = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		// destroy the cookie
		await destroySession(req.session);
		const { message } = await authServices.logoutUser(req.user);
		const response = RESPONSES.OK(message);
		res.status(response.statusCode).json(response.toJSON());
	},
);

export const authHandlers = { registerHandler, loginHandler, logoutHandler };
