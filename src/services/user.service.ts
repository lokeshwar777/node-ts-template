import type { ISessionUser } from "../types/auth.interface.js";
import type { IUser } from "../types/user.interface.js";

// return IUser instead of ISessionUser after DB integration
const getUserProfile = async (user: ISessionUser): Promise<ISessionUser> => {
	// 1. check whether the user exists or not using id
	// 2. fetch user profile data from DB/API/cookies with id
	// 2. sent the data as response

	// mock DB data retrieval using user session data
	const { id, username, role } = await user;
	const userData: ISessionUser = {
		id,
		username,
		role,
	};
	return userData;
};

const changeUserPassword = async (
	userId: string,
	newPassword: string,
): Promise<void> => {
	// 1. find user using id
	// 2. validate new password
	// 3. optinally check if it is a weak/old password
	// 4. change/update password & hash (optional)
	// 5. save new password
	// 6. send an ACK as a response
};

export const userServices = {
	getUserProfile,
	changeUserPassword,
};
