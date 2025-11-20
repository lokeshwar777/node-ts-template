// async hashing password
// async verify/check password
// async sign JWT

import type { Session } from "express-session";
import APIError from "./APIError.js";

const destroySession = async (session: Session): Promise<void> =>
	await new Promise<void>((resolve, reject) => {
		session.destroy((err) => {
			if (!err) {
				return resolve();
			}
			reject(
				new APIError(
					"Error destroying session!",
					500,
					"SESSION_DESTROY_FAILED",
				),
			);
		});
	});

export { destroySession };
