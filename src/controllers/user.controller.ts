import type { Request, RequestHandler, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { userServices } from "../services/index.js";
import { ERRORS, RESPONSES } from "../constants/index.js";

const getProfile: RequestHandler = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { user } = req;
		// check for user existence
		if (!user) {
			// send appropriate error response
			const error = ERRORS.USER_NOT_FOUND;
			res.status(error.statusCode).json(error.toJSON());
			return;
		}
		const userData = await userServices.getUserProfile(user);
		const response = RESPONSES.OK(
			"User profile fetched successfully!",
			userData,
		);
		res.status(response.statusCode).json(response.toJSON());
	},
);

const changePassword: RequestHandler = asyncHandler(
	async (req: Request, res: Response): Promise<void> => {
		const { password: newPassword } = req.body!; // non-null assertion (guarantee)
		const userId = req.user?.id; // safe
		// check for existence of newPassword & userId
		if (!userId || !newPassword) {
			// send appropriate error response
			return;
		}
		await userServices.changeUserPassword(userId, newPassword);
		const response = RESPONSES.OK("Password changed successfully!");
		res.status(response.statusCode).json(response.toJSON());
	},
);

export const userHandlers = {
	getProfile,
	changePassword,
};
