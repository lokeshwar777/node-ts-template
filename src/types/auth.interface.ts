import type { UUID } from "node:crypto";
import type { Role } from "./user.interface.js";

export interface ISessionUser {
	id: UUID;
	username: string;
	role: Role;
	// email?: string, // only when completely necessary
}

export interface IAuthResponse {
	user?: ISessionUser;
	message: string;
}
